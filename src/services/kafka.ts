import { CompressionCodecs, CompressionTypes, Consumer, Kafka } from 'kafkajs'
// @ts-ignore
import SnappyCodec from 'kafkajs-snappy'
import Status, { StatusCode } from '@/model/Status'

CompressionCodecs[CompressionTypes.Snappy] = SnappyCodec
const clientId = 'kafkavue' // TODO ver si es fijo
let consumer: Consumer

const getTopics = (brokers: string[]) => {
  const kafka = new Kafka({
    clientId,
    brokers
  })
  return kafka.admin().listTopics()
    .then(ts => kafka.admin().fetchTopicMetadata({ topics: ts }))
}

const getMessages = async (brokers: string[], groupId: string, topic: string, cb: Function) => {
  const kafka = new Kafka({
    clientId,
    brokers
  })
  consumer = kafka.consumer({
    groupId
  })
  await consumer.connect()
  await consumer.subscribe({ topic, fromBeginning: true })
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      cb(topic, partition, message)
    }
  })
  setTimeout(() => {
    consumer.stop()
  }, 10000)
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
  stopConsumer
}
