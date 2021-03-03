import { SearchState } from 'containers/search'
import { FC } from 'react'
import SearchItem from './search-item'
import styled from 'styled-components'

const StyledList = styled.ul`
  max-height: calc(80vh - 40px);
`

const SearchList: FC = () => {
  const { list, keyword } = SearchState.useContainer()

  return list?.length ? (
    <StyledList className="border-t border-gray-100 overflow-auto">
      {list?.map((note) => (
        <SearchItem keyword={keyword} note={note} key={note.id} />
      ))}
    </StyledList>
  ) : null
}

export default SearchList
