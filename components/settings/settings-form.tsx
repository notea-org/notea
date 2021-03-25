import { FC } from 'react'
import DailyNotesField from './daily-notes-field'

const SettingsForm: FC = () => {
  return (
    <section>
      <form>
        <DailyNotesField />
      </form>
    </section>
  )
}
export default SettingsForm
