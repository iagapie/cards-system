import { AnnotationIcon, BookmarkAltIcon, CogIcon, TagIcon, XIcon } from '@heroicons/react/outline'
import PropTypes from 'prop-types'

import {
  BoardMenuBody,
  BoardMenuContainer,
  BoardMenuItems,
  BoardMenuHeader,
  BoardMenuHeaderBtn,
  BoardMenuItem,
  BoardMenuItemBg,
  BoardMenuActivityHeader,
} from '@/views/board/BoardMenu/BoardMenu.styles'

export const BoardMenu = ({ isOpen, onClose, color }) => {
  const data = [
    { name: 'About this board', icon: <AnnotationIcon /> },
    { name: 'Change background', icon: <BoardMenuItemBg color={color} /> },
    { name: 'Settings', icon: <CogIcon /> },
    { name: 'Labels', icon: <TagIcon /> },
  ]

  return (
    <BoardMenuContainer isOpen={isOpen}>
      <BoardMenuHeader>
        Menu
        <BoardMenuHeaderBtn isOpen={isOpen} onClick={onClose}>
          <XIcon />
        </BoardMenuHeaderBtn>
      </BoardMenuHeader>
      <BoardMenuBody>
        <BoardMenuItems>
          {data.map(({ name, icon }, index) => (
            <BoardMenuItem key={index}>
              {icon}
              {name}
            </BoardMenuItem>
          ))}
        </BoardMenuItems>
        <BoardMenuItems>
          <BoardMenuActivityHeader>
            <BookmarkAltIcon />
            <span>Activity</span>
          </BoardMenuActivityHeader>
        </BoardMenuItems>
      </BoardMenuBody>
    </BoardMenuContainer>
  )
}

BoardMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
}
