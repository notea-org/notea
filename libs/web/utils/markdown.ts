import rm from 'remove-markdown';

export const removeMarkdown = (markdown?: string) => {
    return rm(markdown).replace(/\\/g, '');
};
