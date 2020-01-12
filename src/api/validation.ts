export default class Validation {
  static isValidAppName(name: string): boolean {
    const strName = (name || '').trim()
    const nameLength = strName.length
    const isValidCharacter = /^[a-zA-Z0-9 ]+$/g.test(strName)
    const inRange = (nameLength > 0) && (nameLength <= 20)

    return isValidCharacter && inRange
  }

  static isValidStartCmd(cmd: string): boolean {
    return !!cmd
  }

  static isValidHc(hc: boolean): boolean {
    const strHc = (hc + '')
    const isBoolean = ['true', 'false'].includes(strHc) && (typeof hc === 'boolean')

    return isBoolean
  }

  static isValidAutoStart(autoStart: boolean): boolean {
    const strAutoStart = (autoStart + '')
    const isBoolean = ['true', 'false'].includes(strAutoStart) && (typeof autoStart === 'boolean')

    return isBoolean
  }

  static isValidHcPort(port: number): boolean {
    const numPort = +(port || 0)
    const isNumber = Number.isSafeInteger(numPort)
    const inRange = (numPort >= 0) && (numPort <= 65535)

    return isNumber && inRange
  }

  static isValidHcPath(path: string): boolean {
    return !!path
  }

  static isValidHcInterval(interval: number): boolean {
    const numInterval = +(interval || 0)
    const isNumber = Number.isSafeInteger(numInterval)
    const inRange = (numInterval >= 5000) && (numInterval <= 60000)

    return isNumber && inRange
  }
}
