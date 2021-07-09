import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { PageTitle } from '@/components/helmet/PageTitle'
import { routes } from '@/utils/constants'
import { getAuth } from '@/store/selectors'
import { registration } from '@/store/authentication/authentication.slice'

import { RegistrationForm } from './RegistrationForm'

const RegistrationPage = () => {
  const { loading } = useSelector(getAuth)
  const dispatch = useDispatch()

  const onSubmit = (data) => {
    dispatch(registration(data))
  }

  return (
    <main className="auth">
      <PageTitle title="Login" />
      <div className="auth__container">
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
