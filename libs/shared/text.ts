import escapeStringRegexp from 'escape-string-regexp'

export function searchRangeText({
  text,
  keyword,
  maxLen = 80,
}: {
  text: string
  keyword: string
  maxLen: number
}) {
  let start = 0
  let end = 0
  const re = new RegExp(escapeStringRegexp(keyword), 'ig')
  const indexContent = text.search(re)

  start = indexContent < 11 ? 0 : indexContent - 10
  end = start === 0 ? maxLen - 10 : indexContent + keyword.length + maxLen

  if (text && end > text.length) {
    end = text.length
  }

  return {
    match: text.substring(start, end),
    re,
  }
}
