import { AnnotationIcon, BookmarkAltIcon, CogIcon, TagIcon, XIcon } from '@heroicons/react/outline'
import { useMemo } from 'react'

import { COLORS } from '../../constants/colors'

const iconClass = 'w-5 h-5'

export const Menu = ({ isOpen, closeMenu, bgColor }) => {
  const container = useMemo(() => (isOpen ? 'w-80 p-2.5' : 'w-0'), [isOpen])
  const closeBtn = useMemo(() => (isOpen ? '' : 'hidden'), [isOpen])

  const data = [
    { name: 'About this board', icon: <AnnotationIcon className={iconClass} /> },
    { name: 'Change background', icon: <span className={`rounded block ${iconClass} ${COLORS.BOARD.BG[bgColor]}`} /> },
    { name: 'Settings', icon: <CogIcon className={iconClass} /> },
    { name: 'Labels', icon: <TagIcon className={iconClass} /> },
  ]

  return (
    <div
      className={`flex flex-col overflow-hidden bg-gray-200 shadow absolute z-40 top-0 right-0 bottom-0 transition-all duration-400 divide-y divide-gray-300 ${container}`}
    >
      <div className="w-full pb-2.5 flex items-center justify-center text-black-100 text-lg font-bold relative">
        Menu
        <button
          className={`absolute right-0 top-0 bottom-0 hover:text-gray-800 focus:outline-none flex items-center justify-center pb-2.5 ${closeBtn}`}
          onClick={closeMenu}
        >
          <XIcon className={iconClass} />
        </button>
      </div>
      <div className="flex-grow flex flex-col overflow-y-auto divide-y divide-gray-300">
        <div className="flex flex-col space-y-1 py-2">
          {data.map(({ name, icon }, index) => (
            <button
              key={index}
              className="flex flex-grow items-center space-x-2 px-3 py-1 text-black-100 text-base font-semibold rounded hover:bg-gray-300 focus:outline-none"
            >
              {icon}
              <span>{name}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-col space-y-1 py-2">
          <div className="flex flex-grow items-center space-x-2 px-3 py-1 text-black-100 text-base font-semibold">
            <BookmarkAltIcon className={iconClass} />
            <span>Activity</span>
          </div>
        </div>
      </div>
    </div>
  )
}
