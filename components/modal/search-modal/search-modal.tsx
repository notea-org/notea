import SearchState from 'libs/web/state/search'
import { FC } from 'react'
import FilterModal from 'components/modal/filter-modal/filter-modal'
import FilterModalInput from 'components/modal/filter-modal/filter-modal-input'
import FilterModalList from 'components/modal/filter-modal/filter-modal-list'
import SearchItem from './search-item'
import { NoteModel } from 'libs/web/state/note'
import ModalState from 'libs/web/state/modal'

const SearchModal: FC = () => {
  const { filterNotes, keyword, list } = SearchState.useContainer()
  const {
    search: { visible, close },
  } = ModalState.useContainer()

  return (
    <FilterModal open={visible} onClose={close}>
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

export default SearchModal
