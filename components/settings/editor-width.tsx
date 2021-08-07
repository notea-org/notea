import { FC, useCallback, ChangeEvent } from 'react'
import { MenuItem, TextField } from '@material-ui/core'
import router from 'next/router'
import { defaultFieldConfig } from './settings-container'
import useI18n from 'libs/web/hooks/use-i18n'
import UIState from 'libs/web/state/ui'

export const EditorWidth: FC = () => {
  const { t } = useI18n()
  const {
    settings: { settings, updateSettings },
  } = UIState.useContainer()

  const handleChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      await updateSettings({ editor_width: event.target.value as string })
      router.reload()
    },
    [updateSettings]
  )

  return (
    <TextField
      {...defaultFieldConfig}
      label={t('Editor width')}
      value={settings.editor_width}
      onChange={handleChange}
      select
    >
      <MenuItem value="max-w-prose">{t('Small (default)')}</MenuItem>
      <MenuItem value="max-w-2xl">{t('Medium')}</MenuItem>
      <MenuItem value="max-w-4xl">{t('Large')}</MenuItem>
      <MenuItem value="max-w-6xl">{t('Extra large')}</MenuItem>
      <MenuItem value="max-w-none	">{t('Full width')}</MenuItem>
    </TextField>
  )
}
