import PropTypes from 'prop-types'

import { BoardLink, BoardName } from '@/views/boards/BoardItem/BoardItem.styles'
import { routes } from '@/utils/constants'

export const BoardItem = ({ board }) => {
  return (
    <BoardLink to={routes.board.one(board.id)} bg={board.color}>
      <BoardName>{board.name}</BoardName>
    </BoardLink>
  )
}

BoardItem.propTypes = {
  board: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    color: PropTypes.string,
  }).isRequired,
}
