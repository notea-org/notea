import CsrfTokenState from 'libs/web/state/csrf-token'
import { useCallback } from 'react'
import { Props } from 'rich-markdown-editor'
import { Bookmark } from './bookmark'

export type EmbedProps = {
  attrs: {
    href: string
    matches: string[]
  }
}

export const useEmbeds = () => {
  const csrfToken = CsrfTokenState.useContainer()

  const createEmbedComponent = useCallback(
    (Component) => {
      return (props: EmbedProps) => {
        return (
          <CsrfTokenState.Provider initialState={csrfToken}>
            <Component {...props} />
          </CsrfTokenState.Provider>
        )
      }
    },
    [csrfToken]
  )

  return [
    {
      title: 'bookmark',
      matcher: (url) => url.match(/^\/api\/extract\/bookmark/),
      component: createEmbedComponent(Bookmark),
    },
  ] as Props['embeds']
}
