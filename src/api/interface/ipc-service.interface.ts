import { IConfigFile } from '@/api/interface/config-file.interface'

export interface ISelectDirectory {
  valid: boolean
  dir: string
  config: IConfigFile
}
