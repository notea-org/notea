import NoteState from 'libs/web/state/note'
import { removeMarkdown } from 'libs/web/utils/markdown'
import { FC, useMemo } from 'react'
import { NextSeo } from 'next-seo'
import { renderMarkdown } from 'libs/web/render-markdown'
// TODO: Maybe can custom
import 'highlight.js/styles/zenburn.css'
import { PageMode } from 'libs/shared/page'
import Error from 'next/error'
import useI18n from 'libs/web/hooks/use-i18n'

export const PostContainer: FC<{ baseURL: string; pageMode: PageMode }> = ({
  baseURL,
  pageMode,
}) => {
  const { t } = useI18n()
  const { note } = NoteState.useContainer()
  const content = useMemo(() => renderMarkdown(note?.content ?? ''), [note])
  const description = useMemo(
    () => removeMarkdown(note?.content).slice(0, 100),
    [note]
  )

  if (pageMode !== PageMode.PUBLIC) {
    return <Error statusCode={404} title={t('Not a public page')}></Error>
  }

  return (
    <article className="prose mx-auto prose-sm lg:prose-xl px-4 md:px-0">
      <NextSeo
        title={note?.title}
        titleTemplate="%s - Powered by Notea"
        description={description}
        openGraph={{
          title: note?.title,
          description,
          url: `${baseURL}/${note?.id}`,
          images: [{ url: note?.pic ?? `${baseURL}/logo_1280x640.png` }],
          type: 'article',
          article: {
            publishedTime: note?.date,
          },
        }}
      />
      <header>
        <h1 className="pt-10">{note?.title}</h1>
      </header>
      <main
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      ></main>
      <style jsx global>{`
        [title='left-50'] {
          float: left;
          width: 50%;
          margin-right: 2em;
          margin-bottom: 1em;
          clear: initial;
        }

        [title='right-50'] {
          float: right;
          width: 50%;
          margin-left: 2em;
          margin-bottom: 1em;
          clear: initial;
        }
      `}</style>
    </article>
  )
}
