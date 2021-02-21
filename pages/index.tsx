import { TreeData } from '@atlaskit/tree'
import LayoutMain from 'components/layout/layout-main'

const IndexPage = ({ tree }: IndexPageProps) => {
  return (
    <LayoutMain tree={tree}>
      <div>帮助文档之类的</div>
    </LayoutMain>
  )
}

export default IndexPage

export interface IndexPageProps {
  tree: TreeData
}

export { getServerSideProps } from 'services/init-tree'
