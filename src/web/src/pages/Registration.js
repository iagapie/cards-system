import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import { getAuth } from '../selectors'
import { registration } from '../slices/auth'
import { DocumentTitle } from '../components/DocumentTitle'
import { VALIDATION } from '../constants/validation'
import { ROUTES } from '../constants/routes'

const Registration = () => {
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
    dispatch(registration(data))
  }

  return (
    <main className="min-h-screen flex flex-col items-center sm:justify-center bg-white sm:bg-gray-100">
      <DocumentTitle title="Registration" />
      <div className="flex flex-col w-full max-w-sm px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:bg-white sm:shadow sm:rounded">
        {error && <div className="text-red-500 text-center mb-6">{error}</div>}
        <h1 className="font-semibold self-center text-lg text-blue-gray-600">Sign up for your account</h1>
        <div className="mt-6">
          <form onSubmit={handleSubmit(onSubmit)} noValidate="noValidate">
            <div className="flex flex-col mb-6">
              <input
                type="text"
                className="text-sm text-gray-700 placeholder-gray-400 rounded border-2 border-gray-300 w-full p-3 focus:outline-none focus:border-sky-400"
                placeholder="Enter full name"
                {...register('name', {
                  required: 'required',
                  min: 2,
                  max: 100,
                })}
              />
              {errors.name && <strong className="text-red-500 text-sm block pt-1">{errors.name.message}</strong>}
            </div>
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
                Sign up
              </button>
            </div>
            <div className="w-full h-px mb-4 bg-gray-300">&nbsp;</div>
            <div className="flex w-full items-center justify-center">
              <Link to={ROUTES.AUTH.LOGIN} className="text-sm text-sky-600 hover:underline">
                Already have an account? Log in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

export default Registration
