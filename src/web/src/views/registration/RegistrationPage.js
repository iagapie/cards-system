import { Link } from 'react-router-dom'

import { PageTitle } from '@/components/helmet/PageTitle'
import { routes } from '@/utils/constants'

import { RegistrationForm } from './RegistrationForm'

const RegistrationPage = () => {
  const loading = false

  const onSubmit = (data) => {
    console.log(data)
  }

  return (
    <main className="auth">
      <PageTitle title="Login" />
      <div className="auth__container">
        <div className="auth__error">Sign up error</div>
        <h1 className="auth__title">Sign up for your account</h1>
        <RegistrationForm className="auth__form" loading={loading} onSubmit={onSubmit} />
        <div className="auth__footer">
          <Link className="auth__link" to={routes.auth.login}>
            Already have an account? Log in
          </Link>
        </div>
      </div>
    </main>
  )
}

export default RegistrationPage
