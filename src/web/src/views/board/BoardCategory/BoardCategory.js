import { DotsHorizontalIcon } from '@heroicons/react/outline'
import PropTypes from 'prop-types'
import { useMemo } from 'react'

import {
  CategoryContainer,
  CategoryHeader,
  CategoryHeaderButton,
  CategoryHeaderIcon,
  CategoryHeaderTitle,
  CategoryWrapper,
  CategoryCardList,
} from '@/views/board/BoardCategory/BoardCategory.styles'
import { BoardCard } from '@/views/board/BoardCard/BoardCard'
import { BoardAddCard } from '@/views/board/BoardAddCard/BoardAddCard'

const getCards = () =>
  [...Array(Math.floor(Math.random() * 100)).keys()].map((i) => ({
    id: `card${i}`,
    name: `Task lorem ipsum ${1}`,
    position: i,
  }))

export const BoardCategory = ({ category, color }) => {
  const cards = useMemo(() => getCards(), [])
  const label = useMemo(() => (cards.length ? 'Add another card' : 'Add a card'), [cards])
  const position = useMemo(() => (cards && cards.length > 0 ? cards[cards.length - 1].position + 1 : 0), [cards])

  return (
    <CategoryContainer>
      <CategoryWrapper>
        <CategoryHeader>
          <CategoryHeaderTitle>{category.name}</CategoryHeaderTitle>
          <CategoryHeaderButton>
            <CategoryHeaderIcon as={DotsHorizontalIcon} />
          </CategoryHeaderButton>
        </CategoryHeader>
        {cards.length > 0 && (
          <CategoryCardList>
            {cards.map((card) => (
              <BoardCard key={card.id} card={card} />
            ))}
          </CategoryCardList>
        )}
        <BoardAddCard categoryId={category.id} label={label} position={position} color={color} />
      </CategoryWrapper>
    </CategoryContainer>
  )
}

BoardCategory.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  color: PropTypes.string.isRequired,
}
