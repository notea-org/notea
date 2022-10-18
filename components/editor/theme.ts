import { useTheme } from 'next-themes';
import { theme } from '@notea/rich-markdown-editor';
import { light, dark } from '@notea/rich-markdown-editor/dist/styles/theme';

export const darkTheme: typeof theme = {
    ...dark,
    background: 'inherit',
    text: 'inherit',
    fontFamily: 'inherit',
};

export const lightTheme: typeof theme = {
    ...light,
    background: 'inherit',
    text: 'inherit',
    fontFamily: 'inherit',
};

export const useEditorTheme = () => {
    const { resolvedTheme } = useTheme();

    return resolvedTheme === 'dark' ? darkTheme : lightTheme;
};
