import { TextFieldProps } from '@material-ui/core'
import { FC } from 'react'
import { DailyNotes } from './daily-notes'
import { Language } from './language'
import { Theme } from './theme'
import { ImportOrExport } from './import-or-export'

export const defaultFieldConfig: TextFieldProps = {
  fullWidth: true,
  margin: 'normal',
  variant: 'outlined',
  InputLabelProps: {
    shrink: true,
  },
}

export const SettingsContainer: FC = () => {
  return (
    <section>
      <DailyNotes></DailyNotes>
      <Language></Language>
      <Theme></Theme>
      <hr />
      <ImportOrExport></ImportOrExport>
      <hr />
    </section>
  )
}
