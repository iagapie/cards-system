import { useDispatch } from 'react-redux'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDetectClickOutside } from 'react-detect-click-outside'
import PropTypes from 'prop-types'
import { PlusIcon, XIcon } from '@heroicons/react/outline'

import {
  CategoryContainer,
  CategoryInput,
  CategoryOpenButton,
  CategoryToolbar,
  CategoryAddBtn,
  CategoryCloseBtn,
} from '@/views/board/BoardAddCategory/BoardAddCategory.styles'
import { Load } from '@/components/buttons/Button/Button.styles'

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
    <CategoryContainer isOpen={isOpen}>
      <form onSubmit={handleSubmit(onSubmit)} ref={ref}>
        <CategoryOpenButton isOpen={isOpen} onClick={open}>
          <PlusIcon />
          Add another list
        </CategoryOpenButton>
        <CategoryInput
          type="text"
          autoComplete="off"
          color={color}
          isOpen={isOpen}
          placeholder="Enter list title..."
          {...register('name', {
            required: 'required',
            maxLength: 150,
          })}
        />
        <CategoryToolbar isOpen={isOpen}>
          <CategoryAddBtn type="submit" disabled={disabled} color={color}>
            {loading && <Load />}
            Add list
          </CategoryAddBtn>
          <CategoryCloseBtn onClick={close}>
            <XIcon />
          </CategoryCloseBtn>
        </CategoryToolbar>
      </form>
    </CategoryContainer>
  )
}

BoardAddCategory.propTypes = {
  boardId: PropTypes.string.isRequired,
  position: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
}
