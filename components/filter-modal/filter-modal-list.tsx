import { FC, ReactNode } from 'react'
import styled from 'styled-components'

const StyledList = styled.ul`
  max-height: calc(80vh - 40px);
`

const FilterModalList: FC<{
  ItemComponent: (item: any) => ReactNode
  items?: any[]
}> = ({ ItemComponent, items }) => {
  return items?.length ? (
    <StyledList className="border-t border-gray-100 overflow-auto divide-y divide-gray-100">
      {items?.map((item) => ItemComponent(item))}
    </StyledList>
  ) : null
}

export default FilterModalList
