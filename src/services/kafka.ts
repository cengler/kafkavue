import { CompressionCodecs, CompressionTypes, Consumer, Producer, Kafka } from 'kafkajs'
// @ts-ignore
import SnappyCodec from 'kafkajs-snappy'
import Status, { StatusCode } from '@/model/Status'

CompressionCodecs[CompressionTypes.Snappy] = SnappyCodec
const clientId = 'kafkavue' // TODO ver si es fijo
let consumer: Consumer
let producer: Producer
let timer: NodeJS.Timeout

const getTopics = (brokers: string[]) => {
  const kafka = new Kafka({
    clientId,
    brokers
  })
  return kafka.admin().listTopics()
    .then(ts => kafka.admin().fetchTopicMetadata({ topics: ts }))
}

const match = (rawMessage: string, filter: string) => {
  if (!filter) return true
  const words = filter.split(/\s/)
  return words.every(w => rawMessage.includes(w))
}

const getMessages = async (brokers: string[], topic: string, filter: string, fromBeginning: boolean, cb: Function) => {
  const groupId = 'caeycae' + Date.now() // TODO
  const kafka = new Kafka({
    clientId,
    brokers
  })
  consumer = kafka.consumer({
    groupId
  })
  await consumer.connect()
  await consumer.subscribe({ topic, fromBeginning })
  await consumer.run({
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
  }, 10000)
}

const startSender = async (brokers: string[], messages: string[], topic: string, time: number, loop: boolean) => {
  const kafka = new Kafka({
    clientId,
    brokers
  })
  producer = kafka.producer({
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
  if (producer) producer.disconnect().then(r => console.log('Producer disconnected'))
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

const getBrokers = (brokers: string[]) => {
  const kafka = new Kafka({
    clientId,
    brokers
  })
  return kafka.admin().describeCluster()
    .then(result => {
      return result.brokers
    })
}

const getConsumers = (brokers: string[]) => {
  const kafka = new Kafka({
    clientId,
    brokers
  })
  return kafka.admin().listGroups()
    .then(result => {
      return result.groups
    })
}

export default {
  getTopics,
  getMessages,
  test,
  getBrokers,
  getConsumers,
  stopConsumer,
  startSender,
  stopSender
}
