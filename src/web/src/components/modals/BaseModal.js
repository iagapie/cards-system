import { Fragment, useCallback } from 'react'
import { Transition, Dialog } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import PropTypes from 'prop-types'

export const BaseModal = ({ children, title, isOpen, onClose, overlayClose }) => {
  const onOverlay = useCallback(() => {
    if (overlayClose) {
      onClose()
    }
  }, [onClose, overlayClose])

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog onClose={onOverlay} className="modal">
        <div className="modal__wrapper">
          <Transition.Child
            as={Fragment}
            enter="transition ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="modal__overlay" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="modal__body">
              <Dialog.Title className="modal__title">
                {title}
                <button className="modal__close" onClick={onClose}>
                  <XIcon className="modal__x-icon" />
                </button>
              </Dialog.Title>
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

BaseModal.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  overlayClose: PropTypes.bool,
}

BaseModal.defaultProps = {
  overlayClose: true,
}
