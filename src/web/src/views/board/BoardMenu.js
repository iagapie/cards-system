import { AnnotationIcon, BookmarkAltIcon, CogIcon, TagIcon, XIcon } from '@heroicons/react/outline'
import PropTypes from 'prop-types'

export const BoardMenu = ({ isOpen, onClose, color }) => {
  const data = [
    { name: 'About this board', icon: <AnnotationIcon className="board-menu__icon" /> },
    { name: 'Change background', icon: <span className="board-menu__bg" data-theme={color} /> },
    { name: 'Settings', icon: <CogIcon className="board-menu__icon" /> },
    { name: 'Labels', icon: <TagIcon className="board-menu__icon" /> },
  ]

  return (
    <div className={isOpen ? 'board-menu board-menu_open' : 'board-menu'}>
      <div className="board-menu__header">
        Menu
        <button
          className={isOpen ? 'board-menu__close-btn board-menu__close-btn_open' : 'board-menu__close-btn'}
          onClick={onClose}
        >
          <XIcon className="board-menu__icon" />
        </button>
      </div>
      <div className="board-menu__body">
        <div className="board-menu__group">
          {data.map(({ name, icon }, index) => (
            <button key={index} className="board-menu__item">
              {icon}
              {name}
            </button>
          ))}
        </div>
        <div className="board-menu__group bm-activity">
          <div className="bm-activity__header">
            <BookmarkAltIcon className="bm-activity__icon" />
            <span className="bm-activity__title">Activity</span>
          </div>
        </div>
      </div>
    </div>
  )
}

BoardMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
}
