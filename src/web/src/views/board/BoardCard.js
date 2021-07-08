import PropTypes from 'prop-types'

export const BoardCard = ({ card }) => (
  <div className="card">
    <div className="card__name">{card.name}</div>
  </div>
)

BoardCard.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
}
