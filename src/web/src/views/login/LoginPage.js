import { Link } from 'react-router-dom'

import { appName, routes } from '@/utils/constants'
import { PageTitle } from '@/components/helmet/PageTitle'

import { LoginForm } from './LoginForm'

const LoginPage = () => {
  const loading = false

  const onSubmit = (data) => {
    console.log(data)
  }

  return (
    <main className="auth">
      <PageTitle title="Login" />
      <div className="auth__container">
        <div className="auth__error">Login error</div>
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
