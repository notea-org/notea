import { FC, useCallback, ChangeEvent } from 'react'
import { MenuItem, TextField } from '@material-ui/core'
import UIState from 'libs/web/state/ui'
import { Locale } from 'libs/shared/settings'
import { defaultFieldConfig } from './settings-form'

export const LanguageField: FC = () => {
  const {
    settings: { settings, updateSettings },
  } = UIState.useContainer()

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      updateSettings({ locale: event.target.value as Locale })
    },
    [updateSettings]
  )

  return (
    <TextField
      {...defaultFieldConfig}
      label="语言设置"
      value={settings.locale}
      onChange={handleChange}
      select
    >
      <MenuItem value={Locale.EN}>English</MenuItem>
      <MenuItem value={Locale.ZH_CN}>简体中文</MenuItem>
    </TextField>
  )
}
