import { SearchState } from 'libs/web/state/search'
import { FC } from 'react'
import FilterModal from 'components/filter-modal/filter-modal'
import FilterModalInput from 'components/filter-modal/filter-modal-input'
import FilterModalList from 'components/filter-modal/filter-modal-list'
import SearchItem from './search-item'
import { NoteModel } from 'libs/web/state/note'

const Search: FC = () => {
  const {
    isOpen,
    closeModal,
    filterNotes,
    keyword,
    list,
  } = SearchState.useContainer()

  return (
    <FilterModal open={isOpen} onClose={closeModal}>
      <FilterModalInput
        placeholder={'Search note'}
        doFilter={filterNotes}
        keyword={keyword}
      />
      <FilterModalList
        items={list}
        ItemComponent={(item: NoteModel) => (
          <SearchItem note={item} keyword={keyword} key={item.id} />
        )}
      />
    </FilterModal>
  )
}

export default Search
