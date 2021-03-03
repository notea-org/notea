import { SearchState } from 'containers/search'
import { FC } from 'react'
import { Modal } from '@material-ui/core'
import SearchList from './search-list'
import SearchInput from './search-input'

const Search: FC = () => {
  const { isOpen, closeModal } = SearchState.useContainer()

  return (
    <Modal
      open={isOpen}
      onClose={closeModal}
      style={{ top: '10vh' }}
      className="w-1/3 m-auto"
    >
      <div className="bg-gray-50 text-gray-800 outline-none rounded overflow-auto">
        <SearchInput />
        <SearchList />
      </div>
    </Modal>
  )
}

export default Search
