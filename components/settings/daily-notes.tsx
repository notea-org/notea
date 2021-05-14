import { FC, useCallback, useMemo } from 'react'
import { TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import NoteTreeState from 'libs/web/state/tree'
import UIState from 'libs/web/state/ui'
import { defaultFieldConfig } from './settings-container'
import useI18n from 'libs/web/hooks/use-i18n'
import { useTreeOptions, TreeOption } from 'libs/web/hooks/use-tree-options'

export const DailyNotes: FC = () => {
  const { t } = useI18n()
  const { tree } = NoteTreeState.useContainer()
  const {
    settings: { settings, updateSettings },
  } = UIState.useContainer()
  const options = useTreeOptions(tree)
  const selected = useMemo(
    () => options.find((i) => i.id === settings.daily_root_id),
    [options, settings.daily_root_id]
  )

  const handleChange = useCallback(
    (_event, item: TreeOption | null) => {
      if (item) {
        updateSettings({ daily_root_id: item.id })
      }
    },
    [updateSettings]
  )

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.label}
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
