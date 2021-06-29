import { Fragment, useState, useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { Transition, RadioGroup } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'

import {
  Modal,
  ModalBody,
  ModalButton,
  ModalClose,
  ModalCloseIcon,
  ModalError,
  ModalForm,
  ModalOverlay,
  ModalTitle,
  ModalWrapper,
  ModalFormRow,
  ModalFormRowColors,
  ModalFormInput,
  ModalFormError,
  ColorList,
  ColorItem,
} from '@/components/modals/ModalCreateBoard/ModalCreateBoard.styles'
import { Load } from '@/components/buttons/Button/Button.styles'
import { Theme } from '@/theme/Theme'

export const ModalCreateBoard = () => {
  const dispatch = useDispatch()
  const loading = false
  const error = ''
  const [isOpen, setIsOpen] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm({ mode: 'onChange', defaultValues: { color: 'sky' } })

  useEffect(
    () => () => {
      reset()
    },
    [dispatch, reset],
  )

  const disabled = useMemo(() => loading || !isDirty || !isValid, [loading, isDirty, isValid])

  const closeModal = (event) => {
    if (event) {
      event.preventDefault()
    }
    setIsOpen(false)
  }

  const onSubmit = (data) => {
    // console.log(data)
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Modal onClose={closeModal}>
        <ModalWrapper>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ModalOverlay />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <ModalBody>
              <ModalForm onSubmit={handleSubmit(onSubmit)} noValidate="noValidate">
                <ModalTitle>
                  Create board
                  <ModalClose onClick={closeModal}>
                    <ModalCloseIcon as={XIcon} />
                  </ModalClose>
                </ModalTitle>
                {error && <ModalError>{error}</ModalError>}
                <ModalFormRowColors>
                  <Controller
                    name="color"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <RadioGroup value={field.value} onChange={field.onChange} onBlur={field.onBlur}>
                        <ColorList>
                          {Object.keys(Theme.bg).map((key) => (
                            <RadioGroup.Option as={Fragment} key={key} value={key}>
                              {({ checked }) => (
                                <ColorItem bg={Theme.bg[key]} checked={checked}>
                                  &nbsp;
                                </ColorItem>
                              )}
                            </RadioGroup.Option>
                          ))}
                        </ColorList>
                      </RadioGroup>
                    )}
                  />
                </ModalFormRowColors>
                <ModalFormRow>
                  <ModalFormInput
                    type="text"
                    placeholder="Add board title"
                    {...register('name', {
                      required: 'required',
                      max: 150,
                    })}
                  />
                  {errors.name && <ModalFormError>{errors.name.message}</ModalFormError>}
                </ModalFormRow>
                <ModalFormRow>
                  <ModalFormInput
                    as="textarea"
                    placeholder="Description"
                    {...register('description', {
                      maxLength: 1000,
                    })}
                  />
                  {errors.description && <ModalFormError>{errors.description.message}</ModalFormError>}
                </ModalFormRow>
                <ModalButton type="submit" disabled={disabled}>
                  {loading && <Load />}
                  Create board
                </ModalButton>
              </ModalForm>
            </ModalBody>
          </Transition.Child>
        </ModalWrapper>
      </Modal>
    </Transition>
  )
}
