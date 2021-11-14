import { FC, useCallback, ChangeEvent } from 'react'
import { MenuItem, TextField } from '@material-ui/core'
import router from 'next/router'
import { defaultFieldConfig } from './settings-container'
import useI18n from 'libs/web/hooks/use-i18n'
import UIState from 'libs/web/state/ui'

export const ExplicitSave: FC = () => {
  const { t } = useI18n()
  const {
    settings: { settings, updateSettings },
  } = UIState.useContainer()

  const handleChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      await updateSettings({ explicitSave: Boolean(event.target.value) })
      console.log({ explicitSave: Boolean(event.target.value) })
      router.reload()
    },
    [updateSettings]
  )

  console.log(settings)
  return (
    <TextField
      {...defaultFieldConfig}
      label={t('Save strategy')}
      value={settings.explicitSave ? 1 : 0}
      onChange={handleChange}
      select
    >
      <MenuItem value={1}>{t('Explicit save (ctrl + s)')}</MenuItem>
      <MenuItem value={0}>{t('Auto save')}</MenuItem>
    </TextField>
  )
}
