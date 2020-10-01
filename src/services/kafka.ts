import { Kafka } from 'kafkajs'

const getTopics = (hosts: string) => {
  const kafka = new Kafka({
    clientId: 'my-app',
    brokers: [hosts]
  })
  return kafka.admin().listTopics()
  // .then(ts => kafka.admin().fetchTopicMetadata({ topics: ts }))
}

export default {
  getTopics
}
