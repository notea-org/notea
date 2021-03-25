import { FC } from 'react'
import { TextField } from '@material-ui/core'
// import { useAutocomplete } from '@material-ui/lab'
// import { SearchState } from 'libs/web/state/search'

const DailyNotesField: FC = () => {
  // const { list } = SearchState.useContainer()
  // const {} = useAutocomplete({
  //   options,
  // })
  return (
    <TextField
      label="每日速记保存位置"
      placeholder="Placeholder"
      helperText="每日速记将在指定页面下创建"
      fullWidth
      margin="normal"
      InputLabelProps={{
        shrink: true,
      }}
    ></TextField>
  )
}
export default DailyNotesField
