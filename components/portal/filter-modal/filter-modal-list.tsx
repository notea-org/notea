import UIState from 'libs/web/state/ui'
import { FC, ReactNode } from 'react'
import { use100vh } from 'react-div-100vh'

const FilterModalList: FC<{
  ItemComponent: (item: any) => ReactNode
  items?: any[]
}> = ({ ItemComponent, items }) => {
  const {
    ua: { isMobileOnly },
  } = UIState.useContainer()
  const height = use100vh() || 0
  const calcHeight = isMobileOnly ? height : (height * 2) / 3

  return (
    <>
      {items?.length ? (
        <ul className="list border-t border-gray-100 overflow-auto divide-y divide-gray-100">
          {items?.map((item) => ItemComponent(item))}
        </ul>
      ) : null}
      <style jsx>{`
        .list {
          max-height: calc(${calcHeight ? calcHeight + 'px' : '100vh'} - 40px);
        }
      `}</style>
    </>
  )
}

export default FilterModalList
