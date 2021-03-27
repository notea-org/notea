import useFetcher from 'libs/web/api/fetcher'
import router from 'next/router'
import { FormEvent, useCallback } from 'react'

const LoginPage = () => {
  const { request } = useFetcher()

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
      } else {
        console.error(data)
      }
    },
    [request]
  )

  return (
    <form
      className="flex w-full max-w-sm mx-auto space-x-3 pt-60"
      method="post"
      onSubmit={onSubmit}
    >
      <input
        className="flex-1 appearance-none border border-transparent w-full py-2 px-4 bg-gray-50 text-gray-700 placeholder-gray-400 shadow-md rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
        placeholder="password"
        type="password"
        required
        name="password"
      />
      <input
        className="flex-shrink-0 bg-purple-600 text-white text-base font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-200"
        type="submit"
        value="Login"
      />
    </form>
  )
}
export default LoginPage
