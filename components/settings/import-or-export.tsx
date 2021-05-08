import { FC, useCallback, useMemo, useState } from 'react'
import { TextField } from '@material-ui/core'
import { defaultFieldConfig } from './settings-container'
import useI18n from 'libs/web/hooks/use-i18n'
import { ROOT_ID, TreeItemModel } from 'libs/shared/tree'
import NoteTreeState from 'libs/web/state/tree'
import { filter } from 'lodash'
import { Autocomplete } from '@material-ui/lab'
import { ExportButton } from './export-button'
import { ImportButton } from './import-button'

export const ImportOrExport: FC = () => {
  const { t } = useI18n()
  const { tree } = NoteTreeState.useContainer()
  const [selected, setSelected] = useState(tree.items[ROOT_ID])
  const items = useMemo(
    () => filter(tree.items, (item) => !item.data?.deleted),
    [tree]
  )

  const handleChange = useCallback((_event, item: TreeItemModel | null) => {
    if (item) {
      setSelected(item)
    }
  }, [])

  return (
    <div>
      <Autocomplete
        options={items}
        getOptionLabel={(option) => option.data?.title || t('Root Page')}
        value={selected}
        onChange={handleChange}
        renderInput={(params) => (
          <TextField
            {...params}
            {...defaultFieldConfig}
            label={t('Import & Export')}
            helperText={t(
              'Import a zip file containing markdown files to this location, or export all pages from this location'
            )}
          ></TextField>
        )}
      ></Autocomplete>
      <div className="space-x-4 flex">
        <ImportButton parentId={selected.id}></ImportButton>
        <ExportButton parentId={selected.id}></ExportButton>
      </div>
    </div>
  )
}
