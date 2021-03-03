import { FC, useEffect, useRef } from 'react'
import IconSearch from 'heroicons/react/outline/Search'
import { SearchState } from 'containers/search'
import { useDebouncedCallback } from 'use-debounce'

const SearchInput: FC = () => {
  const { setKeyword, keyword } = SearchState.useContainer()
  const inputRef = useRef<HTMLInputElement>(null)
  const doSearch = useDebouncedCallback((value: string) => {
    setKeyword(value)
  }, 300)

  useEffect(() => {
    inputRef.current?.select()
  }, [])

  return (
    <div className="flex py-2 px-4">
      <IconSearch width="16" />
      <input
        ref={inputRef}
        defaultValue={keyword}
        type="text"
        className="appearance-none w-full outline-none ml-2 bg-transparent"
        placeholder="Search note"
        autoFocus
        onChange={(e) => doSearch.callback(e.target.value)}
      />
    </div>
  )
}

export default SearchInput
