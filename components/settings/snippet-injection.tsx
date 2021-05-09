import { FC, useCallback } from 'react'
import useI18n from 'libs/web/hooks/use-i18n'
import { TextField } from '@material-ui/core'
import { defaultFieldConfig } from './settings-container'
import UIState from 'libs/web/state/ui'

export const SnippetInjection: FC = () => {
  const { t } = useI18n()

  const {
    settings: { settings, updateSettings, setSettings },
  } = UIState.useContainer()

  const saveChange = useCallback(
    async (snippet: string, location: 'snippetBody' | 'snippetHead') => {
      await updateSettings({
        [location]: snippet,
      })
    },
    [updateSettings]
  )

  return (
    <div>
      <TextField
        {...defaultFieldConfig}
        multiline
        label={t('Insert before {{html}}', { html: '</body>' })}
        placeholder="HTML"
        value={settings.snippetBody}
        onChange={({ target }) =>
          setSettings((prev) => ({ ...prev, snippetBody: target.value }))
        }
        onBlur={({ target }) => saveChange(target.value, 'snippetBody')}
      ></TextField>

      <TextField
        {...defaultFieldConfig}
        multiline
        label={t('Insert before {{html}}', { html: '</head>' })}
        placeholder="HTML"
        value={settings.snippetHead}
        onChange={({ target }) =>
          setSettings((prev) => ({ ...prev, snippetHead: target.value }))
        }
        onBlur={({ target }) => saveChange(target.value, 'snippetHead')}
      ></TextField>
    </div>
  )
}
