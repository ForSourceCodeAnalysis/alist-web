export enum MODE {
  NONE = 0,
  EVENT = 1,
  CRON = 2,
}

export interface AutoBackup {
  id: number
  server_id: string
  src: string
  dst: string
  ignore: string
  disabled: boolean
  mode: MODE
  cron: string
  init_upload: boolean
}

export interface AutoBackupLog {
  id: number
  dir: string
  name: string
  backup_id: string
  last_modified_time: string
  time_consuming: number
  updated_at: string
  created_at: string
}
