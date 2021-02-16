import IconPlus from 'heroicons/react/outline/Plus'
import IconSearch from 'heroicons/react/outline/Search'
import IcoTrash from 'heroicons/react/outline/Trash'
import IconMoon from 'heroicons/react/outline/Moon'
import IconSun from 'heroicons/react/outline/Sun'
import { FC, HTMLProps } from 'react'
import { useRouter } from 'next/router'

const ButtonItem: FC<HTMLProps<HTMLDivElement>> = (props) => {
  const { children, ...attrs } = props
  return (
    <div
      {...attrs}
      className="block p-3 text-gray-500 hover:text-gray-800 cursor-pointer"
    >
      {children}
    </div>
  )
}

export const Sidebar = () => {
  const router = useRouter()

  return (
    <div className="h-full flex flex-col">
      <ButtonItem>
        <IconSearch />
      </ButtonItem>

      <ButtonItem>
        <IcoTrash />
      </ButtonItem>

      <ButtonItem
        onClick={() => {
          router.push('/')
        }}
      >
        <IconPlus />
      </ButtonItem>

      <div className="mt-auto">
        <ButtonItem>
          <IconMoon />
        </ButtonItem>
      </div>
    </div>
  )
}
