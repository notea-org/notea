import { ListItem } from './list-item'
import { PageListState } from 'containers/page-list'

export const List = () => {
  const { list } = PageListState.useContainer()

  return (
    <ul className="h-full text-sm">
      <li className="p-1.5 pl-4 text-gray-500">我的页面</li>
      {list.map((item) => (
        <ListItem key={item.id} {...item}></ListItem>
      ))}
    </ul>
  )
}
