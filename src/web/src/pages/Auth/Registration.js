import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import { DocumentTitle } from '../../components/DocumentTitle'
import { VALIDATION } from '../../constants/validation'
import { getAuth } from '../../selectors'
import { registration } from '../../slices/auth'

const Registration = () => {
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
    dispatch(registration(data))
  }

  return (
    <div>
      <DocumentTitle title="Registration" />
      <h1>Sign up for your account</h1>
      {error && <div>{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} noValidate="noValidate">
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            {...register('name', {
              required: 'required',
            })}
          />
          {errors.name && <span role="alert">{errors.name.message}</span>}
        </div>
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
          Sign up
        </button>
        <div>
          <Link to="/login">Already have an account? Log In</Link>
        </div>
      </form>
    </div>
  )
}

export default Registration
