import { CompressionCodecs, CompressionTypes, Consumer, Producer, Kafka, ConfigResourceTypes } from 'kafkajs'
// @ts-ignore
import SnappyCodec from 'kafkajs-snappy'
import Status, { StatusCode } from '@/model/Status'
import _ from 'lodash/'

CompressionCodecs[CompressionTypes.Snappy] = SnappyCodec
const clientId = 'kafkavue' // TODO ver si es fijo
const groupId = 'kafkavue'
let consumer: Consumer
let producer: Producer
let timer: NodeJS.Timeout

const kafkas: {kafka: Kafka; brokers: string[]}[] = []
const lastUpdated: {result: any; timestamp: number}[] = []

const REFRESH_INTERVAL_SECONDS = 10 // TODO: configurable

const getKafka = (brokers: string[]): Kafka => {
  const index = kafkas.findIndex(k => _.isEqual(k.brokers, brokers))
  if (index >= 0) {
    return kafkas[index].kafka
  } else {
    const kafka = new Kafka({
      clientId,
      brokers
    })
    kafkas.push({ kafka, brokers })
    return kafka
  }
}

function cached () {
  console.log('first(): factory evaluated')
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originMethod = descriptor.value
    descriptor.value = async (...args: any) => {
      const cachedElement = lastUpdated[originMethod]
      if (cachedElement && new Date().getTime() - (cachedElement.timestamp + REFRESH_INTERVAL_SECONDS * 1000) < 0) {
        console.log('cached')
        return cachedElement.result
      }
      console.log('not cached')
      // @ts-ignore
      const result = originMethod.apply(this, args)
      lastUpdated[originMethod] = { result: result, timestamp: new Date().getTime() }
      return result
    }
  }
}

const forBrokers = (brokers: string[]) => {
  const getTopicsMetadata = () => {
    return getKafka(brokers).admin().listTopics()
      .then(ts => getKafka(brokers).admin().fetchTopicMetadata({ topics: ts }))
  }

  const fetchTopicOffsets = (topic: string) => {
    return getKafka(brokers).admin().fetchTopicOffsets(topic)
  }

  const describeTopicConfigs = (topic: string) => {
    return getKafka(brokers).admin().describeConfigs({
      includeSynonyms: false,
      resources: [
        {
          type: ConfigResourceTypes.TOPIC,
          name: topic
        }
      ]
    })
      .then(dc => dc.resources[0].configEntries)
  }

  const getTopics = () => {
    return getKafka(brokers).admin().listTopics()
  }

  const createTopic = (topic: string, replicationFactor: number, numPartitions: number) => {
    return getKafka(brokers)
      .admin()
      .createTopics({ topics: [{ topic, numPartitions, replicationFactor }] })
  }

  const match = (rawMessage: string, filter: string) => {
    if (!filter) return true
    const words = filter.split(/\s/)
    return words.every(w => rawMessage.includes(w))
  }

  const getTopicPartitions = (topic: string) => {
    return getKafka(brokers).admin().fetchTopicMetadata().then(topics => {
      const topicInfo = topics.topics.find(t => t.name === topic)
      if (topicInfo) {
        return topicInfo.partitions.length
      }
      return 0
    })
  }

  const getMessages = async (topic: string, filter: string, fromBeginning: boolean, cb: Function) => {
    const kafka: Kafka = getKafka(brokers)
    consumer = kafka.consumer({
      groupId: groupId + new Date() // TODO
    })
    await consumer.connect()
    await consumer.subscribe({ topic, fromBeginning })
    await consumer.run({
      autoCommit: false,
      partitionsConsumedConcurrently: await getTopicPartitions(topic),
      eachMessage: async ({ topic, partition, message }) => {
        const rawMessage = message && message.value ? message.value.toString() : '{}'
        if (match(rawMessage, filter)) {
          const msg = {
            meta: {
              topic,
              partition,
              key: message.key ? message.key.toString() : 'no key'
            },
            msg: JSON.parse(rawMessage)
          }
          cb(msg)
        }
      }
    })
    setTimeout(() => {
      consumer.stop()
    }, 1000000)
  }

  const startSender = async (messages: string[], topic: string, time: number, loop: boolean) => {
    producer = getKafka(brokers).producer({
      allowAutoTopicCreation: false
    })
    let i = 0
    await producer.connect()
    timer = setInterval(() => {
      const message = { key: 'key' + i, value: messages[i % messages.length] }
      producer.send({
        topic,
        messages: [message]
      }).then(r => console.log('Sent: ', r.length ? r[0].baseOffset : 'unk'))
      i++
      if (!loop && i === messages.length) {
        clearInterval(timer)
      }
    }, time)
  }

  const stopSender = () => {
    if (timer) clearInterval(timer)
    if (producer) producer.disconnect().then(() => console.log('Producer disconnected'))
  }

  const stopConsumer = (): Promise<Status> => {
    if (consumer) {
      return consumer.stop()
        .then(() => new Status('Stopped ok', StatusCode.OK))
        .catch(e => new Status(`Error stopping consumer ${e}`, StatusCode.ERROR))
    } else {
      return Promise.resolve(new Status('No consumer to stop', StatusCode.ERROR))
    }
  }

  const getConsumers = () => {
    return getKafka(brokers).admin().listGroups().then(result => result.groups)
  }

  class Cached {
    @cached()
    static getConsumersMetadata () {
      console.log('get consumers metadata')
      return getKafka(brokers).admin().listGroups()
        .then(result => getKafka(brokers).admin().describeGroups(result.groups.map(g => g.groupId))
          .then(a => a.groups))
    }
  }

  const getConsumersMetadata = () => {
    return Cached.getConsumersMetadata()
  }

  return {
    getTopicsMetadata,
    getTopics,
    getConsumers,
    stopConsumer,
    startSender,
    stopSender,
    createTopic,
    getMessages,
    getConsumersMetadata,
    fetchTopicOffsets,
    describeTopicConfigs
  }
}

const getBrokers = (brokers: string[]) => {
  return getKafka(brokers).admin().describeCluster()
    .then(result => {
      return result.brokers
    })
}

const test = (brokersString: string) => {
  const brokers = brokersString.split(',')
  const kafka = new Kafka({
    clientId,
    brokers,
    retry: {
      retries: 1
    }
  })
  return kafka.admin().connect()
}

export default {
  test,
  forBrokers,
  getBrokers
}
