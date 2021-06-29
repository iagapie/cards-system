import styled from 'styled-components'

export const BoardMain = styled.main`
  position: relative;
  display: flex;
  flex-direction: row;
`

export const BoardWrapper = styled.div`
  flex-grow: 1;
  display: grid;
  grid-auto-flow: row;
  grid-auto-rows: max-content;
  gap: 0.625rem;
  padding: 0.625rem;
  overflow: hidden;
`

export const BoardList = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  gap: 0.5rem;
  overflow-y: hidden;
  overflow-x: auto;
  z-index: 0;
`
