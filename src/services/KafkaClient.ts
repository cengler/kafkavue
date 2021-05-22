import {
  CompressionCodecs,
  CompressionTypes,
  Consumer,
  Producer,
  Kafka,
  ConfigResourceTypes,
  GroupOverview
} from 'kafkajs'
// @ts-ignore
import SnappyCodec from 'kafkajs-snappy'
import Status, {StatusCode} from "@/model/Status";
CompressionCodecs[CompressionTypes.Snappy] = SnappyCodec

const clientId = 'kafkavue'

export default class KafkaClient {
  kafka: Kafka
  groupId = 'kafkavue'
  consumer: Consumer | null = null
  producer: Producer | null = null
  timer: NodeJS.Timeout | null = null

  constructor(kafka: Kafka) {
    this.kafka = kafka
  }

  getTopicsMetadata () {
    return this.kafka.admin().listTopics()
      .then(ts => this.kafka.admin().fetchTopicMetadata({topics: ts}))
  }

  fetchTopicOffsets (topic: string) {
    return this.kafka.admin().fetchTopicOffsets(topic)
  }

  describeTopicConfigs (topic: string) {
    return this.kafka.admin().describeConfigs({
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

  getTopics () {
    return this.kafka.admin().listTopics()
  }

  createTopic (topic: string, replicationFactor: number, numPartitions: number) {
    return this.kafka
      .admin()
      .createTopics({topics: [{topic, numPartitions, replicationFactor}]})
  }

  private match (rawMessage: string, filter: string) {
    if (!filter) return true
    const words = filter.split(/\s/)
    return words.every(w => rawMessage.includes(w))
  }

  getTopicPartitions (topic: string) {
    return this.kafka.admin().fetchTopicMetadata().then(topics => {
      const topicInfo = topics.topics.find(t => t.name === topic)
      if (topicInfo) {
        return topicInfo.partitions.length
      }
      return 0
    })
  }

  async getMessages (topic: string, filter: string, fromBeginning: boolean, cb: Function) {
    this.consumer = this.kafka.consumer({
      groupId: this.groupId + new Date() // TODO
    })
    await this.consumer.connect()
    await this.consumer.subscribe({topic, fromBeginning})
    await this.consumer.run({
      autoCommit: false,
      partitionsConsumedConcurrently: await this.getTopicPartitions(topic),
      eachMessage: async ({topic, partition, message}) => {
        const rawMessage = message && message.value ? message.value.toString() : '{}'
        if (this.match(rawMessage, filter)) {
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
      if (this.consumer) {
        this.consumer.stop()
      }
    }, 1000000) // TODO
  }

  async startSender (messages: string[], topic: string, time: number, loop: boolean) {
    this.producer = this.kafka.producer({
      allowAutoTopicCreation: false
    })
    let i = 0
    await this.producer.connect()
    this.timer = setInterval(() => {
      const message = {key: 'key' + i, value: messages[i % messages.length]}
      this.producer?.send({ // TODO
        topic,
        messages: [message]
      }).then(r => console.log('Sent: ', r.length ? r[0].baseOffset : 'unk'))
      i++
      if (!loop && i === messages.length) {
        // clearInterval(this.timer) TODO
      }
    }, time)
  }

  stopSender () {
    if (this.timer) clearInterval(this.timer)
    if (this.producer) this.producer.disconnect().then(() => console.log('Producer disconnected'))
  }

  stopConsumer (): Promise<Status> {
    if (this.consumer) {
      return this.consumer.stop()
        .then(() => new Status('Stopped ok', StatusCode.OK))
        .catch(e => new Status(`Error stopping consumer ${e}`, StatusCode.ERROR))
    } else {
      return Promise.resolve(new Status('No consumer to stop', StatusCode.ERROR))
    }
  }

  getConsumers () {
    return this.kafka.admin().listGroups().then(result => result.groups)
  }

  getConsumersMetadata () {
    return this.kafka.admin().listGroups()
      .then(r => this.kafka.admin().describeGroups(r.groups.map(g => g.groupId))
        .then(a => a.groups))
  }

  static test (brokersString: string) {
    const brokers = brokersString.split(',')
    const kafka = new Kafka({
      clientId, brokers,
      retry: { retries: 1 }
    })
    return kafka.admin().connect()
  }
}
