import SearchState from 'libs/web/state/search'
import { FC } from 'react'
import FilterModal from 'components/portal/filter-modal/filter-modal'
import FilterModalInput from 'components/portal/filter-modal/filter-modal-input'
import FilterModalList from 'components/portal/filter-modal/filter-modal-list'
import SearchItem from './search-item'
import { NoteModel } from 'libs/web/state/note'
import PortalState from 'libs/web/state/portal'
import useI18n from 'libs/web/hooks/use-i18n'

const SearchModal: FC = () => {
  const { t } = useI18n()
  const { filterNotes, keyword, list } = SearchState.useContainer()
  const {
    search: { visible, close },
  } = PortalState.useContainer()

  return (
    <FilterModal open={visible} onClose={close}>
      <FilterModalInput
        placeholder={t('Search note')}
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
