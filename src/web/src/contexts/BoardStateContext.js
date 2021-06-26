import React, { createContext, useContext, useState } from 'react'

const initialContextValue = {
  openingMenu: false,
  setOpeningMenu: (adding) => undefined,
}

const BoardStateContext = createContext(initialContextValue)

const useBoardState = () => useContext(BoardStateContext)

const BoardStateProvider = ({ children }) => {
  const [openingMenu, setOpeningMenu] = useState(false)
  const value = { openingMenu, setOpeningMenu }
  return <BoardStateContext.Provider value={value}>{children}</BoardStateContext.Provider>
}

export { BoardStateProvider, useBoardState }
