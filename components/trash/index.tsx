import { FC, useEffect } from 'react'
import FilterModal from 'components/filter-modal/filter-modal'
import FilterModalInput from 'components/filter-modal/filter-modal-input'
import FilterModalList from 'components/filter-modal/filter-modal-list'
import TrashItem from './trash-item'
import { NoteModel } from 'containers/note'
import { TrashState } from 'containers/trash'

const Trash: FC = () => {
  const {
    isOpen,
    closeModal,
    filterNotes,
    keyword,
    filterData,
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
        items={filterData}
        ItemComponent={(item: NoteModel) => (
          <TrashItem note={item} keyword={keyword} key={item.id} />
        )}
      />
    </FilterModal>
  )
}

export default Trash
