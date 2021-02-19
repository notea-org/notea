import { strCompress, strDecompress } from 'packages/shared'

const STORE_PREFIX = 'NOTEA'

export function getLocalStore(key: string) {
  const value = localStorage.getItem([STORE_PREFIX, key].join('_'))
  return value ? JSON.parse(strDecompress(value)) : undefined
}

export function setLocalStore(key: string, value: any) {
  localStorage.setItem(
    [STORE_PREFIX, key].join('_'),
    strCompress(JSON.stringify(value))
  )
}
