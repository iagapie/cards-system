import PropTypes from 'prop-types'
import { DotsHorizontalIcon, LockClosedIcon } from '@heroicons/react/outline'

import { Gravatar } from '@/components/gravatar/Gravatar'

export const BoardHeader = ({ isOpen, onOpen }) => {
  return (
    <div className="header board-page__header">
      <div className="header__group">
        <button className="header-btn">
          <span className="header-btn__text">Board name</span>
        </button>
        <div className="header__divide" />
        <button className="header-btn">
          <LockClosedIcon className="header-btn__icon" />
          <span className="header-btn__text header-btn__text_md">Private</span>
        </button>
        <div className="header__divide" />
        <div className="header__user-group">
          <button className="header-btn header-btn_circle">
            <Gravatar className="header-btn__avatar" email="igoragapie@gmail.com" alt="iagapie" />
          </button>
          <button className="header-btn header-btn_circle">
            <Gravatar className="header-btn__avatar" email="iagapie@gmail.com" alt="iagapie" />
          </button>
        </div>
        <button className="header-btn header-btn_md">
          <span className="header-btn__text">Invite</span>
        </button>
      </div>
      <div className="header__group">
        {!isOpen && (
          <button className="header-btn" onClick={onOpen}>
            <DotsHorizontalIcon className="header-btn__icon" />
            <span className="header-btn__text header-btn__text_md">Show menu</span>
          </button>
        )}
      </div>
    </div>
  )
}

BoardHeader.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onOpen: PropTypes.func.isRequired,
}
