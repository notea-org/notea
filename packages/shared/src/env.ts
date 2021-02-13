export function getEnv<T>(env: string, defaultValue?: any): T {
  return process.env[env] || defaultValue;
}
