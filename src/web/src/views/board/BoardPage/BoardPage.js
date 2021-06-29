import { memo, useContext, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { ThemeContext } from 'styled-components'

import { colors } from '@/utils/constants'
import { Theme } from '@/theme/Theme'
import { PageTitle } from '@/components/helmet/PageTitle/PageTitle'
import { BoardList, BoardMain, BoardWrapper } from '@/views/board/BoardPage/BoardPage.styles'
import { BoardHeader } from '@/views/board/BoardHeader/BoardHeader'
import { BoardCategory } from '@/views/board/BoardCategory/BoardCategory'
import { BoardAddCategory } from '@/views/board/BoardAddCategory/BoardAddCategory'
import { BoardMenu } from '@/views/board/BoardMenu/BoardMenu'
import { useBoardState } from '@/contexts/BoardStateContext'

const isDebug = process.env.NODE_ENV !== 'production'

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
  {
    id: 'id8',
    name: 'Reviewed',
    position: 5,
  },
  {
    id: 'id9',
    name: 'In Testing',
    position: 6,
  },
  {
    id: 'id10',
    name: 'Closed',
    position: 7,
  },
]

const BoardPage = () => {
  const { boardId } = useParams()
  const { isOpen, setIsOpen } = useBoardState()

  const { setBackground } = useContext(ThemeContext)
  const title = 'Board'

  useEffect(() => {
    setBackground(colors.sky.c700)

    return () => {
      setBackground(Theme.background)
    }
  }, [setBackground])

  const categories = useMemo(() => getCats(), [])

  const canAddCategory = useMemo(() => categories.length < 50, [categories])
  const position = useMemo(
    () => (categories && categories.length > 0 ? categories[categories.length - 1].position + 1 : 0),
    [categories],
  )

  const onClose = () => setIsOpen(false)

  return (
    <>
      <PageTitle title={title} />
      <BoardMain>
        <BoardWrapper>
          <BoardHeader />
          <BoardList>
            {categories.map((category, index) => (
              <BoardCategory key={category.id} category={category} color="sky" />
            ))}
            {canAddCategory && <BoardAddCategory boardId="id1" color="sky" position={position} />}
          </BoardList>
        </BoardWrapper>
        <BoardMenu color="sky" isOpen={isOpen} onClose={onClose} />
      </BoardMain>
    </>
  )
}

export default BoardPage
