import { Admin, AdminEvents, Consumer, ConsumerEvents, Kafka, Producer, ProducerEvents, ValueOf } from 'kafkajs'
import { PubSub } from 'pubsub-ts'
import KafkaPool from '@/services/KafkaPool'

export default class KafkaPoolManager {
  kafka: Kafka
  groupId = 'kafkaVue'
  publisher: PubSub.Publisher
  consumers: KafkaPool<Consumer>
  producers: KafkaPool<Producer>
  admins: KafkaPool<Admin>

  constructor (kafka: Kafka, publisher: PubSub.Publisher) {
    this.kafka = kafka
    this.publisher = publisher
    this.consumers = new KafkaPool<Consumer>(2, async () => this.createConsumer())
    this.producers = new KafkaPool<Producer>(2, async () => this.createProducer())
    this.admins = new KafkaPool<Admin>(2, async () => this.createAdmin())
  }

  public initialized (): Promise<void[]> {
    return Promise.all([this.consumers.init(), this.admins.init(), this.producers.init()])
  }

  public getConsumer (): Consumer {
    return this.consumers.get().element
  }

  public getProducer (): Producer {
    return this.producers.get().element
  }

  public getAdmin (): Admin {
    return this.admins.get().element
  }

  private async createConsumer (): Promise<Consumer> {
    const consumer = this.kafka.consumer({
      groupId: this.groupId + new Date() // TODO
    })
    Object.values(consumer.events).forEach((event: ValueOf<ConsumerEvents>) => {
      consumer.on(event, () => this.publisher.notify(event, null))
    })
    await consumer.connect()
    return consumer
  }

  private async createProducer (): Promise<Producer> {
    const producer = this.kafka.producer({
      allowAutoTopicCreation: false
    })
    Object.values(producer.events).forEach((event: ValueOf<ProducerEvents>) => {
      producer.on(event, () => this.publisher.notify(event, null))
    })
    await producer.connect()
    return producer
  }

  private async createAdmin (): Promise<Admin> {
    const admin = this.kafka.admin()
    await admin.connect()
    Object.values(admin.events).forEach((event: ValueOf<AdminEvents>) => {
      admin.on(event, () => this.publisher.notify(event, null))
    })
    return admin
  }
}
