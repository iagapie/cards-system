import PropTypes from 'prop-types'

import { CardContainer, CardName } from '@/views/board/BoardCard/BoardCard.styles'

export const BoardCard = ({ card }) => (
  <CardContainer>
    <CardName>{card.name}</CardName>
  </CardContainer>
)

BoardCard.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
}
