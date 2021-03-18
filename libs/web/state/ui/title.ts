import { useState, useCallback } from 'react'

export function useTitle() {
  const [value, setTitle] = useState('Notea')

  const updateTitle = useCallback((text?: string) => {
    setTitle(text ? `${text} - Notea` : 'Notea')
  }, [])

  return { value, updateTitle }
}
