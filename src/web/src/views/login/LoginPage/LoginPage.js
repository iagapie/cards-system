import { PageTitle } from '@/components/helmet/PageTitle/PageTitle'
import { Main } from '@/views/login/LoginPage/LoginPage.styles'
import { LoginForm } from '@/views/login/LoginForm/LoginForm'

const LoginPage = () => {
  return (
    <Main>
      <PageTitle title="Login" />
      <LoginForm loading={false} error="" onSubmit={() => {}} />
    </Main>
  )
}

export default LoginPage
