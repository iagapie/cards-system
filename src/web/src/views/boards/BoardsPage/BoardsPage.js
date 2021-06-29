import { UserIcon } from '@heroicons/react/outline'

import { Main, Wrapper, Title, Icon, Text, List, NewItem } from '@/views/boards/BoardsPage/BoardsPage.styles'
import { PageTitle } from '@/components/helmet/PageTitle/PageTitle'
import { BoardItem } from '@/views/boards/BoardItem/BoardItem'
import { Theme } from '@/theme/Theme'

const BoardsPage = () => {
  const randomBg = () => {
    const keys = Object.keys(Theme.bg)
    const index = Math.floor(Math.random() * keys.length)

    return Theme.bg[keys[index]]
  }
  const boards = [...Array(30).keys()].map((i) => ({
    id: `id${i}`,
    name: `Board name ${i}`,
    color: randomBg(),
  }))

  return (
    <>
      <PageTitle title="Boards" />
      <Main>
        <Wrapper>
          <Title>
            <Icon as={UserIcon} />
            <Text>Your Workspace boards</Text>
          </Title>
          <List>
            {boards.map((board) => (
              <BoardItem key={board.id} board={board} />
            ))}
            <NewItem>Create new board</NewItem>
          </List>
        </Wrapper>
      </Main>
    </>
  )
}

export default BoardsPage
