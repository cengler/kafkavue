export enum StatusCode {
  OK,
  ERROR,
}

export default class Connection {
  message: string;
  code: StatusCode;

  constructor (message: string, code: StatusCode) {
    this.message = message
    this.code = code
  }
}
