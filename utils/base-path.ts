const isProd = process.env.NODE_ENV === 'production'
import cdnConfig from 'cdn.json'

export const basePath = isProd ? cdnConfig.URL : '/'
