import { isArray, isNumber, isString } from 'lodash'

export interface Settings {
  splitSizes: [number, number]
  dailyNotesId: string
}

export const DEFAULT_SETTINGS: Settings = {
  splitSizes: [30, 70],
  dailyNotesId: 'root',
}

export function formatSettings(body: Record<string, any>) {
  const settings: Settings = DEFAULT_SETTINGS

  if (isString(body.dailyNotesId)) {
    settings.dailyNotesId = body.dailyNotesId
  }
  if (
    isArray(body.splitSizes) &&
    isNumber(body.splitSizes[0]) &&
    isNumber(body.splitSizes[1])
  ) {
    settings.splitSizes = [body.splitSizes[0], body.splitSizes[1]]
  }

  return settings
}
