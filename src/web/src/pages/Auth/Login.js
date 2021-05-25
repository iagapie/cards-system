import { useForm } from 'react-hook-form'

import { DocumentTitle } from '../../components/DocumentTitle'
import { VALIDATION } from '../../constants/validation'

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  const onSubmit = (data) => {
    console.log(data)
    reset()
  }

  return (
    <div>
      <DocumentTitle title="Login" />
      <h1>Login</h1>
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
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login
