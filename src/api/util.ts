import uuid from 'uuid/v4'

export class Util {
  static createRandomId(): string {
    return uuid()
  }
}
