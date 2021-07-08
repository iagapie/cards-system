import { UserIcon } from '@heroicons/react/outline'

import { PageTitle } from '@/components/helmet/PageTitle'
import { themes } from '@/utils/constants'

import { BoardListItem } from './BoardListItem'

const randomBg = () => {
  const index = Math.floor(Math.random() * themes.length)

  return themes[index]
}

const BoardListPage = () => {
  const boards = [...Array(30).keys()].map((i) => ({
    id: `id${i}`,
    name: `Board name ${i}`,
    color: randomBg(),
  }))

  return (
    <>
      <PageTitle title="Boards" />
      <main className="boards-page">
        <div className="boards-page__container">
          <h1 className="boards-page__title">
            <UserIcon className="boards-page__icon" />
            Your Workspace boards
          </h1>
          <div className="boards-page__list">
            {boards.map((board) => (
              <BoardListItem key={board.id} board={board} />
            ))}
            <button className="boards-page__new-item">Create new board</button>
          </div>
        </div>
      </main>
    </>
  )
}

export default BoardListPage
