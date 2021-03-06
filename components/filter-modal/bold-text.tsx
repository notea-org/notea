import { FC, ReactNode } from 'react'

const BoldText: FC<{
  text?: string
  keyword?: string
  maxLen?: number
}> = ({ text = '', keyword = '', maxLen = 80 }) => {
  let start = 0
  let end = 0
  const texts: ReactNode[] = []
  const indexContent = text.search(keyword)

  start = indexContent < 11 ? 0 : indexContent - 10
  end = start === 0 ? maxLen - 10 : indexContent + keyword.length + maxLen

  if (text && end > text.length) {
    end = text.length
  }

  const blocks = text.substring(start, end).split(keyword)

  blocks.forEach((block, index) => {
    texts.push(
      block,
      <span className="font-bold text-gray-800" key={index}>
        {keyword}
      </span>
    )
  })
  texts.pop()

  return <span>{texts}</span>
}

export default BoldText
