import { createContext, useState, useRef, useEffect, ReactNode } from 'react';
import rosetta, { Rosetta } from 'rosetta';
import { DEFAULT_SETTINGS } from 'libs/shared/settings';
import { values } from 'lodash';
import { Locale } from 'locales';
import pupa from 'pupa';

const i18n = rosetta<Record<string, string>>();

export const defaultLanguage = DEFAULT_SETTINGS.locale;
export const languages = values(Locale);

interface ContextProps {
    activeLocale: Locale;
    t: Rosetta<Record<string, string>>['t'];
    locale: (l: Locale, dict: Record<string, string>) => void;
}

export const I18nContext = createContext<ContextProps>({} as ContextProps);

// default language
i18n.locale(defaultLanguage);

interface Props {
    children: ReactNode;
    locale: Locale;
    lngDict: Record<string, string>;
}

export default function I18nProvider({ children, locale, lngDict }: Props) {
    const activeLocaleRef = useRef(locale || defaultLanguage);
    const [, setTick] = useState(0);
    const firstRender = useRef(true);

    const i18nWrapper: ContextProps = {
        activeLocale: activeLocaleRef.current,
        t: (key, ...args) => {
            if (activeLocaleRef.current === defaultLanguage) {
                return pupa(
                    Array.isArray(key) ? key.join('') : key,
                    args[0] ?? {}
                );
            }
            return i18n.t(Array.isArray(key) ? key : [key], ...args);
        },
        locale: (l: Props['locale'], dict: Props['lngDict']) => {
            i18n.locale(l);
            activeLocaleRef.current = l;
            if (dict) {
                i18n.set(l, dict);
            }
            // force rerender to update view
            setTick((tick) => tick + 1);
        },
    };

    // for initial SSR render
    if (locale && firstRender.current === true) {
        firstRender.current = false;
        i18nWrapper.locale(locale, lngDict);
    }

    // when locale is updated
    useEffect(() => {
        if (locale) {
            i18nWrapper.locale(locale, lngDict);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lngDict, locale]);

    return (
        <I18nContext.Provider value={i18nWrapper}>
            {children}
        </I18nContext.Provider>
    );
}
