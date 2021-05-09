/**
 * @todo parse underlined header
 */
export const parseMarkdownTitle = (markdown: string) => {
  const matches = markdown.match(/^#[^#][\s]*(.+?)#*?$/m)

  if (matches && matches.length) {
    return {
      content: markdown.replace(matches[0], ''),
      title: matches[1],
    }
  }
  return { content: markdown, title: '' }
}
