import React, { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'

const initialContextValue = {
  isOpen: false,
  setIsOpen: (adding) => undefined,
}

const BoardStateContext = createContext(initialContextValue)

const useBoardState = () => useContext(BoardStateContext)

const BoardStateProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(initialContextValue.isOpen)
  const value = { isOpen, setIsOpen }

  return <BoardStateContext.Provider value={value}>{children}</BoardStateContext.Provider>
}

export { BoardStateProvider, useBoardState }

BoardStateProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
