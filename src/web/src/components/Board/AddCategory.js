import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { PlusIcon, XIcon } from '@heroicons/react/outline'
import { useDetectClickOutside } from 'react-detect-click-outside'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { getCreateCategory } from '../../redux/selectors'
import { createCategory } from '../../redux/slices/createCategory'

export const AddCategory = ({ boardId, position }) => {
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
        <button onClick={open} className="board-add-category__add-btn">
          <PlusIcon className="w-4 h-4" />
          <span className="pl-2">Add another list</span>
        </button>
        <input
          type="text"
          className="board-add-category__input"
          placeholder="Enter list title..."
          {...register('name', {
            required: 'required',
            maxLength: 150,
          })}
        />
        <div className="board-add-category__btn-bar">
          <button
            type="submit"
            disabled={disabled}
            className="px-3 py-1.5 text-sm text-white rounded bg-sky-600 hover:bg-sky-700 focus:outline-none disabled:bg-gray-400 disabled:cursor-default"
          >
            Add list
          </button>
          <button onClick={close} className="focus:outline-none text-gray-500 hover:text-black-100">
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
}
