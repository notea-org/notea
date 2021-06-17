import { ironSession } from 'next-iron-session'
import md5 from 'md5'
import { getEnv } from 'libs/shared/env'

// Check password is not empty
if (!getEnv('DISABLE_PASSWORD', false)) {
  getEnv('PASSWORD', null, true)
}

const sessionOptions = {
  cookieName: 'notea-auth',
  password: md5('notea' + getEnv('PASSWORD')),
  // if your localhost is served on http:// then disable the secure flag
  cookieOptions: {
    secure: getEnv<boolean>(
      'COOKIE_SECURE',
      process.env.NODE_ENV === 'production'
    ),
  },
}

export const useSession = ironSession(sessionOptions)
