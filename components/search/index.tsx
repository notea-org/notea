import { SearchState } from 'containers/search'
import { FC } from 'react'
import { Modal } from '@material-ui/core'
import SearchList from './search-list'
import SearchInput from './search-input'
import { UIState } from 'containers/ui'

const Search: FC = () => {
  const { isOpen, closeModal } = SearchState.useContainer()
  const { ua } = UIState.useContainer()

  return (
    <Modal
      open={isOpen}
      onClose={closeModal}
      style={{ top: ua.isMobileOnly ? 0 : '10vh' }}
      className="w-full m-auto md:w-1/2 lg:w-1/3"
    >
      <div className="bg-gray-50 text-gray-800 outline-none rounded overflow-auto">
        <SearchInput />
        <SearchList />
      </div>
    </Modal>
  )
}

export default Search
