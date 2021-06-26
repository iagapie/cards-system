import { Fragment, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { Dialog, Transition, RadioGroup } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'

import { getCreateBoard } from '../../redux/selectors'
import { clearBoardError, createBoard, setIsOpen } from '../../redux/slices/createBoard'
import { COLORS } from '../../constants/colors'

export const CreateBoardDialog = () => {
  const dispatch = useDispatch()
  const { loading, isOpen, error } = useSelector(getCreateBoard)

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
      dispatch(clearBoardError())
    },
    [dispatch, reset],
  )

  const disabled = useMemo(() => loading || !isDirty || !isValid, [loading, isDirty, isValid])

  const closeDialog = (event) => {
    if (event) {
      event.preventDefault()
    }
    dispatch(setIsOpen(false))
  }

  const onSubmit = (data) => {
    dispatch(createBoard(data))
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={closeDialog}>
        <div className="min-h-screen px-3 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-80" />
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
            <div className="inline-block w-full max-w-lg p-4 my-3 md:my-10 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded">
              <form onSubmit={handleSubmit(onSubmit)} noValidate="noValidate">
                <Dialog.Title
                  as="h3"
                  className="flex items-center justify-between text-lg font-medium leading-6 text-blue-gray-700"
                >
                  Create board
                  <button type="button" onClick={closeDialog} className="focus:outline-none hover:text-blue-gray-600">
                    <XIcon className="w-6 h-6" />
                  </button>
                </Dialog.Title>
                <div className="mt-6">
                  {error && <div className="text-red-500 mb-4">{error}</div>}
                  <div className="grid grid-flow-row md:grid-cols-12 gap-4">
                    <div className="md:row-span-2 md:col-span-4 flex flex-col">
                      <Controller
                        name="color"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <RadioGroup value={field.value} onChange={field.onChange} onBlur={field.onBlur}>
                            <div className="grid grid-flow-row grid-cols-12 gap-2">
                              {Object.keys(COLORS.BOARD.BG).map((key) => (
                                <RadioGroup.Option
                                  key={key}
                                  value={key}
                                  className={({ checked }) =>
                                    `${
                                      checked ? 'ring ring-offset-2 ring-offset-blue-gray-400 ring-transparent' : ''
                                    } ${
                                      COLORS.BOARD.BG[key]
                                    } col-span-2 md:col-span-4 text-blue-gray-700 border shadow-xl cursor-pointer flex items-center justify-between focus:outline-none`
                                  }
                                >
                                  &nbsp;
                                </RadioGroup.Option>
                              ))}
                            </div>
                          </RadioGroup>
                        )}
                      />
                    </div>
                    <div className="md:col-span-8 flex flex-col">
                      <input
                        type="text"
                        className="text-sm text-gray-700 placeholder-gray-400 rounded border-2 border-gray-300 w-full p-3 focus:outline-none focus:border-sky-400"
                        placeholder="Add board title"
                        {...register('name', {
                          required: 'required',
                          max: 150,
                        })}
                      />
                      {errors.name && (
                        <strong className="text-red-500 text-sm block pt-1">{errors.name.message}</strong>
                      )}
                    </div>
                    <div className="md:col-span-8 flex flex-col">
                      <textarea
                        className="text-sm text-gray-700 placeholder-gray-400 rounded border-2 border-gray-300 p-3 focus:outline-none focus:border-sky-400"
                        placeholder="Description"
                        {...register('description', {
                          maxLength: 1000,
                        })}
                      />
                      {errors.description && (
                        <strong className="text-red-500 text-sm block pt-1">{errors.description.message}</strong>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-sky-900 bg-sky-100 border border-transparent rounded transition duration-150 ease-in hover:bg-sky-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-default"
                    disabled={disabled}
                  >
                    Create board
                  </button>
                </div>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
