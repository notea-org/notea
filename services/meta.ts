import { strCompress, strDecompress } from 'packages/shared'

export const PAGE_META_KEY = [
  'title',
  'pid',
  'id',
  'share',
  'cid',
  'pic',
  'date',
]
const ARRAY_KEYS = ['cid']

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

      if (value) {
        const strValue = strDecompress(value) || undefined

        if (ARRAY_KEYS.includes(key)) {
          meta[key] = strValue.split(',') || []
        } else {
          meta[key] = strValue
        }
      }
    })
  }

  return meta
}
