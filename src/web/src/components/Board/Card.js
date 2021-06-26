import { memo, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useDrag, useDrop } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'

import { DND } from '../../constants/dnd'

export const Card = memo(({ index, card, moveCard, dropCard, className }) => {
  const ref = useRef(null)

  const [, drop] = useDrop(
    {
      accept: DND.CARD,
      hover(item, monitor) {
        if (!ref.current) {
          return
        }

        if (item.id === card.id) {
          return
        }

        const dragIndex = item.index
        const hoverIndex = index

        // Determine rectangle on screen
        const hoverBoundingRect = ref.current?.getBoundingClientRect()

        // Get vertical middle
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

        // Determine mouse position
        const clientOffset = monitor.getClientOffset()

        // Get pixels to the top
        const hoverClientY = clientOffset.y - hoverBoundingRect.top

        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%

        // Dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return
        }

        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return
        }

        moveCard(item.card, card)
      },
      drop(item) {
        if (item.id === card.id) {
          return
        }

        dropCard(item.index, item.card, index, card)
      },
    },
    [card, index, moveCard, dropCard],
  )

  const [{ container, item }, drag, preview] = useDrag(
    {
      type: DND.CARD,
      item: () => ({ card, index }),
      collect: (monitor) => ({
        container: monitor.isDragging() ? 'rounded bg-black-20 cursor-move' : 'cursor-pointer',
        item: monitor.isDragging() ? 'opacity-0' : '',
      }),
    },
    [card, index],
  )

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [preview])

  drag(drop(ref))

  return (
    <div ref={ref} className={`${container} ${className}`}>
      <div
        className={`p-2 shadow-sm border-b border-gray-400 text-black-100 text-sm leading-4 rounded bg-gray-100 transition hover:bg-gray-50 ${item}`}
      >
        {card.name}
      </div>
    </div>
  )
})

Card.propTypes = {
  index: PropTypes.number.isRequired,
  card: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  moveCard: PropTypes.func,
  dropCard: PropTypes.func,
  className: PropTypes.string,
}

Card.defaultProps = {
  className: '',
  moveCard: () => {},
  dropCard: () => {},
}
