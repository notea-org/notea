import UIState from 'libs/web/state/ui'
import { FC, ReactNode } from 'react'
import { use100vh } from 'react-div-100vh'
import styled from 'styled-components'

const StyledList = styled.ul`
  max-height: ${({ height }: { height: number | null }) =>
    `calc(${height ? height + 'px' : '100vh'} - 40px)`};
`

const FilterModalList: FC<{
  ItemComponent: (item: any) => ReactNode
  items?: any[]
}> = ({ ItemComponent, items }) => {
  const {
    ua: { isMobileOnly },
  } = UIState.useContainer()
  const height = use100vh() || 0
  const calcHeight = isMobileOnly ? height : (height * 2) / 3

  return items?.length ? (
    <StyledList
      height={calcHeight}
      className="border-t border-gray-100 overflow-auto divide-y divide-gray-100"
    >
      {items?.map((item) => ItemComponent(item))}
    </StyledList>
  ) : null
}

export default FilterModalList
