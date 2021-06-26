import { createSelector } from '@reduxjs/toolkit'

export const getAuth = (state) => state.authState
export const getToken = (state) => state.tokenState
export const getBoards = (state) => state.boardsState
export const getBoard = (state) => state.boardState
export const getCreateBoard = (state) => state.createBoardState
export const getCreateCategory = (state) => state.createCategoryState
export const getBoardCategories = (state) => getBoard(state).categories

export const getBoardCardsByCategory = () =>
  createSelector(
    (state) => getBoard(state).cards,
    (_, category) => category,
    (cards, category) => {
      const filtered = cards.slice().filter((card) => card.category_id === category)
      filtered.sort((a, b) => a.position - b.position)
      return filtered
    },
  )
