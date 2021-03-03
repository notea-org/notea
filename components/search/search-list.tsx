import { SearchState } from 'containers/search'
import { FC } from 'react'
import SearchItem from './search-item'
import styled from 'styled-components'

const StyledUL = styled.ul`
  max-height: 76vh;
`

const SearchList: FC = () => {
  const { list, keyword } = SearchState.useContainer()

  return list?.length ? (
    <StyledUL className="border-t border-gray-200 overflow-auto">
      {list?.map((note) => (
        <SearchItem keyword={keyword} note={note} key={note.id} />
      ))}
    </StyledUL>
  ) : null
}

export default SearchList
