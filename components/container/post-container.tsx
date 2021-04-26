import NoteState from 'libs/web/state/note'
import { removeMarkdown } from 'libs/web/utils/markdown'
import { FC, useMemo } from 'react'
import rules from 'rich-markdown-editor/dist/lib/markdown/rules'
import styled from 'styled-components'
import { NextSeo } from 'next-seo'

/**
 * FIXME https://github.com/outline/rich-markdown-editor/pull/432/files
 */
const renderToHtml = (markdown: string) => {
  return rules({ embeds: [] }).render(markdown).trim()
}

export const PostContainer: FC<{ baseURL: string }> = ({ baseURL }) => {
  const { note } = NoteState.useContainer()

  const content = useMemo(() => renderToHtml(note?.content ?? ''), [note])
  const description = useMemo(
    () => removeMarkdown(note?.content).slice(0, 100),
    [note]
  )

  return (
    <AriticleStyle className="prose mx-auto prose-sm lg:prose-xl">
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
    </AriticleStyle>
  )
}

const AriticleStyle = styled.article`
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
`
