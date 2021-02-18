const STORE_PREFIX = 'NOTEA'

export function getLocalStore(key: string) {
  const value = localStorage.getItem([STORE_PREFIX, key].join('_'))
  return value ? JSON.parse(value) : null
}

export function setLocalStore(key: string, value: any) {
  localStorage.setItem([STORE_PREFIX, key].join('_'), JSON.stringify(value))
}
