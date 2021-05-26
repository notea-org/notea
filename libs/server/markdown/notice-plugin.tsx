import MarkdownIt from 'markdown-it'
import customFence from 'markdown-it-container'
import ReactDOMServer from 'react-dom/server'
import { WarningIcon, InfoIcon, StarredIcon } from 'outline-icons'

export default function notice(md: MarkdownIt) {
  return customFence(md, 'notice', {
    marker: ':',
    validate: () => true,
    render: function (tokens, idx) {
      const { info } = tokens[idx]
      let icon

      if (info === 'tip') {
        icon = <StarredIcon color="currentColor" />
      } else if (info === 'warning') {
        icon = <WarningIcon color="currentColor" />
      } else {
        icon = <InfoIcon color="currentColor" />
      }

      if (tokens[idx].nesting === 1) {
        // opening tag
        return `<div class="notice notice-${md.utils.escapeHtml(
          info
        )}">\n${ReactDOMServer.renderToString(
          <div className="icon">{icon}</div>
        )}<div class="content">`
      } else {
        // closing tag
        return '</div></div>\n'
      }
    },
  })
}
