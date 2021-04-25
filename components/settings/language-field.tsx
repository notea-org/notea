import { FC, useCallback, ChangeEvent } from 'react'
import { MenuItem, TextField } from '@material-ui/core'
import UIState from 'libs/web/state/ui'
import { Locale } from 'libs/shared/settings'
import { defaultFieldConfig } from './settings-form'
import router from 'next/router'
import useI18n from 'libs/web/hooks/use-i18n'

export const LanguageField: FC = () => {
  const { t } = useI18n()
  const {
    settings: { settings, updateSettings },
  } = UIState.useContainer()

  const handleChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      await updateSettings({ locale: event.target.value as Locale })
      router.reload()
    },
    [updateSettings]
  )

  return (
    <TextField
      {...defaultFieldConfig}
      label={t('Language')}
      value={settings.locale}
      onChange={handleChange}
      select
    >
      <MenuItem value={Locale.EN}>English</MenuItem>
      <MenuItem value={Locale.ZH_CN}>简体中文</MenuItem>
    </TextField>
  )
}
