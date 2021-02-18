import { getEnv } from 'packages/shared'
import { ironSession } from 'next-iron-session'
import md5 from 'md5'

export const useSession = ironSession({
  cookieName: 'notea-auth',
  password: md5('notea' + getEnv('PASSWORD')),
  // if your localhost is served on http:// then disable the secure flag
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
})
