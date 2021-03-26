import { FC } from 'react'
import { DailyNotesField } from './daily-notes-field'

export const SettingsForm: FC = () => {
  return (
    <section>
      <form>
        <DailyNotesField />
      </form>
    </section>
  )
}
