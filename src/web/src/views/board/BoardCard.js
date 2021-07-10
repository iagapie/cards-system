import { Draggable } from 'react-beautiful-dnd'
import PropTypes from 'prop-types'

export const BoardCard = ({ card, index }) => (
  <Draggable draggableId={card.id} index={index}>
    {(provided) => (
      <div className="card" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
        <div className="card__name">{card.name}</div>
      </div>
    )}
  </Draggable>
)

BoardCard.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
}
