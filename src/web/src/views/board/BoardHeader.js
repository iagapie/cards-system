import { useMemo } from 'react'
import { DotsHorizontalIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/outline'
import PropTypes from 'prop-types'

import { Gravatar } from '@/components/gravatar/Gravatar'

export const BoardHeader = ({ board, members, isOpen, onOpen }) => {
  const isPrivate = useMemo(() => Object.keys(members).length <= 1, [members])

  return (
    <div className="header board-page__header">
      <div className="header__group">
        <button className="header-btn">
          <span className="header-btn__text header-btn__text_bold">{board.name}</span>
        </button>
        <div className="header__divide" />
        <button className="header-btn">
          {isPrivate ? (
            <>
              <LockClosedIcon className="header-btn__icon" />
              <span className="header-btn__text header-btn__text_md">Private</span>
            </>
          ) : (
            <>
              <LockOpenIcon className="header-btn__icon" />
              <span className="header-btn__text header-btn__text_md">Shared</span>
            </>
          )}
        </button>
        <div className="header__divide" />
        <div className="header__user-group">
          {board.members.map((m, i) => (
            <button key={i} className="header-btn header-btn_circle">
              <Gravatar className="header-btn__avatar" email={members[m.user_id].email} alt={members[m.user_id].name} />
            </button>
          ))}
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
  board: PropTypes.shape({
    name: PropTypes.string.isRequired,
    members: PropTypes.arrayOf(
      PropTypes.shape({
        user_id: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
  members: PropTypes.objectOf(PropTypes.object).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onOpen: PropTypes.func.isRequired,
}
