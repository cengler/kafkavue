import KafkaClient from '@/services/KafkaClient'
import Connection from '@/model/Connection'

const kafkaList: { [id: string]: KafkaClient } = {}

const getKafka = (c: Connection): KafkaClient => {
  const kafka: KafkaClient | null = kafkaList[c.id]
  if (kafka) {
    return kafka
  } else {
    const kafkaClient = new KafkaClient(c)
    kafkaList[c.id] = kafkaClient
    return kafkaClient
  }
}

const test = (brokersString: string): Promise<void> => {
  return KafkaClient.test(brokersString)
}

export default {
  test,
  getKafka
}
