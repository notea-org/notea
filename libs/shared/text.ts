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
  const indexContent = text.search(keyword)

  start = indexContent < 11 ? 0 : indexContent - 10
  end = start === 0 ? maxLen - 10 : indexContent + keyword.length + maxLen

  if (text && end > text.length) {
    end = text.length
  }

  return text.substring(start, end)
}
