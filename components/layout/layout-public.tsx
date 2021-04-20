import { TreeModel } from 'libs/shared/tree'
import NoteState, { NoteModel } from 'libs/web/state/note'
import NoteTreeState from 'libs/web/state/tree'
import { FC } from 'react'

const LayoutPublic: FC<{
  tree: TreeModel
  note?: NoteModel
}> = ({ children, note, tree }) => {
  return (
    <NoteTreeState.Provider initialState={tree}>
      <NoteState.Provider initialState={note}>{children}</NoteState.Provider>
    </NoteTreeState.Provider>
  )
}

export default LayoutPublic
