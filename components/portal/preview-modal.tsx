import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Paper, Popper } from '@material-ui/core'
import PortalState from 'libs/web/state/portal'
import { useRouter } from 'next/router'
import { NoteCacheItem } from 'libs/web/cache'
import useNoteAPI from 'libs/web/api/note'
import { PostContainer } from 'components/container/post-container'
import { renderMarkdown } from 'libs/shared/markdown/render'
import IconButton from 'components/icon-button'
import HotkeyTooltip from 'components/hotkey-tooltip'
import useI18n from 'libs/web/hooks/use-i18n'

const LEAVE_DELAY = 200
const ENTER_DELAY = 500

const PreviewModal: FC = () => {
  const { t } = useI18n()
  const {
    preview: { anchor, open, close, visible, data, setAnchor },
  } = PortalState.useContainer()
  const anchorRef = useRef<HTMLLinkElement | null>()
  const router = useRouter()
  const leaveTimer = useRef<number>()
  const enterTimer = useRef<number>()
  const { fetch: fetchNote } = useNoteAPI()
  const [note, setNote] = useState<NoteCacheItem>()

  const handleEnter = useCallback(() => {
    clearTimeout(leaveTimer.current)
    clearTimeout(enterTimer.current)
    enterTimer.current = window.setTimeout(() => {
      open()
    }, ENTER_DELAY)
  }, [open])

  const handleLeave = useCallback(() => {
    clearTimeout(leaveTimer.current)
    clearTimeout(enterTimer.current)
    leaveTimer.current = window.setTimeout(() => {
      close()
    }, LEAVE_DELAY)
  }, [close])

  useEffect(() => {
    if (anchorRef.current) {
      anchorRef.current.removeEventListener('mouseover', handleEnter)
      anchorRef.current.removeEventListener('mouseleave', handleLeave)
    }

    if (anchor) {
      anchorRef.current = anchor as HTMLLinkElement
      anchorRef.current.addEventListener('mouseover', handleEnter)
      anchorRef.current.addEventListener('mouseleave', handleLeave)
      handleEnter()
    }

    return () => {
      anchorRef.current?.addEventListener('mouseover', handleEnter)
      anchorRef.current?.addEventListener('mouseleave', handleLeave)
      close()
    }
  }, [handleEnter, handleLeave, anchor, close])

  const findNote = useCallback(
    async (id: string) => {
      setNote(await fetchNote(id))
    },
    [fetchNote]
  )

  const gotoLink = useCallback(() => {
    if (note?.id) {
      router.push(note.id)
    }
  }, [note?.id, router])

  const post = useMemo(() => {
    return renderMarkdown(note?.content ?? '')
  }, [note?.content])

  useEffect(() => {
    setAnchor(null)
    close()
  }, [router.query.id, close, setAnchor])

  useEffect(() => {
    if (data?.id) {
      findNote(data?.id)
    }
  }, [data?.id, findNote])

  if (!anchor) {
    return null
  }

  return (
    <Popper
      onMouseOver={handleEnter}
      onMouseLeave={handleLeave}
      placement="bottom"
      anchorEl={anchor}
      open={visible}
    >
      <Paper className="relative bg-gray-50 text-gray-800 w-full h-96 md:w-96 dark:bg-gray-800">
        <div className="absolute right-2 top-2">
          <HotkeyTooltip text={t('Open link')}>
            <IconButton onClick={gotoLink} icon="Link"></IconButton>
          </HotkeyTooltip>
        </div>
        <div className="overflow-y-scroll h-full p-4">
          <PostContainer small post={post} title={note?.title}></PostContainer>
        </div>
      </Paper>
    </Popper>
  )
}

export default PreviewModal
