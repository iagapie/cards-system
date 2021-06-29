import styled, { css } from 'styled-components'
import { Dialog } from '@headlessui/react'

import { colors, size } from '@/utils/constants'
import { Theme } from '@/theme/Theme'
import { Button } from '@/components/buttons/Button/Button.styles'

const fixed = css`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`

export const Modal = styled.div.attrs((props) => ({
  as: props.as || Dialog,
}))`
  ${fixed};
  z-index: 50;
  overflow-y: auto;
`

export const ModalWrapper = styled.div`
  min-height: 100vh;
  padding: 0 0.75rem;
  text-align: center;
`

export const ModalOverlay = styled.div.attrs((props) => ({
  as: props.as || Dialog.Overlay,
}))`
  ${fixed};
  background-color: ${colors.black(0.8)};
`

export const ModalBody = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
  max-width: 32rem;
  padding: 1rem;
  margin: 0.75rem auto;
  overflow: hidden;
  text-align: left;
  vertical-align: middle;
  border-radius: ${Theme.radius};
  box-shadow: 0 0 #0000, 0 0 #0000, 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  background-color: ${colors.white()};

  @media (min-width: ${size.sm}) {
    margin: 2.5rem;
  }
`

export const ModalForm = styled.form`
  display: grid;
  grid-auto-flow: row;
  gap: 1rem;

  @media (min-width: ${size.md}) {
    grid-template-columns: repeat(12, minmax(0, 1fr));
  }
`

export const ModalTitle = styled.div.attrs((props) => ({
  as: props.as || Dialog.Title,
}))`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${colors.blueGray.c700};
  font-weight: 600;
  font-size: 1.125rem;
  line-height: 1.5rem;
  margin-bottom: 0.5rem;

  @media (min-width: ${size.md}) {
    grid-column: span 12 / span 12;
  }
`

export const ModalClose = styled(Button)`
  &:hover {
    color: ${colors.blueGray.c600};
  }
`

export const ModalCloseIcon = styled.div.attrs((props) => ({
  size: props.size || '1.5rem',
}))`
  width: ${(props) => props.size};
  height: ${(props) => props.size};
`

export const ModalButton = styled(Button)`
  padding: 0.5rem 1rem;
  font-weight: 500;
  font-size: 1rem;
  color: ${colors.sky.c900};
  background-color: ${colors.sky.c100};
  place-self: start;

  &:hover {
    background-color: ${colors.sky.c200};
  }

  &:disabled {
    background-color: ${colors.gray.c300};
    color: ${colors.gray.c500};
  }

  @media (min-width: ${size.md}) {
    grid-column: span 12 / span 12;
  }
`

export const ModalError = styled.div`
  color: ${colors.red.c500};
  font-size: 0.875rem;
  font-weight: 500;
`

export const ModalFormRow = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: ${size.md}) {
    grid-column: span 8 / span 8;
  }
`

export const ModalFormRowColors = styled(ModalFormRow)`
  @media (min-width: ${size.md}) {
    grid-row: span 2 / span 2;
    grid-column: span 4 / span 4;
  }
`

export const ModalFormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${colors.gray.c700};
  border-radius: ${Theme.radius};
  border-width: 2px;
  border-color: ${colors.gray.c300};

  &::placeholder {
    color: ${colors.gray.c400};
  }

  &:focus {
    outline: none;
    border-color: ${colors.sky.c400};
  }
`

export const ModalFormError = styled.strong`
  display: block;
  color: ${colors.red.c500};
  font-size: 0.875rem;
  line-height: 1.25rem;
  padding-top: 0.25rem;
`

export const ColorList = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 0.5rem;
`

export const ColorItem = styled.div.attrs((props) => ({
  bg: props.bg || colors.sky.c700,
  checked: props.checked || false,
}))`
  grid-column: span 2 / span 2;
  display: block;
  cursor: pointer;
  box-shadow: 0 0 #0000, 0 0 #0000, 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  background-color: ${({ bg }) => bg};

  ${({ checked }) =>
    checked &&
    css`
      box-shadow: 0 0 0 2px ${colors.blueGray.c400}, 0 0 #0000;
    `};

  @media (min-width: ${size.md}) {
    grid-column: span 4 / span 4;
  }
`
