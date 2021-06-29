import { Main } from '@/views/registration/RegistrationPage/RegistrationPage.styles'
import { PageTitle } from '@/components/helmet/PageTitle/PageTitle'
import { RegistrationForm } from '@/views/registration/RegistrationForm/RegistrationForm'

const RegistrationPage = () => {
  return (
    <Main>
      <PageTitle title="Registration" />
      <RegistrationForm loading={false} error="" onSubmit={() => {}} />
    </Main>
  )
}

export default RegistrationPage
