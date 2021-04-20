import NoteState from 'libs/web/state/note'
import { useMemo } from 'react'
import rules from 'rich-markdown-editor/dist/lib/markdown/rules'

const renderToHtml = (markdown: string) => {
  return rules({ embeds: [] }).render(markdown).trim()
}

/**
 * FIXME https://github.com/outline/rich-markdown-editor/pull/432/files
 */
export const PostContainer = () => {
  const { note } = NoteState.useContainer()

  const content = useMemo(() => renderToHtml(note?.content ?? ''), [note])

  return (
    <article className="prose m-auto">
      <header>
        <h1>{note?.title}</h1>
      </header>
      <main
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      ></main>
    </article>
  )
}
