import { FC } from 'react'

export const SettingsHeader: FC<{
  title: string
  id: string
  description?: string
}> = ({ title, id, description }) => {
  return (
    <>
      <h3 id={id}>
        <a href={`#${id}`}>{title}</a>
        <style jsx>{`
          a {
            text-decoration: none;
          }
        `}</style>
      </h3>
      <p className="text-sm">{description}</p>
    </>
  )
}
