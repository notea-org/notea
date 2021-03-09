import { FC, ReactNode } from 'react'
import { searchRangeText } from 'shared/text'

const BoldText: FC<{
  text?: string
  keyword?: string
  maxLen?: number
}> = ({ text = '', keyword = '', maxLen = 80 }) => {
  const texts: ReactNode[] = []
  const result = searchRangeText({
    text,
    keyword,
    maxLen,
  })
  const blocks = result.split(keyword)

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
