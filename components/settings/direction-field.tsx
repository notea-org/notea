import { FC, useCallback, ChangeEvent } from 'react'
import { MenuItem, TextField } from '@material-ui/core'
import UIState from 'libs/web/state/ui'
import { defaultFieldConfig } from './settings-form'
import router from 'next/router'
import useI18n from 'libs/web/hooks/use-i18n'
import { map } from 'lodash'
import { Direction } from 'libs/shared/settings'

export const DirectionField: FC = () => {
  const { t } = useI18n()
  const {
    settings: { settings, updateSettings },
  } = UIState.useContainer()

  const handleChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      await updateSettings({ direction: event.target.value as Direction })
      router.reload()
    },
    [updateSettings]
  )

  return (
    <TextField
      {...defaultFieldConfig}
      label={t('Text direction')}
      value={settings.direction}
      onChange={handleChange}
      select
    >
      {map(Direction, (item, key) => (
        <MenuItem key={item} value={item}>
          {key}
        </MenuItem>
      ))}
    </TextField>
  )
}
