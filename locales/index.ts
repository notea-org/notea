import { zhCN, enUS, Localization, deDE, ruRU } from '@material-ui/core/locale'

export enum Locale {
  ZH_CN = 'zh-CN',
  EN = 'en',
  de_DE = 'de-DE',
  ru_RU = 'ru-RU',
}

export const muiLocale: Record<Locale, Localization> = {
  [Locale.ZH_CN]: zhCN,
  [Locale.EN]: enUS,
  [Locale.de_DE]: deDE,
  [Locale.ru_RU]: ruRU,
}

export const configLocale: Record<Locale, string> = {
  [Locale.EN]: 'English',
  [Locale.ZH_CN]: '简体中文',
  [Locale.de_DE]: 'Deutsche',
  [Locale.ru_RU]: 'Русский',
}
