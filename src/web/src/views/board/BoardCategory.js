import { useMemo } from 'react'
import { DotsHorizontalIcon } from '@heroicons/react/outline'
import { Droppable } from 'react-beautiful-dnd'
import PropTypes from 'prop-types'

import { BoardCard } from './BoardCard'
import { BoardAddCard } from './BoardAddCard'

export const BoardCategory = ({ category, cards, color, className }) => {
  const label = useMemo(() => (cards.length ? 'Add another card' : 'Add a card'), [cards])
  const position = useMemo(() => (cards && cards.length > 0 ? cards[cards.length - 1].position + 1 : 0), [cards])

  return (
    <div className={`${className} category`}>
      <div className="category__wrapper">
        <div className="category__container">
          <div className="category__header">
            <h2 className="category__name">{category.name}</h2>
            <button className="category__menu-btn">
              <DotsHorizontalIcon className="category__menu-icon" />
            </button>
          </div>
          <Droppable droppableId={category.id}>
            {(provided) => (
              <div className="category__body" ref={provided.innerRef} {...provided.droppableProps}>
                {cards.length > 0 && (
                  <div className="category__cards">
                    {cards.map((card, index) => (
                      <BoardCard key={card.id} card={card} index={index} />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </div>
            )}
          </Droppable>
          <div className="category__add-card">
            <BoardAddCard categoryId={category.id} label={label} position={position} color={color} />
          </div>
        </div>
      </div>
    </div>
  )
}

BoardCategory.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      position: PropTypes.number,
    }),
  ).isRequired,
  color: PropTypes.string.isRequired,
  className: PropTypes.string,
}

BoardCategory.defaultProps = {
  className: '',
}
