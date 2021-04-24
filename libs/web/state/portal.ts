import { useState, useCallback, MouseEvent } from 'react'
import { createContainer } from 'unstated-next'
import { NoteModel } from './note'

const useModalIntance = () => {
  const [visible, setVisible] = useState(false)

  const open = useCallback(() => {
    setVisible(true)
  }, [])

  const close = useCallback(() => {
    setVisible(false)
  }, [])

  return { visible, open, close }
}

const useAnchorIntance = <T>() => {
  const [anchor, setAnchor] = useState<Element | null>(null)
  const [data, setData] = useState<T>()

  const open = useCallback((target: Element | MouseEvent) => {
    setAnchor(target instanceof Element ? target : target.currentTarget)
  }, [])

  const close = useCallback(() => {
    setAnchor(null)
  }, [])

  return { anchor, open, close, data, setData }
}

const useModal = () => {
  return {
    search: useModalIntance(),
    trash: useModalIntance(),
    menu: useAnchorIntance<NoteModel>(),
    share: useAnchorIntance<NoteModel>(),
  }
}

const PortalState = createContainer(useModal)

export default PortalState
