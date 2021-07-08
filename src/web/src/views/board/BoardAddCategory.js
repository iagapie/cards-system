import { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { useDetectClickOutside } from 'react-detect-click-outside'
import { PlusIcon, XIcon } from '@heroicons/react/outline'
import PropTypes from 'prop-types'

export const BoardAddCategory = ({ boardId, position, color }) => {
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
    console.log(data)
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      ref={ref}
      className={isOpen ? 'add-category add-category_open' : 'add-category'}
    >
      <button
        onClick={open}
        className={isOpen ? 'add-category__open-btn add-category__open-btn_open' : 'add-category__open-btn'}
      >
        <PlusIcon className="add-category__plus-icon" />
        Add another list
      </button>
      <input
        type="text"
        autoComplete="off"
        data-theme={color}
        className={isOpen ? 'add-category__input add-category__input_open' : 'add-category__input'}
        placeholder="Enter list title..."
        {...register('name', {
          required: 'required',
          maxLength: 150,
        })}
      />
      <div className={isOpen ? 'add-category__footer add-category__footer_open' : 'add-category__footer'}>
        <button type="submit" className="add-category__add-btn" disabled={disabled} data-theme={color}>
          {loading && <span className="rotate-loading add-category__loading" />}
          Add list
        </button>
        <button className="add-category__close-btn" onClick={close}>
          <XIcon className="add-category__x-icon" />
        </button>
      </div>
    </form>
  )
}

BoardAddCategory.propTypes = {
  boardId: PropTypes.string.isRequired,
  position: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
}
