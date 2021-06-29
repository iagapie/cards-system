import { useDispatch } from 'react-redux'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDetectClickOutside } from 'react-detect-click-outside'
import { PlusIcon, XIcon } from '@heroicons/react/outline'
import PropTypes from 'prop-types'

import {
  CardContainer,
  CardTextarea,
  CardOpenBtn,
  CardToolbar,
  CardAddBtn,
  CardCloseBtn,
} from '@/views/board/BoardAddCard/BoardAddCard.styles'
import { Load } from '@/components/buttons/Button/Button.styles'

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
    <CardContainer ref={ref} onSubmit={handleSubmit(onSubmit)} isOpen={isOpen}>
      <CardOpenBtn onClick={open} isOpen={isOpen}>
        <PlusIcon />
        {label}
      </CardOpenBtn>
      <CardTextarea
        type="text"
        autoComplete="off"
        isOpen={isOpen}
        placeholder="Enter a title for this card..."
        {...register('name', {
          required: 'required',
          maxLength: 150,
        })}
      />
      <CardToolbar isOpen={isOpen}>
        <CardAddBtn type="submit" disabled={disabled} color={color}>
          {loading && <Load />}
          Add card
        </CardAddBtn>
        <CardCloseBtn onClick={close}>
          <XIcon />
        </CardCloseBtn>
      </CardToolbar>
    </CardContainer>
  )
}

BoardAddCard.propTypes = {
  label: PropTypes.string.isRequired,
  categoryId: PropTypes.string.isRequired,
  position: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
}
