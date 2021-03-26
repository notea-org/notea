import { useState, useCallback } from 'react'
import { createContainer } from 'unstated-next'

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

const useModal = () => {
  return {
    search: useModalIntance(),
    trash: useModalIntance(),
    share: useModalIntance(),
  }
}

const ModalState = createContainer(useModal)

export default ModalState
