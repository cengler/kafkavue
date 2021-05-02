export default class Connection {
  id: number
  name: string;
  boostrapServers: Array<string>;

  constructor (id: number, name: string, boostrapServersString: string) {
    this.id = id
    this.name = name
    this.boostrapServers = boostrapServersString.split(',')
  }
}
