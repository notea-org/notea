import { ListItem } from './list-item'
import { PageListState } from 'containers/page-list'

export const List = () => {
  const { list } = PageListState.useContainer()

  return (
    <ul className="h-full">
      {list.map((item) => (
        <ListItem key={item.id} {...item}></ListItem>
      ))}
    </ul>
  )
}
