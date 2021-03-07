import { isNil, toNumber } from 'lodash'
import { strCompress, strDecompress } from 'packages/shared'
import {
  PAGE_META_KEY,
  NOTE_DELETED,
  NOTE_SHARED,
  NUMBER_KEYS,
} from 'shared/meta'

export function jsonToMeta(meta?: Record<string, string | undefined>) {
  const metaData: Map<string, string> = new Map()

  if (meta) {
    PAGE_META_KEY.forEach((key) => {
      const value = meta[key]

      if (value) {
        metaData.set(key, strCompress(value.toString()))
      }
    })
  }

  return metaData
}

export function metaToJson(metaData?: Map<string, string>) {
  const meta: Record<string, any> = {}

  if (metaData) {
    PAGE_META_KEY.forEach((key) => {
      const value = metaData.get(key)

      if (!isNil(value)) {
        const strValue = strDecompress(value) || undefined

        if (NUMBER_KEYS.includes(key)) {
          meta[key] = toNumber(strValue)
        } else {
          meta[key] = strValue
        }
      } else if (key === 'deleted') {
        meta[key] = NOTE_DELETED.NORMAL
      } else if (key === 'shared') {
        meta[key] = NOTE_SHARED.PRIVATE
      }
    })
  }

  return meta
}
