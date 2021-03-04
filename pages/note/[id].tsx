import { NoteModel, NoteState } from 'containers/note'
import { has } from 'lodash'
import router, { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'
import LayoutMain from 'components/layout/layout-main'
import { NoteTreeState } from 'containers/tree'
import NoteNav from 'components/note-nav'
import dynamic from 'next/dynamic'
import { GetServerSideProps, NextPage } from 'next'
import { TreeData } from '@atlaskit/tree'
import withTree from 'services/with-tree'
import withUA from 'services/with-ua'
import classNames from 'classnames'
import { useDarkMode } from 'next-dark-mode'
import { UIState } from 'containers/ui'

const NoteEditor = dynamic(() => import('components/editor/note-editor'))

const EditContainer = () => {
  const { title } = UIState.useContainer()
  const { darkModeActive } = useDarkMode()
  const { genNewId } = NoteTreeState.useContainer()
  const { getById, setNote, note } = NoteState.useContainer()
  const { query } = useRouter()

  const loadNoteById = useCallback(
    (id: string) => {
      const pid = router.query.pid as string
      if (id === 'welcome') {
        return
      } else if (id === 'new') {
        const url = `/note/${genNewId()}?new` + (pid ? `&pid=${pid}` : '')

        router.replace(url, undefined, { shallow: true })
      } else if (id && !has(router.query, 'new')) {
        getById(id).catch((msg) => {
          if (msg.status === 404) {
            // todo: toast
            console.error('页面不存在')
          }
          router.push('/', undefined, { shallow: true })
        })
      } else {
        setNote({
          id,
          title: '',
          content: '\n',
        } as NoteModel)
      }
    },
    [genNewId, getById, setNote]
  )

  useEffect(() => {
    loadNoteById(query.id as string)
  }, [loadNoteById, query.id])

  useEffect(() => {
    title.updateTitle(note.title)
  }, [note.title, title])

  return query.id !== 'welcome' ? (
    <>
      <NoteNav />
      <section
        className={classNames('overflow-y-scroll h-full', {
          'prose-dark': darkModeActive,
        })}
      >
        <NoteEditor />
      </section>
    </>
  ) : (
    <div>使用说明之类的</div>
  )
}

const EditNotePage: NextPage<{ tree: TreeData }> = ({ tree }) => {
  return (
    <LayoutMain tree={tree}>
      <EditContainer />
    </LayoutMain>
  )
}

export default EditNotePage

export const getServerSideProps: GetServerSideProps = withUA(
  withTree(() => {
    return {}
  })
)
