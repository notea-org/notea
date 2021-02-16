import { isNil, isString } from 'lodash'
import { compress, decompress } from 'lzutf8'

export function toBuffer(raw: unknown, compressed = false): Buffer {
  if (!raw) {
    return Buffer.from('')
  }

  const str = isString(raw) ? raw : JSON.stringify(raw)
  return Buffer.from(compressed ? strCompress(str) : str)
}

export function toStr(buffer?: Buffer, deCompressed = false) {
  if (!buffer) return

  const str = buffer.toString()

  return deCompressed ? strDecompress(str) : str
}

export function tryJSON<T>(str?: string | null): T | null {
  if (isNil(str)) return null

  try {
    return JSON.parse(str)
  } catch (e) {
    console.error('parse error', str)
    return null
  }
}

export function strDecompress(raw?: string | null) {
  if (isNil(raw)) return null

  return decompress(raw, {
    inputEncoding: 'Base64',
  })
}

export function strCompress(str?: string) {
  return compress(str, {
    outputEncoding: 'Base64',
  })
}
