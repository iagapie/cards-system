import { useLocation } from 'react-router-dom'

export const useQueryString = () => {
  const { search } = useLocation()
  const query = new URLSearchParams(search)

  const getQueryParam = (name) => query.get(name)

  return {
    query,
    getQueryParam,
  }
}
