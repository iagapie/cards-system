import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import { DocumentTitle } from '../components/DocumentTitle'
import { APP } from '../constants/app'
import { ROUTES } from '../constants/routes'
import { VALIDATION } from '../constants/validation'
import { getAuth } from '../selectors'
import { login } from '../slices/auth'

const Login = () => {
  const { isAuthenticated, loading, error } = useSelector(getAuth)

  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    reset,
  } = useForm({ mode: 'onChange' })

  useEffect(() => {
    if (!loading && isAuthenticated) {
      reset()
    }
  }, [isAuthenticated, loading, reset])

  const onSubmit = (data) => {
    dispatch(login(data))
  }

  return (
    <main className="min-h-screen flex flex-col items-center sm:justify-center bg-white sm:bg-gray-100">
      <DocumentTitle title="Login" />
      <div className="flex flex-col w-full max-w-sm px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:bg-white sm:shadow sm:rounded">
        {error && <div className="text-red-500 text-center mb-6">{error}</div>}
        <h1 className="font-semibold self-center text-lg text-blue-gray-600">Log in to {APP.NAME.LONG}</h1>
        <div className="mt-6">
          <form onSubmit={handleSubmit(onSubmit)} noValidate="noValidate">
            <div className="flex flex-col mb-6">
              <input
                type="email"
                className="text-sm text-gray-700 placeholder-gray-400 rounded border-2 border-gray-300 w-full p-3 focus:outline-none focus:border-sky-400"
                placeholder="Enter email"
                {...register('email', {
                  required: 'required',
                  pattern: {
                    value: VALIDATION.EMAIL,
                    message: 'email is not valid.',
                  },
                })}
              />
              {errors.email && <strong className="text-red-500 text-sm block pt-1">{errors.email.message}</strong>}
            </div>
            <div className="flex flex-col mb-6">
              <input
                type="password"
                className="text-sm text-gray-700 placeholder-gray-400 rounded border-2 border-gray-300 w-full p-3 focus:outline-none focus:border-sky-400"
                placeholder="Enter password"
                {...register('password', {
                  required: 'required',
                  pattern: {
                    value: VALIDATION.PASSWORD,
                    message: 'password is not valid.',
                  },
                })}
              />
              {errors.password && (
                <strong className="text-red-500 text-sm block pt-1">{errors.password.message}</strong>
              )}
            </div>
            <div className="flex w-full mb-8">
              <button
                type="submit"
                className="flex items-center justify-center focus:outline-none text-white text-base font-semibold bg-sky-600 hover:bg-sky-700 rounded py-2 w-full transition duration-150 ease-in disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-default"
                disabled={loading || !isDirty || !isValid}
              >
                Log in
              </button>
            </div>
            <div className="w-full h-px mb-4 bg-gray-300">&nbsp;</div>
            <div className="flex w-full items-center justify-center">
              <Link to={ROUTES.AUTH.FORGOT_PASSWORD} className="text-sm text-sky-600 hover:underline">
                Can't log in?
              </Link>
              <span className="text-gray-700 font-bold px-2">&#8226;</span>
              <Link to={ROUTES.AUTH.REGISTRATION} className="text-sm text-sky-600 hover:underline">
                Sign up for an account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

export default Login
