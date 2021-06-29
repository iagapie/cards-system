import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import PropTypes from 'prop-types'

import {
  Error,
  Title,
  Wrapper,
  Form,
  FormRow,
  Input,
  InputError,
  Btn,
  Toolbar,
  RouterLink,
  DivideDot,
} from '@/views/login/LoginForm/LoginForm.styles'
import { appName, routes, validation } from '@/utils/constants'
import { Load } from '@/components/buttons/Button/Button.styles'

export const LoginForm = ({ loading, error, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm({ mode: 'onChange' })

  const disabled = useMemo(() => loading || !isDirty || !isValid, [loading, isDirty, isValid])

  return (
    <Wrapper>
      {error && <Error>{error}</Error>}
      <Title>Log in to {appName.long}</Title>
      <Form onSubmit={handleSubmit(onSubmit)} noValidation="noValidation">
        <FormRow>
          <Input
            type="email"
            placeholder="Enter email"
            {...register('email', {
              required: 'required',
              pattern: {
                value: validation.email,
                message: 'email is not valid.',
              },
            })}
          />
          {errors.email && <InputError>{errors.email.message}</InputError>}
        </FormRow>
        <FormRow>
          <Input
            type="password"
            placeholder="Enter password"
            {...register('password', {
              required: 'required',
              pattern: {
                value: validation.password,
                message: 'password is not valid.',
              },
            })}
          />
          {errors.password && <InputError>{errors.password.message}</InputError>}
        </FormRow>
        <FormRow>
          <Btn type="submit" disabled={disabled}>
            {loading && <Load />}
            Log in
          </Btn>
        </FormRow>
        <Toolbar>
          <RouterLink to={routes.auth.forgotPassword}>Can&apos;t log in?</RouterLink>
          <DivideDot />
          <RouterLink to={routes.auth.registration}>Sign up for an account</RouterLink>
        </Toolbar>
      </Form>
    </Wrapper>
  )
}

LoginForm.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
}

LoginForm.defaultProps = {
  error: '',
}
