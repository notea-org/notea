/**
 * @todo parse underlined header
 */
export const parseMarkdownTitle = (markdown: string) => {
    const matches = markdown.match(/^#[^#][\s]*(.+?)#*?$/m);

    if (matches && matches.length) {
        const title = matches[1];
        return {
            content: markdown.replace(matches[0], ''),
            title: title.length > 0 ? title : undefined,
        };
    }
    return { content: markdown, title: undefined };
};
