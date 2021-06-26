import { useMemo } from 'react'
import { DotsHorizontalIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/outline'
import PropTypes from 'prop-types'
import { Gravatar } from '../Gravatar'
import { useBoardState } from '../../contexts/BoardStateContext'

export const Header = ({ board, members }) => {
  const isPrivate = useMemo(() => Object.keys(members).length <= 1, [members])
  const { openingMenu, setOpeningMenu } = useBoardState()

  const openMenu = () => setOpeningMenu(true)

  return (
    <div className="flex justify-between space-x-2">
      <div className="flex space-x-2 overflow-hidden">
        <div className="btn-white-30 font-bold overflow-hidden">
          <button className="truncate focus:outline-none">{board.name}</button>
        </div>
        <div className="hidden md:block w-px bg-white-20 my-2.5" />
        <div className="btn-white-30">
          {isPrivate ? (
            <>
              <LockClosedIcon className="w-5 h-5" />
              <span className="hidden md:inline-block">Private</span>
            </>
          ) : (
            <>
              <LockOpenIcon className="w-5 h-5" />
              <span className="hidden md:inline-block">Shared</span>
            </>
          )}
        </div>
        <div className="hidden md:block w-px bg-white-20 my-2.5" />
        <div className="hidden md:flex flex-row items-center justify-start -space-x-2">
          {board.members.map((m, i) => (
            <button
              key={i}
              className="ring-2 ring-transparent rounded-full hidden md:flex items-center justify-center w-7 h-7 overflow-hidden transition hover:ring-gray-100 focus:outline-none"
            >
              <Gravatar email={members[m.user_id].email} alt={members[m.user_id].name} />
            </button>
          ))}
        </div>
        <button className="md:btn-white-30 btn-text-base">
          <span>Invite</span>
        </button>
      </div>
      <div className="flex space-x-2">
        {!openingMenu && (
          <button className="btn-white-30" onClick={openMenu}>
            <DotsHorizontalIcon className="w-5 h-5" />
            <span className="hidden md:inline-block">Show menu</span>
          </button>
        )}
      </div>
    </div>
  )
}

Header.propTypes = {
  board: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  members: PropTypes.objectOf(PropTypes.object).isRequired,
}
