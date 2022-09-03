import { FC, useCallback, ChangeEvent } from 'react';
import { MenuItem, TextField } from '@material-ui/core';
import { defaultFieldConfig } from './settings-container';
import useI18n from 'libs/web/hooks/use-i18n';
import { useTheme } from 'next-themes';
import useMounted from 'libs/web/hooks/use-mounted';

export const Theme: FC = () => {
    const { t } = useI18n();
    const { theme, setTheme } = useTheme();
    const mounted = useMounted();

    const handleChange = useCallback(
        async (event: ChangeEvent<HTMLInputElement>) => {
            setTheme(event.target.value);
        },
        [setTheme]
    );

    if (!mounted) {
        return null;
    }

    return (
        <TextField
            {...defaultFieldConfig}
            label={t('Theme mode')}
            value={theme}
            onChange={handleChange}
            select
        >
            <MenuItem value="system">{t('Sync with system')}</MenuItem>
            <MenuItem value="dark">{t('Dark')}</MenuItem>
            <MenuItem value="light">{t('Light')}</MenuItem>
        </TextField>
    );
};
