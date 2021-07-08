import { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { useDetectClickOutside } from 'react-detect-click-outside'
import { PlusIcon, XIcon } from '@heroicons/react/outline'
import PropTypes from 'prop-types'

export const BoardAddCard = ({ label, categoryId, position, color }) => {
  const loading = false
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { isDirty, isValid },
    reset,
  } = useForm({ mode: 'onChange' })

  const disabled = useMemo(() => loading || !isDirty || !isValid, [loading, isDirty, isValid])

  const onSubmit = (data) => {
    reset()
  }

  const open = () => {
    setIsOpen(true)
    setFocus('name')
  }

  const close = () => {
    reset()
    setIsOpen(false)
  }

  const ref = useDetectClickOutside({ onTriggered: close })

  return (
    <form onSubmit={handleSubmit(onSubmit)} ref={ref} className={isOpen ? 'add-card add-card_open' : 'add-card'}>
      <button onClick={open} className={isOpen ? 'add-card__open-btn add-card__open-btn_open' : 'add-card__open-btn'}>
        <PlusIcon className="add-card__plus-icon" />
        {label}
      </button>
      <textarea
        className={isOpen ? 'add-card__input add-card__input_open' : 'add-card__input'}
        placeholder="Enter a title for this card..."
        {...register('name', {
          required: 'required',
          maxLength: 150,
        })}
      />
      <div className={isOpen ? 'add-card__footer add-card__footer_open' : 'add-card__footer'}>
        <button type="submit" className="add-card__add-btn" disabled={disabled} data-theme={color}>
          {loading && <span className="rotate-loading add-card__loading" />}
          Add card
        </button>
        <button className="add-card__close-btn" onClick={close}>
          <XIcon className="add-card__x-icon" />
        </button>
      </div>
    </form>
  )
}

BoardAddCard.propTypes = {
  label: PropTypes.string.isRequired,
  categoryId: PropTypes.string.isRequired,
  position: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
}
