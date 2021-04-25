import { FC, useCallback, useMemo } from 'react'
import { TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import NoteTreeState from 'libs/web/state/tree'
import { filter } from 'lodash'
import UIState from 'libs/web/state/ui'
import { TreeItemModel } from 'libs/shared/tree'
import { defaultFieldConfig } from './settings-form'
import useI18n from 'libs/web/hooks/use-i18n'

export const DailyNotesField: FC = () => {
  const { t } = useI18n()
  const { tree } = NoteTreeState.useContainer()
  const {
    settings: { settings, updateSettings },
  } = UIState.useContainer()

  const items = useMemo(
    () => filter(tree.items, (item) => !item.data?.deleted),
    [tree]
  )
  const selected = useMemo(
    () => items.find((i) => i.id === settings.daily_root_id),
    [items, settings.daily_root_id]
  )

  const handleChange = useCallback(
    (_event, item: TreeItemModel | null) => {
      if (item) {
        updateSettings({ daily_root_id: item.id })
      }
    },
    [updateSettings]
  )

  return (
    <Autocomplete
      options={items}
      getOptionLabel={(option) => option.data?.title || t('Root Page')}
      value={selected}
      onChange={handleChange}
      renderInput={(params) => (
        <TextField
          {...params}
          {...defaultFieldConfig}
          label={t('Daily notes are saved in')}
          helperText={t('Daily notes will be created under this page')}
        ></TextField>
      )}
    ></Autocomplete>
  )
}
