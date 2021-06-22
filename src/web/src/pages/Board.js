import { useParams } from 'react-router-dom'
import { DotsHorizontalIcon, LockClosedIcon, PlusIcon, UserCircleIcon } from '@heroicons/react/outline'

const Board = () => {
  const { boardId } = useParams()

  const profileImg =
    'https://trello-members.s3.amazonaws.com/57865bc0db707d97e6cdb6ad/98325c199f92181706beffbfc15e3a9d/170.png'

  const categories = [
    {
      id: 'category1',
      name: 'To Do',
      cards: [...Array(30).keys()],
    },
    {
      id: 'category2',
      name: 'Progress',
      cards: [],
    },
    {
      id: 'category3',
      name: 'Done',
      cards: [],
    },
    {
      id: 'category4',
      name: 'Review',
      cards: [...Array(10).keys()],
    },
    {
      id: 'category5',
      name: 'Closed',
      cards: [],
    },
  ]

  return (
    <main className="flex flex-col space-y-2.5 p-2.5 h-full overflow-hidden">
      <div className="flex justify-between space-x-2">
        <div className="flex space-x-2 overflow-hidden">
          <div className="btn-white-30 font-bold">
            <span className="truncate">Finance planning</span>
          </div>
          <div className="hidden md:block w-px bg-white-20 my-2.5" />
          <div className="btn-white-30">
            <LockClosedIcon className="w-5 h-5" />
            <span className="hidden md:inline-block">Private</span>
          </div>
          <div className="hidden md:block w-px bg-white-20 my-2.5" />
          <button className="hidden md:flex items-center justify-center w-8 h-8 text-sm text-gray-50 overflow-hidden transition hover:text-gray-100 focus:outline-none">
            {!profileImg ? <UserCircleIcon /> : <img className="rounded-full" src={profileImg} alt="Igor Agapie" />}
          </button>
          <button className="md:btn-white-30 btn-text-base">
            <span>Invite</span>
          </button>
        </div>
        <div className="flex space-x-2">
          <button className="btn-white-30">
            <DotsHorizontalIcon className="w-5 h-5" />
            <span className="hidden md:inline-block">Show menu</span>
          </button>
        </div>
      </div>
      <div className="grid grid-flow-col auto-cols-max gap-2 overflow-y-hidden overflow-x-auto">
        {categories.map(({ id, name, cards }) => (
          <div key={id} className="flex flex-col justify-start overflow-hidden">
            <div className="flex flex-col space-y-2 w-64 p-2 bg-gray-200 rounded shadow-sm overflow-hidden">
              <div className="pl-2 flex items-center justify-between">
                <h2 className="text-black-100 text-sm font-bold leading-4 truncate overflow-hidden">{name}</h2>
                <button className="flex items-center justify-center p-2 text-sm leading-4 text-blue-gray-500 rounded transition hover:bg-gray-300 hover:text-black-100 focus:outline-none">
                  <DotsHorizontalIcon className="w-4 h-4" />
                </button>
              </div>
              {cards.length > 0 && (
                <div className="grid grid-flow-row gap-2 overflow-y-auto">
                  {cards.map((c) => (
                    <div
                      key={c}
                      className="p-2 shadow-sm border-b border-gray-400 text-black-100 text-sm leading-4 rounded bg-gray-100 transition hover:bg-gray-50 cursor-pointer"
                    >
                      Lorem ipsum dolor sit amet.
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between">
                <button className="flex-1 flex items-center px-3 py-2 text-sm leading-4 text-blue-gray-500 rounded transition hover:bg-gray-300 hover:text-blue-gray-700 focus:outline-none">
                  <PlusIcon className="w-4 h-4" />
                  <span className="pl-2">{cards.length ? 'Add another card' : 'Add a card'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
        <div className="flex items-start justify-between w-64">
          <button className="flex-1 flex items-center px-3 py-3 text-sm leading-4 text-gray-50 rounded shadow-sm bg-white-30 transition hover:bg-white-20 focus:outline-none">
            <PlusIcon className="w-4 h-4" />
            <span className="pl-2">Add another list</span>
          </button>
        </div>
      </div>
    </main>
  )
}

export default Board
