import { GetStaticProps } from 'next'
import { Layout } from '../components/layout'

const IndexPage = () => <Layout></Layout>

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  }
}

export default IndexPage
