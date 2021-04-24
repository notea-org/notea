import { TextFieldProps } from '@material-ui/core'
import { FC } from 'react'
import { DailyNotesField } from './daily-notes-field'
// import { LanguageField } from './language-field'

export const defaultFieldConfig: TextFieldProps = {
  fullWidth: true,
  margin: 'normal',
  variant: 'outlined',
  InputLabelProps: {
    shrink: true,
  },
}

export const SettingsForm: FC = () => {
  return (
    <section>
      <form>
        <DailyNotesField />
        {/* todo 支持国际化 */}
        {/* <LanguageField /> */}
      </form>
    </section>
  )
}
