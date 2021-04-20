import { FC, useEffect } from 'react'
import FilterModal from 'components/portal/filter-modal/filter-modal'
import FilterModalInput from 'components/portal/filter-modal/filter-modal-input'
import FilterModalList from 'components/portal/filter-modal/filter-modal-list'
import TrashItem from './trash-item'
import { NoteModel } from 'libs/web/state/note'
import TrashState from 'libs/web/state/trash'
import PortalState from 'libs/web/state/portal'

const TrashModal: FC = () => {
  const { filterNotes, keyword, list } = TrashState.useContainer()
  const {
    trash: { visible, close },
  } = PortalState.useContainer()

  useEffect(() => {
    if (visible) {
      filterNotes()
    }
  }, [visible, filterNotes])

  return (
    <FilterModal open={visible} onClose={close}>
      <FilterModalInput
        placeholder="Search note in trash"
        doFilter={filterNotes}
        keyword={keyword}
        onClose={close}
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

export default TrashModal
