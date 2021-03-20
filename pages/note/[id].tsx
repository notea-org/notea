import { NoteState } from 'libs/web/state/note'
import { has } from 'lodash'
import router, { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'
import LayoutMain from 'components/layout/layout-main'
import { NoteTreeState } from 'libs/web/state/tree'
import NoteNav from 'components/note-nav'
import dynamic from 'next/dynamic'
import { GetServerSideProps, NextPage } from 'next'
import withTree from 'libs/server/middlewares/tree'
import withUA from 'libs/server/middlewares/ua'
import classNames from 'classnames'
import { UIState } from 'libs/web/state/ui'
import { TreeModel } from 'libs/shared/tree'
import Link from 'next/link'
import { noteCache } from 'libs/web/cache/note'
import { withSession } from 'libs/server/middlewares/session'
import { withStore } from 'libs/server/middlewares/store'
import withSettings from 'libs/server/middlewares/settings'
import withAuth from 'libs/server/middlewares/auth'

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

  const loadNoteById = useCallback(
    async (id: string) => {
      const pid = router.query.pid as string
      if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(id)) {
        findOrCreateNote(id, {
          id,
          title: id,
          content: '\n',
        })
      } else if (id === 'welcome') {
        return
      } else if (id === 'new') {
        const url = `/note/${genNewId()}?new` + (pid ? `&pid=${pid}` : '')

        router.replace(url, undefined, { shallow: true })
      } else if (id && !has(router.query, 'new')) {
        fetchNote(id).catch((msg) => {
          // todo: toast
          console.error(msg)
          router.push('/', undefined, { shallow: true })
        })
      } else {
        if (await noteCache.getItem(id)) {
          router.push(`/note/${id}`, undefined, { shallow: true })
          return
        }

        initNote({
          id,
          content: '\n',
        })
      }
    },
    [fetchNote, findOrCreateNote, genNewId, initNote]
  )

  useEffect(() => {
    loadNoteById(query.id as string)
  }, [loadNoteById, query])

  useEffect(() => {
    updateTitle(note?.title)
  }, [note?.title, updateTitle])

  return query.id !== 'welcome' ? (
    <>
      <NoteNav />
      <section className={classNames('overflow-y-scroll h-full')}>
        <NoteEditor />
      </section>
    </>
  ) : (
    <div>
      使用说明之类的
      <Link href="/note/new">
        <a>Create Note</a>
      </Link>
    </div>
  )
}

const EditNotePage: NextPage<{ tree: TreeModel }> = ({ tree }) => {
  return (
    <LayoutMain tree={tree}>
      <EditContainer />
    </LayoutMain>
  )
}

export default EditNotePage

export const getServerSideProps: GetServerSideProps = withUA(
  withSession(
    withStore(
      withAuth(
        withTree(
          withSettings(() => {
            return {}
          })
        )
      )
    )
  )
)
