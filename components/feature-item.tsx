import { FC } from 'react'

export const FeatureItem: FC<{ title: string }> = ({ title, children }) => {
  return (
    <div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p>{children}</p>
    </div>
  )
}
