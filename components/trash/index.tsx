import { FC, useEffect } from 'react'
import FilterModal from 'components/filter-modal/filter-modal'
import FilterModalInput from 'components/filter-modal/filter-modal-input'
import FilterModalList from 'components/filter-modal/filter-modal-list'
import TrashItem from './trash-item'
import { NoteModel } from 'libs/web/state/note'
import { TrashState } from 'libs/web/state/trash'

const Trash: FC = () => {
  const {
    isOpen,
    closeModal,
    filterNotes,
    keyword,
    list,
  } = TrashState.useContainer()

  useEffect(() => {
    if (isOpen) {
      filterNotes()
    }
  }, [isOpen, filterNotes])

  return (
    <FilterModal open={isOpen} onClose={closeModal}>
      <FilterModalInput
        placeholder="Search note in trash"
        doFilter={filterNotes}
        keyword={keyword}
      />
      <FilterModalList
        items={list}
        ItemComponent={(item: NoteModel) => (
          <TrashItem note={item} keyword={keyword} key={item.id} />
        )}
      />
    </FilterModal>
  )
}

export default Trash
