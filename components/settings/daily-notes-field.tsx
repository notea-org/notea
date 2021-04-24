import { FC, useCallback, useMemo } from 'react'
import { TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import NoteTreeState from 'libs/web/state/tree'
import { toArray } from 'lodash'
import UIState from 'libs/web/state/ui'
import { TreeItemModel } from 'libs/shared/tree'

export const DailyNotesField: FC = () => {
  const { tree } = NoteTreeState.useContainer()
  const {
    settings: { settings, updateSettings },
  } = UIState.useContainer()

  const items = useMemo(() => toArray(tree.items), [tree])
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
      getOptionLabel={(option) => option.data?.title || '根页面'}
      value={selected}
      onChange={handleChange}
      renderInput={(params) => (
        <TextField
          {...params}
          label="每日笔记保存位置"
          helperText="每日笔记将在指定页面下创建"
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
        ></TextField>
      )}
    ></Autocomplete>
  )
}
