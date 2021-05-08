import { Button, ButtonProps, CircularProgress } from '@material-ui/core'
import classNames from 'classnames'
import { FC } from 'react'

export const ButtonProgress: FC<
  ButtonProps & {
    loading?: boolean
    progress?: number
  }
> = ({ children, loading, progress, ...props }) => {
  return (
    <Button
      {...props}
      className="relative"
      disabled={loading}
      variant="contained"
      component="span"
    >
      <span className={classNames({ invisible: loading })}>{children}</span>
      {loading ? (
        <CircularProgress
          className="absolute"
          size={24}
          value={progress}
        ></CircularProgress>
      ) : null}
    </Button>
  )
}
