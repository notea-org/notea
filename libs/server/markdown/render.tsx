import markdownit from 'markdown-it'
import markPlugin from 'rich-markdown-editor/dist/lib/markdown/mark'
import embedsPlugin from 'rich-markdown-editor/dist/lib/markdown/embeds'
import breakPlugin from 'rich-markdown-editor/dist/lib/markdown/breaks'
import tablesPlugin from 'rich-markdown-editor/dist/lib/markdown/tables'
import noticesPlugin from './notice-plugin'
import underlinesPlugin from 'rich-markdown-editor/dist/lib/markdown/underlines'
import hljs from 'highlight.js'

export function renderMarkdown(src: string) {
  src = src.replace(/\\\n/g, '\n')

  const html = markdownit('default', {
    breaks: false,
    html: false,
    linkify: true,
    highlight(str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang }).value
        } catch (_) {
          // nothing
        }
      }

      return '' // use external default escaping
    },
  })
    .use(embedsPlugin([]))
    .use(breakPlugin)
    .use(markPlugin({ delim: '==', mark: 'highlight' }))
    .use(markPlugin({ delim: '!!', mark: 'placeholder' }))
    .use(underlinesPlugin)
    .use(tablesPlugin)
    .use(noticesPlugin)
    .use(require('markdown-it-task-checkbox'), {
      disabled: true,
    })
    .use(require('markdown-it-implicit-figures'), {
      figcaption: true,
      dataType: true,
    })
    .render(src)
    .trim()

  return html
}
