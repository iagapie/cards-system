import { useForm } from 'react-hook-form'
import { useMemo } from 'react'
import PropTypes from 'prop-types'

import {
  Wrapper,
  Error,
  Title,
  Form,
  FormRow,
  Input,
  InputError,
  Btn,
  Toolbar,
  RouterLink,
} from '@/views/registration/RegistrationForm/RegistrationForm.styles'
import { routes, validation } from '@/utils/constants'
import { Load } from '@/components/buttons/Button/Button.styles'

export const RegistrationForm = ({ loading, error, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm({ mode: 'onChange' })

  const disabled = useMemo(() => loading || !isDirty || !isValid, [loading, isDirty, isValid])

  return (
    <Wrapper>
      {error && <Error>{error}</Error>}
      <Title>Sign up for your account</Title>
      <Form onSubmit={handleSubmit(onSubmit)} noValidation="noValidation">
        <FormRow>
          <Input
            type="text"
            placeholder="Enter full name"
            {...register('name', {
              required: 'required',
              minLength: 2,
              maxLength: 100,
            })}
          />
          {errors.name && <InputError>{errors.name.message}</InputError>}
        </FormRow>
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
            Sign up
          </Btn>
        </FormRow>
        <Toolbar>
          <RouterLink to={routes.auth.login}>Already have an account? Log in</RouterLink>
        </Toolbar>
      </Form>
    </Wrapper>
  )
}

RegistrationForm.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
}

RegistrationForm.defaultProps = {
  error: '',
}
