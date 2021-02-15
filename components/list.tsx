import { useFetch } from 'use-http'
import { ListItem } from './list-item'
import ArrowRight from '../assets/icons/arrow-right.svg'

export const List = () => {
  const { loading, data = [] } = useFetch('/api/pages', {}, [])

  return (
    <>
      {loading && 'Loading...'}
      <ul className="h-full">
        {data.map((item) => (
          <div
            key={item.id}
            className="flex text-sm items-center p-2 hover:bg-gray-200 cursor-pointer"
          >
            <ArrowRight width="16" height="16" />
            <span>{item.title}</span>
          </div>
        ))}
      </ul>
    </>
  )
}
