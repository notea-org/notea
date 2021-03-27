import { FC, useEffect, useRef } from 'react'
import IconSearch from 'heroicons/react/outline/Search'
import { useDebouncedCallback } from 'use-debounce'

 const FilterModalInput: FC<{
  doFilter: (keyword: string) => void
  keyword?: string
  placeholder: string
}> = ({ doFilter, keyword, placeholder }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const debouncedFilter = useDebouncedCallback((value: string) => {
    doFilter(value)
  }, 200)

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
        placeholder={placeholder}
        autoFocus
        onChange={(e) => debouncedFilter.callback(e.target.value)}
      />
    </div>
  )
}

export default FilterModalInput
