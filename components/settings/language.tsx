import { FC, useCallback, ChangeEvent } from 'react';
import { MenuItem, TextField } from '@material-ui/core';
import UIState from 'libs/web/state/ui';
import { defaultFieldConfig } from './settings-container';
import router from 'next/router';
import useI18n from 'libs/web/hooks/use-i18n';
import { configLocale, Locale } from 'locales';
import { map } from 'lodash';

export const Language: FC = () => {
    const { t, activeLocale } = useI18n();
    const {
        settings: { settings, updateSettings },
    } = UIState.useContainer();

    const handleChange = useCallback(
        async (event: ChangeEvent<HTMLInputElement>) => {
            await updateSettings({ locale: event.target.value as Locale });
            router.reload();
        },
        [updateSettings]
    );

    return (
        <TextField
            {...defaultFieldConfig}
            label={`${t('Language')}${
                activeLocale !== Locale.EN ? '(Language)' : ''
            }`}
            value={settings.locale}
            onChange={handleChange}
            select
        >
            {map(configLocale, (item, key) => (
                <MenuItem key={key} value={key}>
                    {item}
                </MenuItem>
            ))}
        </TextField>
    );
};
