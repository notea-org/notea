import { strCompress, strDecompress } from '@notea/shared/src/str'
import { StroageType } from '.'

export function createCacheHeader(type: 'cache' | 'no-cache' = 'cache') {
  switch (type) {
    case 'cache':
      return {
        'Cache-Control': 'public, max-age=31536000',
      }

    case 'no-cache':
      return {
        'Cache-Control': 'public, no-cache',
      }

    default:
      return
  }
}

export function createMetaHeader(
  data: Record<string, string>,
  type: StroageType
) {
  const list: string[] = []

  if (type === 'OSS') {
    for (const key in data) {
      list.push(`x-custom-${key}:${strCompress(data[key])}`)
    }

    return {
      'x-oss-persistent-headers': list.join(','),
    }
  }

  const headers: Record<string, string> = {}
  for (const key in data) {
    headers[`x-custom-${key}`] = strCompress(data[key])
  }

  return headers
}

export function parseMetaHeader(headers: Record<string, string>) {
  const meta: Record<string, string> = {}

  for (const key in headers) {
    const m = key.match(/x-custom-(\w+)/)
    if (m) {
      meta[m[1]] = strDecompress(headers[key])
    }
  }

  return meta
}
