export function getEnv<T>(env: string, defaultValue?: any): T {
  const value = process.env[env]
  if (!value) {
    return defaultValue
  }
  const v = value.toLocaleLowerCase()
  let result

  if (v === 'false') {
    result = false
  } else if (v === 'true') {
    result = true
  } else if (/^\d+$/.test(v)) {
    result = (v as any) * 1
  } else {
    result = value
  }

  return (result as unknown) as T
}
