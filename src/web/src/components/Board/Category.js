import { memo, useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DotsHorizontalIcon } from '@heroicons/react/outline'
import PropTypes from 'prop-types'
import { useDrag, useDrop } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'

import { getBoardCardsByCategory } from '../../redux/selectors'
import { DND } from '../../constants/dnd'
import { AddCard } from './AddCard'
import { Card } from './Card'
import * as boardSlice from '../../redux/slices/board'

export const Category = memo(({ index, category, moveCategory, className }) => {
  const boardCardsByCategory = useMemo(getBoardCardsByCategory, [])
  const cards = useSelector((state) => boardCardsByCategory(state, category.id))
  const label = useMemo(() => (cards.length ? 'Add another card' : 'Add a card'), [cards])
  const position = useMemo(() => (cards && cards.length > 0 ? cards[cards.length - 1].position + 1 : 0), [cards])

  const dispatch = useDispatch()

  const [, drop] = useDrop(
    {
      accept: DND.CATEGORY,
      hover(item) {
        const dragIndex = item.index
        const hoverIndex = index

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
          return
        }

        moveCategory(dragIndex, hoverIndex)

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        // eslint-disable-next-line no-param-reassign
        item.index = hoverIndex
        // eslint-disable-next-line no-param-reassign
        item.category = category
      },
      drop(item) {
        console.log(item)
      },
    },
    [category, index, moveCategory],
  )

  const [{ container, item }, drag, preview] = useDrag(
    {
      type: DND.CATEGORY,
      item: () => ({ category, index }),
      collect: (monitor) => ({
        container: monitor.isDragging() ? 'rounded bg-black-20' : '',
        item: monitor.isDragging() ? 'opacity-0' : '',
      }),
    },
    [category, index],
  )

  const moveCard = useCallback(
    (dragCard, hoverCard) => {
      dispatch(
        boardSlice.moveCards({
          dragCard,
          hoverCard,
        }),
      )
    },
    [dispatch],
  )

  const dropCard = useCallback((dragIndex, dragCard, hoverIndex, hoverCard) => {
    //console.log(category.id, dragIndex, dragCard, hoverIndex, hoverCard)
  }, [])

  const [, dropCardRef] = useDrop(
    () => ({
      accept: DND.CARD,
      hover({ card }) {
        if (card.category_id === category.id) {
          return
        }
        dispatch(boardSlice.moveCard({ cardId: card.id, categoryId: category.id, position: 0 }))
      },
      drop({ card }) {
        if (card.category_id === category.id) {
          return
        }
        //console.log(card, category.id)
      },
    }),
    [dispatch, category],
  )

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [preview])

  return (
    <div
      ref={(node) => drag(drop(dropCardRef(node)))}
      className={`flex flex-col justify-start overflow-hidden cursor-move ${container} ${className}`}
    >
      <div className={`flex flex-col space-y-2 w-64 p-2 bg-gray-200 rounded shadow-sm overflow-hidden ${item}`}>
        <div className="pl-2 flex items-center">
          <h2 className="flex-grow text-black-100 text-sm font-bold leading-4 truncate overflow-hidden">
            {category.name}
          </h2>
          <button className="flex items-center justify-center p-2 text-sm leading-4 text-blue-gray-500 rounded transition hover:bg-gray-300 hover:text-black-100 focus:outline-none">
            <DotsHorizontalIcon className="w-4 h-4" />
          </button>
        </div>
        {cards.length > 0 && (
          <div className="grid grid-flow-row gap-2 overflow-y-auto z-0">
            {cards.map((card, cardIndex) => (
              <Card key={card.id} index={cardIndex} card={card} moveCard={moveCard} dropCard={dropCard} />
            ))}
          </div>
        )}
        <AddCard categoryId={category.id} label={label} position={position} />
      </div>
    </div>
  )
})

Category.propTypes = {
  index: PropTypes.number.isRequired,
  category: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  moveCategory: PropTypes.func,
  className: PropTypes.string,
}

Category.defaultProps = {
  className: '',
  moveCategory: () => {},
}
