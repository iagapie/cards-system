import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { appName, routes } from '@/utils/constants'
import { PageTitle } from '@/components/helmet/PageTitle'
import { getAuth } from '@/store/selectors'
import { login } from '@/store/authentication/authentication.slice'

import { LoginForm } from './LoginForm'

const LoginPage = () => {
  const { loading } = useSelector(getAuth)
  const dispatch = useDispatch()

  const onSubmit = (data) => {
    dispatch(login(data))
  }

  return (
    <main className="auth">
      <PageTitle title="Login" />
      <div className="auth__container">
        <h1 className="auth__title">Log in to {appName.long}</h1>
        <LoginForm className="auth__form" loading={loading} onSubmit={onSubmit} />
        <div className="auth__footer">
          <Link className="auth__link" to={routes.auth.forgotPassword}>
            Can&apos;t log in?
          </Link>
          <span className="auth__dot" />
          <Link className="auth__link" to={routes.auth.registration}>
            Sign up for an account
          </Link>
        </div>
      </div>
    </main>
  )
}

export default LoginPage
