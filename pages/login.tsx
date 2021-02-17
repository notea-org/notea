import { useRouter } from 'next/router'
import { FormEvent } from 'react'
import useFetch from 'use-http'

const LoginPage = () => {
  const { post } = useFetch('/api/auth/login', {
    cache: 'no-cache',
  })
  const router = useRouter()

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await post({
      password: e.currentTarget.password.value,
    })
    router.push((router.query.redirect as string) || '/')
  }
  return (
    <form method="post" onSubmit={onSubmit}>
      <input placeholder="password" type="password" required name="password" />
      <input type="submit" value="Login" />
    </form>
  )
}
export default LoginPage
