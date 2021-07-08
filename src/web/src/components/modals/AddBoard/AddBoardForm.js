import { Fragment, useEffect, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { RadioGroup } from '@headlessui/react'
import PropTypes from 'prop-types'

import { themes } from '@/utils/constants'

export const AddBoardForm = ({ loading, onSubmit }) => {
  const {
    register,
    handleSubmit,
    setFocus,
    control,
    formState: { errors, isDirty, isValid },
  } = useForm({ mode: 'onChange', defaultValues: { color: 'sky' } })

  const disabled = useMemo(() => loading || !isDirty || !isValid, [loading, isDirty, isValid])

  useEffect(() => {
    setFocus('name')
  }, [setFocus])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <div className="form__row">
        <Controller
          name="color"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <RadioGroup value={field.value} onChange={field.onChange} onBlur={field.onBlur}>
              <div className="add-board__themes">
                {themes.map((theme) => (
                  <RadioGroup.Option as={Fragment} key={theme} value={theme}>
                    {({ checked }) => (
                      <div
                        className={checked ? 'add-board__theme add-board__theme_active' : 'add-board__theme'}
                        data-theme={theme}
                      >
                        &nbsp;
                      </div>
                    )}
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>
          )}
        />
      </div>
      <div className="form__row">
        <input
          type="text"
          placeholder="Add board title"
          className={errors.name ? 'form__input form__input_error' : 'form__input'}
          {...register('name', {
            required: 'required',
            maxLength: 150,
          })}
        />
        {errors.name && <strong className="form__error">{errors.name.message}</strong>}
      </div>
      <div className="form__row">
        <textarea
          placeholder="Description"
          className={errors.name ? 'form__input form__input_error' : 'form__input'}
          {...register('description', {
            maxLength: 1000,
          })}
        />
        {errors.description && <strong className="form__error">{errors.description.message}</strong>}
      </div>
      <div className="form__row">
        <button type="submit" className="form__btn" disabled={disabled}>
          {loading && <span className="rotate-loading form__loading" />}
          Create board
        </button>
      </div>
    </form>
  )
}

AddBoardForm.propTypes = {
  loading: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
}
