import { useTheme } from 'next-themes'
import { theme } from 'rich-markdown-editor'

export const editorTheme: typeof theme = {
  ...theme,
  background: 'inherit',
  text: 'inherit',
  fontFamily: 'inherit',
}

export const darkTheme: typeof theme = {
  ...editorTheme,
}

export const lightTheme: typeof theme = {
  ...editorTheme,
}

export const useEditorTheme = () => {
  const { resolvedTheme } = useTheme()

  return resolvedTheme === 'dark' ? darkTheme : lightTheme
}
