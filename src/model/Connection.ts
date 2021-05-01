export default class Connection {
  name: string;
  boostrapServers: Array<string>;

  constructor (name: string, boostrapServersString: string) {
    this.name = name
    this.boostrapServers = boostrapServersString.split(',')
  }
}
