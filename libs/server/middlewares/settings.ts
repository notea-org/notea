import { DEFAULT_SETTINGS } from 'libs/shared/settings'
import { getSettings } from 'pages/api/settings'
import { SSRMiddeware } from '../connect'

export const applySettings: SSRMiddeware = async (req, _res, next) => {
  const settings = await getSettings(req.state.store)

  // import language dict
  const { default: lngDict = {} } = await import(
    `locales/${settings?.locale || DEFAULT_SETTINGS.locale}.json`
  )

  req.props = {
    ...req.props,
    ...{ settings, lngDict },
  }
  next()
}
