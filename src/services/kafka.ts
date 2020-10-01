import { Consumer, Kafka, CompressionTypes, CompressionCodecs } from 'kafkajs'
// @ts-ignore
import SnappyCodec from 'kafkajs-snappy'

CompressionCodecs[CompressionTypes.Snappy] = SnappyCodec

const getTopics = (hosts: string) => {
  const kafka = new Kafka({
    clientId: 'my-app',
    brokers: [hosts]
  })
  return kafka.admin().listTopics()
  // .then(ts => kafka.admin().fetchTopicMetadata({ topics: ts }))
}

const getMessages = async (brokers: string[], groupId: string, topic: string, cb: Function) => {
  const kafka = new Kafka({
    clientId: 'kafkavue',
    brokers
  })
  const consumer: Consumer = kafka.consumer({
    groupId
  })
  await consumer.connect()
  await consumer.subscribe({ topic })
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      cb(topic, partition, message)
    }
  })
  setTimeout(() => {
    consumer.stop()
  }, 10000)
}

export default {
  getTopics,
  getMessages
}
