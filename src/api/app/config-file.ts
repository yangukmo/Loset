import { IHealthCheck } from '@/api/interface/health-check.interface'
import Validation from '@/api/validation'
import { IConfigFile } from '@/api/interface/config-file.interface'
import fs from 'fs'
import path from 'path'

export default class ConfigFile {
  private name: string
  private start_cmd: string
  private auto_start: boolean
  private hc: IHealthCheck

  constructor(props: any) {
    this.name = props.name
    this.start_cmd = props.start_cmd
    this.auto_start = props.auto_start
    this.hc = {
      active: props.hc?.active,
      port: props.hc?.port,
      path: props.hc?.path,
      interval: props.hc?.interval
    }
  }

  render(): IConfigFile {
    return {
      name: Validation.isValidAppName(this.name) ? this.name : undefined,
      start_cmd: Validation.isValidStartCmd(this.start_cmd) ? this.start_cmd : undefined,
      auto_start: Validation.isValidAutoStart(this.auto_start) ? this.auto_start : undefined,
      hc: {
        active: Validation.isValidHc(this.hc.active) ? this.hc.active : undefined,
        port: Validation.isValidHcPort(this.hc.port) ? this.hc.port : undefined,
        path: Validation.isValidHcPath(this.hc.path) ? this.hc.path : undefined,
        interval: Validation.isValidHcInterval(this.hc.interval) ? this.hc.interval : undefined,
      }
    } as IConfigFile
  }

  static getConfig(appPath: string): IConfigFile {
    let config
    let jsonConfig
    const configFilePath = path.join(appPath, 'loset.json')

    try {
      const fileBuffer = fs.readFileSync(configFilePath)
      jsonConfig = JSON.parse(fileBuffer.toString())
    } catch (err) {
      jsonConfig = {}
    } finally {
      const configFile = new ConfigFile(jsonConfig)
      config = configFile.render()
    }

    return config
  }
}
