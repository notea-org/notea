import { FC, useCallback, ChangeEvent } from 'react';
import { MenuItem, TextField } from '@material-ui/core';
import router from 'next/router';
import { defaultFieldConfig } from './settings-container';
import useI18n from 'libs/web/hooks/use-i18n';
import UIState from 'libs/web/state/ui';
import { EDITOR_SIZE } from 'libs/shared/meta';

export const EditorWidth: FC = () => {
    const { t } = useI18n();
    const {
        settings: { settings, updateSettings },
    } = UIState.useContainer();

    const handleChange = useCallback(
        async (event: ChangeEvent<HTMLInputElement>) => {
            await updateSettings({ editorsize: parseInt(event.target.value) });
            router.reload();
        },
        [updateSettings]
    );

    return (
        <TextField
            {...defaultFieldConfig}
            label={t('Default editor width')}
            value={settings.editorsize ?? EDITOR_SIZE.SMALL}
            onChange={handleChange}
            select
        >
            <MenuItem value={EDITOR_SIZE.SMALL}>
                {t('Small (default)')}
            </MenuItem>
            <MenuItem value={EDITOR_SIZE.LARGE}>{t('Large')}</MenuItem>
        </TextField>
    );
};
