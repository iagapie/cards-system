import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { PlusIcon, XIcon } from '@heroicons/react/outline'
import { useDetectClickOutside } from 'react-detect-click-outside'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'

import { getCreateCategory } from '../../redux/selectors'
import { createCategory } from '../../redux/slices/createCategory'
import { COLORS } from '../../constants/colors'

export const AddCategory = ({ boardId, position, color }) => {
  const { loading } = useSelector(getCreateCategory)
  const dispatch = useDispatch()
  const [containerClass, setContainerClass] = useState('')

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
    dispatch(createCategory({ boardId, position, name: data.name }))
  }

  const open = () => {
    setContainerClass('board-add-category_open')
    setFocus('name')
  }

  const close = () => {
    reset()
    setContainerClass('')
  }

  const ref = useDetectClickOutside({ onTriggered: close })

  return (
    <div className={`board-add-category ${containerClass}`} ref={ref}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <button onClick={open} className="board-add-category__btn-open">
          <PlusIcon className="w-4 h-4" />
          <span className="pl-2">Add another list</span>
        </button>
        <input
          type="text"
          autoComplete="off"
          className={`board-add-category__input ${COLORS.BOARD.INPUT_FOCUS[color]}`}
          placeholder="Enter list title..."
          {...register('name', {
            required: 'required',
            maxLength: 150,
          })}
        />
        <div className="board-add-category__toolbar">
          <button
            type="submit"
            disabled={disabled}
            className={`board-add-category__btn-add ${COLORS.BOARD.BTN[color]} ${COLORS.BOARD.BTN_HOVER[color]}`}
          >
            Add list
          </button>
          <button onClick={close} className="board-add-category__btn-close">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
      </form>
    </div>
  )
}

AddCategory.propTypes = {
  boardId: PropTypes.string.isRequired,
  position: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
}
