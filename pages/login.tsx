import { TextField, Button, Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { withCsrf } from 'libs/server/middlewares/csrf'
import useFetcher from 'libs/web/api/fetcher'
import router from 'next/router'
import { FormEvent, useCallback } from 'react'

const LoginPage = () => {
  const { request, error, loading } = useFetcher()
  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const data = await request<{ password: string }, { isLoggedIn: boolean }>(
        {
          url: '/api/auth/login',
          method: 'POST',
        },
        {
          password: e.currentTarget.password.value,
        }
      )
      if (data?.isLoggedIn) {
        location.href = (router.query.redirect as string) || '/'
      }
    },
    [request]
  )

  return (
    <main className="pt-48">
      <Snackbar open={!loading && !!error} autoHideDuration={6000}>
        <Alert severity="error">Incorrect password</Alert>
      </Snackbar>
      <img className="w-40 h-40 m-auto" src="/logo.svg" alt="Logo" />
      <form
        className="w-80 m-auto"
        action="post"
        noValidate
        onSubmit={onSubmit}
      >
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
        ></TextField>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          color="primary"
        >
          Login
        </Button>
      </form>
    </main>
  )
}

export default LoginPage

export const getServerSideProps = withCsrf(() => ({}))
