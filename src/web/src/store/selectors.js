export const getAuth = (state) => state.authState
export const getBoards = (state) => state.boardsState
export const getCurrentBoard = (state) => state.currentBoardState
export const getBoard = (state) => getCurrentBoard(state).boardState
export const getCards = (state) => getCurrentBoard(state).cardsState
export const getMembers = (state) => getCurrentBoard(state).membersState
export const getCategories = (state) => getCurrentBoard(state).categoriesState
export const getTags = (state) => getCurrentBoard(state).tagsState

export const canAddBoard = (state) => getBoards(state).boards.length < 100
export const canAddCategory = (state) => getCategories(state).categories.length < 50
