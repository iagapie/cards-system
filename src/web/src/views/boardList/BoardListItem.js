import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { routes } from '@/utils/constants'

export const BoardListItem = ({ board }) => (
  <Link to={routes.board.one(board.id)} className="boards-page__item" data-theme={board.color}>
    <span className="boards-page__item-name">{board.name}</span>
  </Link>
)

BoardListItem.propTypes = {
  board: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    color: PropTypes.string,
  }).isRequired,
}
