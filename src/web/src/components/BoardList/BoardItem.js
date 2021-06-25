import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { ROUTES } from '../../constants/routes'
import { COLORS } from '../../constants/colors'

export const BoardItem = ({ board, ...rest }) => {
  const color = board.color || 'sky'

  return (
    <Link to={ROUTES.BOARD.ONE(board.id)} className={`board-list-card__link ${COLORS.BOARD.BG[color]}`} {...rest}>
      <span className="board-list-card__fade" />
      <div className="board-list-card__name">{board.name}</div>
    </Link>
  )
}

BoardItem.propTypes = {
  board: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    color: PropTypes.string,
  }).isRequired,
}
