import IconPlus from 'heroicons/react/outline/Plus'
import IconBox from 'heroicons/react/outline/Archive'
import IconSearch from 'heroicons/react/outline/Search'
import IcoTrash from 'heroicons/react/outline/Trash'
import { FC, HTMLProps } from 'react'
import { useRouter } from 'next/router'

const ButtonItem: FC<HTMLProps<HTMLDivElement>> = (props) => {
  return (
    <div className="block p-3 text-gray-500 hover:text-gray-800 cursor-pointer">
      {props.children}
    </div>
  )
}

export const Sidebar = () => {
  const router = useRouter()

  return (
    <div>
      <ButtonItem
        onClick={() => {
          router.push('/')
        }}
      >
        <IconBox />
      </ButtonItem>
      <ButtonItem>
        <IconPlus />
      </ButtonItem>
      <ButtonItem>
        <IconSearch />
      </ButtonItem>
      <ButtonItem>
        <IcoTrash />
      </ButtonItem>
    </div>
  )
}
