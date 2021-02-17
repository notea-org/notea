import { strCompress, strDecompress } from 'packages/shared'

const PAGE_META_KEY = ['title', 'pid', 'order', 'icon', 'id']

export function parseMeta(meta?: Record<string, string>) {
  const metaData: Record<string, string> = {}

  if (meta) {
    PAGE_META_KEY.forEach((key) => {
      if (meta[key]) {
        metaData[key] = strCompress(meta[key].toString())
      }
    })
  }

  return metaData
}

export function toMeta(metaData?: Record<string, string>) {
  const meta: Record<string, string> = {}

  if (metaData) {
    PAGE_META_KEY.forEach((key) => {
      meta[key] = strDecompress(metaData[key])
    })
  }

  return meta
}
