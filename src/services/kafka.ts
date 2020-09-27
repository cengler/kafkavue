import { KafkaClient, MetadataResponse } from 'kafka-node'

const getTopics = (hosts: string) => {
  return new Promise((resolve, reject) => {
    const client = new KafkaClient({ kafkaHost: hosts })
    client.loadMetadataForTopics([], (err: string, results: MetadataResponse) => {
      if (err) return reject(err)
      const topics = Object
        .entries(results[1].metadata)
        .map(e => ({ topic: e[0], partitions: Object.keys(e[1]).length }))
        .filter(e => !e.topic.startsWith('__'))
      client.close()
      resolve(topics)
    })
  })
}

export default {
  getTopics
}
