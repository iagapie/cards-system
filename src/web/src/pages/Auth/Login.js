import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import { DocumentTitle } from '../../components/DocumentTitle'
import { VALIDATION } from '../../constants/validation'
import { getAuth } from '../../selectors'
import { login } from '../../slices/auth'

const Login = () => {
  const { isAuthenticated, loading, error } = useSelector(getAuth)

  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      reset()
    }
  }, [isAuthenticated, loading, reset])

  const onSubmit = (data) => {
    dispatch(login(data))
  }

  return (
    <div>
      <DocumentTitle title="Login" />
      <h1>Log in</h1>
      {error && <div>{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} noValidate="noValidate">
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            {...register('email', {
              required: 'required',
              pattern: {
                value: VALIDATION.EMAIL,
                message: 'Email is not valid.',
              },
            })}
          />
          {errors.email && <span role="alert">{errors.email.message}</span>}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            {...register('password', {
              required: 'required',
              pattern: {
                value: VALIDATION.PASSWORD,
                message: 'Password is not valid.',
              },
            })}
          />
          {errors.password && (
            <span role="alert">{errors.password.message}</span>
          )}
        </div>
        <button type="submit" disabled={loading}>
          Log in
        </button>
        <div>
          <Link to="/signup">Sign up for an account</Link>
        </div>
      </form>
    </div>
  )
}

export default Login
