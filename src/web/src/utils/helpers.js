export const fixDates = (obj) => ({
  ...obj,
  created_at: new Date(obj.created_at),
  updated_at: new Date(obj.updated_at),
})

export const arrayFixDates = (data) => (Array.isArray(data) ? data.map((obj) => fixDates(obj)) : [])

export const toObject = (data, key = 'id') =>
  Array.isArray(data) ? data.reduce((obj, item) => ({ ...obj, [item[key]]: item }), {}) : {}

export const groupBy = (data, key = 'id') =>
  Array.isArray(data)
    ? data.reduce((obj, item) => ({ ...obj, [item[key]]: obj[item[key]] ? [...obj[item[key]], item] : [item] }), {})
    : {}

export const sortBy = [
  { column: 'position', sort: 'asc' },
  { column: 'created_at', sort: 'asc' },
]

const sort = (a, b, column) => {
  if (a[column] > b[column]) {
    return 1
  }

  if (a[column] < b[column]) {
    return -1
  }

  return 0
}

const sortFn = (a, b, columns = sortBy) => {
  const data = columns[0]
  const value = data.sort === 'asc' ? sort(a, b, data.column) : sort(b, a, data.column)

  if (value === 0 && columns.length > 1) {
    return sortFn(a, b, columns.slice(1))
  }

  return value
}

export const orderBy = (data, columns = sortBy) => {
  if (!data) {
    return []
  }

  const tmp = data.slice()
  tmp.sort((a, b) => sortFn(a, b, columns))

  return tmp
}

export const findIndex = (data, payload, keyId = 'id') => {
  const id = typeof payload === 'string' ? payload : payload[keyId]

  if (Array.isArray(data)) {
    return data.findIndex((item) => item[keyId] === id)
  }

  for (const [key, items] of Object.entries(data)) {
    const index = items.findIndex((item) => item[keyId] === id)
    if (index !== -1) {
      return [key, index]
    }
  }

  return ['', -1]
}
