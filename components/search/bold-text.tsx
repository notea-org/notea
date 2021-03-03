import { FC, ReactNode } from 'react'

const BoldText: FC<{
  text?: string
  keyword?: string
}> = ({ text = '', keyword = '' }) => {
  let start = 0
  let end = 0
  const texts: ReactNode[] = []
  const indexContent = text.search(keyword)

  start = indexContent < 11 ? 0 : indexContent - 10
  end = start === 0 ? 70 : indexContent + keyword.length + 80

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
