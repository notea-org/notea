import { ChangeEvent, FC, FocusEvent, useCallback } from 'react'
import useI18n from 'libs/web/hooks/use-i18n'
import { TextField } from '@material-ui/core'
import { defaultFieldConfig } from './settings-container'
import UIState from 'libs/web/state/ui'

export const SnippetInjection: FC = () => {
  const { t } = useI18n()

  const {
    settings: { settings, updateSettings, setSettings },
  } = UIState.useContainer()

  const saveValue = useCallback(
    async (event: FocusEvent<HTMLInputElement>) => {
      await updateSettings({
        injection: event.target.value,
      })
    },
    [updateSettings]
  )

  const updateValue = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setSettings((prev) => ({ ...prev, injection: event.target.value }))
    },
    [setSettings]
  )

  return (
    <div>
      <TextField
        {...defaultFieldConfig}
        multiline
        label={t('Snippet injection')}
        placeholder="HTML"
        value={settings.injection}
        onChange={updateValue}
        onBlur={saveValue}
        helperText={
          'Inject analytics or other scripts into the HTML of your site.'
        }
      ></TextField>
    </div>
  )
}
