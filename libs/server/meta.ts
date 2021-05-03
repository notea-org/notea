import { isNil, toNumber } from 'lodash'
import { strCompress, strDecompress } from 'libs/shared/str'
import {
  PAGE_META_KEY,
  NOTE_DELETED,
  NOTE_SHARED,
  NUMBER_KEYS,
} from 'libs/shared/meta'

export function jsonToMeta(meta?: Record<string, string | undefined>) {
  const metaData: Record<string, string> = {}

  if (meta) {
    PAGE_META_KEY.forEach((key) => {
      const value = meta[key]

      if (!isNil(value)) {
        metaData[key] = strCompress(value.toString())
      }
    })
  }

  return metaData
}

export function metaToJson(metaData?: Record<string, string>) {
  const meta: Record<string, any> = {}

  if (metaData) {
    PAGE_META_KEY.forEach((key) => {
      const value = metaData[key]

      if (!isNil(value)) {
        const strValue = strDecompress(value) || undefined

        if (NUMBER_KEYS.includes(key)) {
          meta[key] = toNumber(strValue)
        } else {
          meta[key] = strValue
        }
      } else if (key === 'deleted') {
        meta[key] = value ? strDecompress(value) : NOTE_DELETED.NORMAL
      } else if (key === 'shared') {
        meta[key] = value ? strDecompress(value) : NOTE_SHARED.PRIVATE
      }
    })
  }

  return meta
}
