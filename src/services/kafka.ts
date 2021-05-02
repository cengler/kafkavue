import { Consumer, Kafka, CompressionTypes, CompressionCodecs } from 'kafkajs'
// @ts-ignore
import SnappyCodec from 'kafkajs-snappy'

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
      console.log('------------------->')
      cb(topic, partition, message)
    }
  })
  setTimeout(() => {
    consumer.stop()
  }, 10000)
}

const stopConsumer = () => {
  if (consumer) {
    consumer.stop()
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
  getConsumers
}
