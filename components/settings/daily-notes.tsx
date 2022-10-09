import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import NoteTreeState from 'libs/web/state/tree';
import UIState from 'libs/web/state/ui';
import { defaultFieldConfig } from './settings-container';
import useI18n from 'libs/web/hooks/use-i18n';
import { useTreeOptions, TreeOption } from 'libs/web/hooks/use-tree-options';

export const DailyNotes: FC = () => {
    const { t } = useI18n();
    const { tree } = NoteTreeState.useContainer();
    const {
        settings: { settings, updateSettings },
    } = UIState.useContainer();
    const options = useTreeOptions(tree);
    const defaultSelected = useMemo(
        () => options.find((i) => i.id === settings.daily_root_id),
        [options, settings.daily_root_id]
    );
    const [selected, setSelected] = useState(defaultSelected ?? options[0]);

    const handleChange = useCallback(
        async (_event: unknown, item: TreeOption | null) => {
            if (item) {
                await updateSettings({ daily_root_id: item.id })
                    ?.catch((v) => console.error('Error whilst updating settings: %O', v));
                setSelected(item);
            }
        },
        [updateSettings]
    );

    useEffect(() => {
        if (defaultSelected) {
            setSelected(defaultSelected);
        }
    }, [defaultSelected]);

    return (
        <Autocomplete
            options={options}
            getOptionLabel={(option) => option.label}
            getOptionSelected={(option) => option.id === selected.id}
            value={selected}
            onChange={handleChange}
            renderInput={(params) => (
                <TextField
                    {...params}
                    {...defaultFieldConfig}
                    label={t('Daily notes are saved in')}
                    helperText={t(
                        'Daily notes will be created under this page'
                    )}
                ></TextField>
            )}
        ></Autocomplete>
    );
};
