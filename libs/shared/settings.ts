import { Locale } from 'locales'
import { isArray, isBoolean, isNumber, isString, values } from 'lodash'

export interface Settings {
  split_sizes: [number, number]
  daily_root_id: string
  sidebar_is_fold: boolean
  last_visit?: string
  locale: Locale
}

export const DEFAULT_SETTINGS: Settings = {
  split_sizes: [30, 70],
  daily_root_id: 'root',
  sidebar_is_fold: false,
  locale: Locale.EN,
}

export function formatSettings(body: Record<string, any> = {}) {
  const settings: Settings = DEFAULT_SETTINGS

  if (isString(body.daily_root_id)) {
    settings.daily_root_id = body.daily_root_id
  }
  if (
    isArray(body.split_sizes) &&
    isNumber(body.split_sizes[0]) &&
    isNumber(body.split_sizes[1])
  ) {
    settings.split_sizes = [body.split_sizes[0], body.split_sizes[1]]
  }
  if (isBoolean(body.sidebar_is_fold)) {
    settings.sidebar_is_fold = body.sidebar_is_fold
  }
  if (isString(body.last_visit)) {
    settings.last_visit = body.last_visit
  }

  if (values(Locale).includes(body.locale)) {
    settings.locale = body.locale
  }

  return settings
}
