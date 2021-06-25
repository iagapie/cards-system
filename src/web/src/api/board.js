import { authorization, request } from '../utils/request'
import { ENDPOINTS } from '../constants/endpoints'

export const apiBoards = (token) =>
  request()(ENDPOINTS.BOARDS)({
    headers: authorization(token),
  })

export const apiGetBoard = (token, id) =>
  request()(ENDPOINTS.BOARD(id))({
    headers: authorization(token),
  })

export const apiCreateBoard = (token, { name, color, description }) =>
  request('POST')(ENDPOINTS.BOARDS)({
    headers: authorization(token),
    data: {
      name,
      color,
      description,
    },
  })

export const apiUpdateBoard = (token, { id, name, color, description }) =>
  request('PUT')(ENDPOINTS.BOARD(id))({
    headers: authorization(token),
    data: {
      name,
      color,
      description,
    },
  })

export const apiDeleteBoard = (token, id) =>
  request('DELETE')(ENDPOINTS.BOARD(id))({
    headers: authorization(token),
  })
