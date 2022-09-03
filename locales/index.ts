import {
    zhCN,
    enUS,
    Localization,
    deDE,
    ruRU,
    itIT,
    nlNL,
    frFR,
} from '@material-ui/core/locale';

export enum Locale {
    ZH_CN = 'zh-CN',
    EN = 'en',
    de_DE = 'de-DE',
    ru_RU = 'ru-RU',
    ar = 'ar',
    it_IT = 'it-IT',
    nl_NL = 'nl-NL',
    fr_FR = 'fr-FR',
}

export const muiLocale: Record<Locale, Localization> = {
    [Locale.ZH_CN]: zhCN,
    [Locale.EN]: enUS,
    [Locale.de_DE]: deDE,
    [Locale.ru_RU]: ruRU,
    // FIXME: upgrade material-ui and import arEG
    [Locale.ar]: enUS,
    [Locale.it_IT]: itIT,
    [Locale.nl_NL]: nlNL,
    [Locale.fr_FR]: frFR,
};

export const configLocale: Record<Locale, string> = {
    [Locale.EN]: 'English',
    [Locale.ZH_CN]: '简体中文',
    [Locale.de_DE]: 'Deutsch',
    [Locale.ru_RU]: 'Русский',
    [Locale.ar]: 'العربية',
    [Locale.it_IT]: 'Italiano',
    [Locale.nl_NL]: 'Nederlands',
    [Locale.fr_FR]: 'français',
};
