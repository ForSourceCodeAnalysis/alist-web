export enum MODE {
  NONE = 0,
  EVENT = 1,
  POLLING = 2,
}

export interface Backup {
  id: number
  server_id: string
  src: string
  dst: string
  ignore: string
  disabled: boolean
  mode: MODE
  polling_interval: number
  init_upload: boolean
}
