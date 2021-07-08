import { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useParams } from 'react-router-dom'

import { PageTitle } from '@/components/helmet/PageTitle'
import { themes } from '@/utils/constants'

import { BoardHeader } from './BoardHeader'
import { BoardCategory } from './BoardCategory'
import { BoardAddCategory } from './BoardAddCategory'
import { BoardMenu } from './BoardMenu'

const randomBg = () => {
  const index = Math.floor(Math.random() * themes.length)

  return themes[index]
}

const getCats = () => [
  {
    id: 'id1',
    name: 'Waiting',
    position: 1,
  },
  {
    id: 'id2',
    name: 'In progress',
    position: 2,
  },
  {
    id: 'id3',
    name: 'Done',
    position: 3,
  },
  {
    id: 'id4',
    name: 'In review',
    position: 4,
  },
  {
    id: 'id5',
    name: 'Reviewed',
    position: 5,
  },
  {
    id: 'id6',
    name: 'In Testing',
    position: 6,
  },
  {
    id: 'id7',
    name: 'Closed',
    position: 7,
  },
  // {
  //   id: 'id8',
  //   name: 'Reviewed',
  //   position: 5,
  // },
  // {
  //   id: 'id9',
  //   name: 'In Testing',
  //   position: 6,
  // },
  // {
  //   id: 'id10',
  //   name: 'Closed',
  //   position: 7,
  // },
  // {
  //   id: 'id11',
  //   name: 'Closed',
  //   position: 7,
  // },
  // {
  //   id: 'id12',
  //   name: 'Closed',
  //   position: 7,
  // },
]

const BoardPage = () => {
  const { boardId } = useParams()
  const title = 'Board'

  const [isOpen, setIsOpen] = useState(false)
  const onOpen = () => setIsOpen(true)
  const onClose = () => setIsOpen(false)

  const color = useMemo(() => randomBg(), [])
  const categories = useMemo(() => getCats(), [])

  const canAddCategory = useMemo(() => categories.length < 50, [categories])
  const position = useMemo(
    () => (categories && categories.length > 0 ? categories[categories.length - 1].position + 1 : 0),
    [categories],
  )

  return (
    <main className="board-page">
      <Helmet htmlAttributes={{ 'data-theme': color }} />
      <PageTitle title={title} />
      <BoardHeader isOpen={isOpen} onOpen={onOpen} />
      <div className="board-page__wrapper">
        <div className="board-page__categories">
          {categories.map((category) => (
            <BoardCategory key={category.id} category={category} color={color} className="board-page__category" />
          ))}
          {canAddCategory && (
            <div className="board-page__category">
              <BoardAddCategory boardId={boardId} color={color} position={position} />
            </div>
          )}
        </div>
      </div>
      <BoardMenu color={color} onClose={onClose} isOpen={isOpen} />
    </main>
  )
}

export default BoardPage
