import { FC, useCallback, useState } from 'react';
import { TextField } from '@material-ui/core';
import { defaultFieldConfig } from './settings-container';
import useI18n from 'libs/web/hooks/use-i18n';
import NoteTreeState from 'libs/web/state/tree';
import { Autocomplete } from '@material-ui/lab';
import { ExportButton } from './export-button';
import { ImportButton } from './import-button';
import { useTreeOptions, TreeOption } from 'libs/web/hooks/use-tree-options';

export const ImportOrExport: FC = () => {
    const { t } = useI18n();
    const { tree } = NoteTreeState.useContainer();
    const options = useTreeOptions(tree);
    const [selected, setSelected] = useState(options[0]);

    const handleChange = useCallback(
        (_event: unknown, item: TreeOption | null) => {
            if (item) {
                setSelected(item);
            }
        },
        []
    );

    return (
        <div>
            <Autocomplete
                options={options}
                getOptionLabel={(option) => option.label}
                value={selected}
                getOptionSelected={(option) => option.id === selected.id}
                onChange={handleChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        {...defaultFieldConfig}
                        label={t('Location')}
                    ></TextField>
                )}
            ></Autocomplete>
            <div className="space-x-4 flex mt-2">
                <ImportButton parentId={selected.id}></ImportButton>
                <ExportButton parentId={selected.id}></ExportButton>
            </div>
        </div>
    );
};
