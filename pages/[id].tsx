import { NoteModel, NoteState } from 'libs/web/state/note'
import { has } from 'lodash'
import router, { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'
import LayoutMain from 'components/layout/layout-main'
import { NoteTreeState } from 'libs/web/state/tree'
import NoteNav from 'components/note-nav'
import dynamic from 'next/dynamic'
import { GetServerSideProps, NextPage } from 'next'
import { withTree } from 'libs/server/middlewares/tree'
import { withUA } from 'libs/server/middlewares/ua'
import classNames from 'classnames'
import { UIState } from 'libs/web/state/ui'
import { TreeModel } from 'libs/shared/tree'
import { noteCache } from 'libs/web/cache/note'
import { withSession } from 'libs/server/middlewares/session'
import { withStore } from 'libs/server/middlewares/store'
import { withSettings } from 'libs/server/middlewares/settings'
import { withAuth } from 'libs/server/middlewares/auth'
import { withNote } from 'libs/server/middlewares/note'
import LayoutPublic from 'components/layout/layout-public'
import { PageMode } from 'libs/shared/page'
import { useDidUpdated } from 'libs/web/hooks/use-did-updated'

const NoteEditor = dynamic(() => import('components/editor/note-editor'))

const EditContainer = () => {
  const {
    title: { updateTitle },
  } = UIState.useContainer()
  const { genNewId } = NoteTreeState.useContainer()
  const {
    fetchNote,
    findOrCreateNote,
    initNote,
    note,
  } = NoteState.useContainer()
  const { query } = useRouter()
  const pid = query.pid as string
  const id = query.id as string

  const loadNoteById = useCallback(
    async (id: string) => {
      if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(id)) {
        findOrCreateNote(id, {
          id,
          title: id,
          content: '\n',
        })
      } else if (id === 'new') {
        const url = `/${genNewId()}?new` + (pid ? `&pid=${pid}` : '')

        router.replace(url, undefined, { shallow: true })
      } else if (id && !has(router.query, 'new')) {
        fetchNote(id).catch((msg) => {
          // todo: toast
          console.error(msg)
          router.push('/', undefined, { shallow: true })
        })
      } else {
        if (await noteCache.getItem(id)) {
          router.push(`/${id}`, undefined, { shallow: true })
          return
        }

        initNote({
          id,
          content: '\n',
        })
      }
    },
    [fetchNote, findOrCreateNote, genNewId, initNote, pid]
  )

  useDidUpdated(() => {
    loadNoteById(id)
  }, [loadNoteById, id])

  useEffect(() => {
    updateTitle(note?.title)
  }, [note?.title, updateTitle])

  return (
    <>
      <NoteNav />
      <section className={classNames('overflow-y-scroll h-full')}>
        <NoteEditor />
      </section>
    </>
  )
}

const EditNotePage: NextPage<{
  tree: TreeModel
  note?: NoteModel
  pageMode: PageMode
}> = ({ tree, note, pageMode }) => {
  if (PageMode.PUBLIC === pageMode) {
    return <LayoutPublic>2</LayoutPublic>
  }
  return (
    <LayoutMain tree={tree} note={note}>
      <EditContainer />
    </LayoutMain>
  )
}

export default EditNotePage

export const getServerSideProps: GetServerSideProps = withUA(
  withSession(withStore(withNote(withAuth(withTree(withSettings(() => ({})))))))
)
