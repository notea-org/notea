import SearchState from 'libs/web/state/search'
import { FC } from 'react'
import FilterModal from 'components/portals/filter-modal/filter-modal'
import FilterModalInput from 'components/portals/filter-modal/filter-modal-input'
import FilterModalList from 'components/portals/filter-modal/filter-modal-list'
import SearchItem from './search-item'
import { NoteModel } from 'libs/web/state/note'
import PortalState from 'libs/web/state/portal'

const SearchModal: FC = () => {
  const { filterNotes, keyword, list } = SearchState.useContainer()
  const {
    search: { visible, close },
  } = PortalState.useContainer()

  return (
    <FilterModal open={visible} onClose={close}>
      <FilterModalInput
        placeholder={'Search note'}
        doFilter={filterNotes}
        keyword={keyword}
        onClose={close}
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
