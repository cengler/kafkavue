let msgIndex = 0

export default class Message {
  meta: {
    topic: string;
    partition: number;
    key: string;
    internalKey: number;
  }

  msg: JSON;

  constructor (topic: string, partition: number, key: string, msg: JSON) {
    this.meta = {
      topic,
      partition,
      key,
      internalKey: msgIndex++
    }
    this.msg = msg
  }
}
