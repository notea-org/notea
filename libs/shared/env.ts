export function getEnv<T>(
  env: string,
  defaultValue?: any,
  required = false
): T {
  const value = process.env[env]

  if (!value) {
    if (required && !defaultValue) {
      throw new Error(`[Notea] \`${env}\` is required`)
    }

    console.log(`[Notea] \`${env}\` use the default value \`${defaultValue}\``)
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
