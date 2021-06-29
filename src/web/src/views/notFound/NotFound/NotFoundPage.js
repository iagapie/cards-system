import { Main, Wrapper, Title, Text, Toolbar, User, Link } from '@/views/notFound/NotFound/NotFoundPage.styles'
import { PageTitle } from '@/components/helmet/PageTitle/PageTitle'

const NotFoundPage = () => {
  // TODO: add logout
  const currentUser = { name: 'Igor Agapie' }
  const isAuthenticated = true

  return (
    <Main>
      <Wrapper>
        <PageTitle title="Not Found" />
        <Title>Board not found.</Title>
        <Text>
          This board may be private. If someone gave you this link, they may need to invite you to one of their boards.
        </Text>
        {isAuthenticated && (
          <Toolbar>
            <div>
              Not <User>{currentUser.name}</User>?
            </div>
            <Link>Switch accounts</Link>
          </Toolbar>
        )}
      </Wrapper>
    </Main>
  )
}

export default NotFoundPage
