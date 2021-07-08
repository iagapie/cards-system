import { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { RadioGroup } from '@headlessui/react'
import PropTypes from 'prop-types'

import { BaseModal } from '../BaseModal'

import { AddBoardForm } from './AddBoardForm'

export const AddBoardModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()
  const loading = false
  const error = ''

  const onSubmit = (data) => {
    // console.log(data)
  }

  return (
    <BaseModal title="Create board" isOpen={isOpen} onClose={onClose} overlayClose={false}>
      <div className="add-board">
        {error && <div className="add-board__error">{error}</div>}
        <AddBoardForm onSubmit={onSubmit} loading={loading} />
      </div>
    </BaseModal>
  )
}

AddBoardModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}
