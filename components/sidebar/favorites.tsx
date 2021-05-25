import Tree from '@atlaskit/tree'
import HotkeyTooltip from 'components/hotkey-tooltip'
import IconButton from 'components/icon-button'
import { ROOT_ID } from 'libs/shared/tree'
import useI18n from 'libs/web/hooks/use-i18n'
import NoteTreeState from 'libs/web/state/tree'
import React, { FC, useMemo, useState } from 'react'
import SidebarListItem from './sidebar-list-item'

export const Favorites: FC = () => {
  const { t } = useI18n()
  const { pinnedTree } = NoteTreeState.useContainer()
  const [isFold, setFold] = useState(false)
  const hasPinned = useMemo(() => pinnedTree.items[ROOT_ID].children.length, [
    pinnedTree,
  ])

  if (!hasPinned) {
    return null
  }

  return (
    <>
      <div className="group h-10 p-2 text-gray-500 flex items-center sticky top-0 bg-gray-100 z-10">
        <div className="flex-auto flex items-center">
          <span>{t('Favorites')}</span>
        </div>
        <HotkeyTooltip text={t('Fold Favorites')}>
          <IconButton
            icon="Selector"
            onClick={() => setFold((prev) => !prev)}
            className="text-gray-700 hidden group-hover:block"
          ></IconButton>
        </HotkeyTooltip>
      </div>
      {!isFold ? (
        <div>
          <Tree
            tree={pinnedTree}
            offsetPerLevel={10}
            renderItem={({
              provided,
              item,
              onExpand,
              onCollapse,
              snapshot,
            }) => (
              <SidebarListItem
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                onExpand={onExpand}
                onCollapse={onCollapse}
                isExpanded={item.isExpanded}
                innerRef={provided.innerRef}
                hasChildren={!!item.children.length}
                item={{
                  ...item.data,
                  id: item.id,
                }}
                snapshot={snapshot}
              ></SidebarListItem>
            )}
          ></Tree>
        </div>
      ) : null}
    </>
  )
}
