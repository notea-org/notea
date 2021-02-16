import { useSession } from 'next-auth/client'
import { Layout } from 'components/layout'
import { useRouter } from 'next/router'

const IndexPage = () => {
  const [session, loading] = useSession()
  const router = useRouter()

  if (loading) return null

  if (!loading && !session) {
    router.push('/api/auth/signin')
    return null
  }

  return <Layout></Layout>
}

export default IndexPage
