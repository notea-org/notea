import { FC, useMemo } from 'react'
// TODO: Maybe can custom
import 'highlight.js/styles/zenburn.css'
import { useEditorTheme } from 'components/editor/theme'
import classNames from 'classnames'
import useI18n from 'libs/web/hooks/use-i18n'
import UIState from 'libs/web/state/ui'
import InnerHTML from 'dangerously-set-html-content'
import { NoteModel } from 'libs/shared/note'
import pupa from 'pupa'

export const PostContainer: FC<{
  post?: string
  small?: boolean
  note?: NoteModel
}> = ({ post = '', small = false, note }) => {
  const { t } = useI18n()
  const editorTheme = useEditorTheme()
  const {
    settings: {
      settings: { injection },
    },
  } = UIState.useContainer()

  const injectionHTML = useMemo(() => {
    return pupa(injection ?? '', {
      ...note,
      url: typeof window !== 'undefined' ? location.href : null,
    })
  }, [injection, note])

  const articleClassName = useMemo(
    () =>
      classNames('prose mx-auto pb-10 prose-sm px-4 md:px-0', {
        'md:prose-2xl': !small,
      }),
    [small]
  )

  return (
    <>
      <article className={articleClassName}>
        <header>
          <h1 className="pt-10">{note?.title ?? t('Untitled')}</h1>
        </header>
        <main
          dangerouslySetInnerHTML={{
            __html: post,
          }}
        ></main>
        <style jsx>{`
          .prose :glboal(img) {
            margin: auto;
          }

          .prose :glboal([title='left-50']) {
            float: left;
            width: 50%;
            margin-right: 2em;
            margin-bottom: 1em;
            clear: initial;
          }

          .prose :glboal([title='right-50']) {
            float: right;
            width: 50%;
            margin-left: 2em;
            margin-bottom: 1em;
            clear: initial;
          }

          .prose :glboal(figcaption) {
            text-align: center;
          }

          .prose :global(.task-list-item) {
            padding-left: 0;
          }

          .prose :global(.task-list-item::before) {
            content: none;
          }

          .prose :global(.task-list-item label) {
            margin-left: 6px;
          }

          .prose :global(.notice) {
            display: flex;
            align-items: center;
            background: ${editorTheme.noticeInfoBackground};
            color: ${editorTheme.noticeInfoText};
            border-radius: 4px;
            padding: 8px 16px;
            margin: 8px 0;
          }

          .prose :global(.notice *) {
            margin: 0;
            color: currentColor;
          }

          .prose :global(.notice .icon) {
            width: 1.5em;
            height: 1.5em;
            align-self: flex-start;
            margin-right: 4px;
            position: relative;
            top: 1px;
          }

          .prose :global(.notice svg) {
            width: 100%;
            height: 100%;
          }

          .prose :global(.notice .content) {
            flex-grow: 1;
          }

          .prose :global(.notice a) {
            color: ${editorTheme.noticeInfoText};
          }
          .prose :global(.notice a:not(.heading-name)) {
            text-decoration: underline;
          }

          .prose :global(.notice-tip) {
            background: ${editorTheme.noticeTipBackground};
            color: ${editorTheme.noticeTipText};
          }

          .prose :global(.notice-tip a) {
            color: ${editorTheme.noticeTipText};
          }
          .prose :global(.notice-warning) {
            background: ${editorTheme.noticeWarningBackground};
            color: ${editorTheme.noticeWarningText};
          }

          .prose: global(.notice-warning a) {
            color: ${editorTheme.noticeWarningText};
          }

          .prose :global(table *) {
            margin: 0;
          }
        `}</style>
      </article>
      {small ? null : (
        <>
          {injection ? (
            <InnerHTML
              id="snippet-injection"
              className={articleClassName}
              html={injectionHTML}
            />
          ) : null}
          <footer className="text-gray-300 text-center my-20 text-sm">
            Built with{' '}
            <a
              href="https://cinwell.com/notea/"
              target="_blank"
              rel="noreferrer"
            >
              Notea
            </a>
          </footer>
        </>
      )}
    </>
  )
}
