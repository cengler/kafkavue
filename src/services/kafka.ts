import KafkaClient from '@/services/KafkaClient'
import Connection from '@/model/Connection'
import { PubSub } from 'pubsub-ts'
const kafkaList: { [id: string]: KafkaClient } = {}

const publisher: PubSub.Publisher = new PubSub.Publisher()

const getKafka = (c: Connection): KafkaClient => {
  const kafka: KafkaClient | null = kafkaList[c.id]
  if (kafka) {
    return kafka
  } else {
    const kafkaClient = new KafkaClient(c, publisher)
    kafkaList[c.id] = kafkaClient
    return kafkaClient
  }
}

const getSubscriber = (): PubSub.Subscriber => {
  const subscriber: PubSub.Subscriber = new PubSub.Subscriber()
  publisher.add(subscriber)
  return subscriber
}

const test = (brokersString: string): Promise<void> => {
  return KafkaClient.test(brokersString)
}

export default {
  test,
  getKafka,
  getSubscriber
}
