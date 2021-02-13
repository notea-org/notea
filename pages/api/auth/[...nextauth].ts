import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { getEnv } from '@notea/shared/src/env'

export default (req: NextApiRequest, res: NextApiResponse) => {
  return NextAuth(req, res, {
    providers: [
      Providers.Credentials({
        name: 'Password',
        credentials: {
          password: {
            label: 'Password',
            type: 'password',
          },
        },
        async authorize(credentials) {
          const { password } = credentials

          if (password !== getEnv('PASSWORD')) {
            return null
          }

          return {
            logged: true,
          }
        },
      }),
    ],
  })
}
