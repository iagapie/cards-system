export const toObject = (data, key = 'id') =>
  Array.isArray(data) ? data.reduce((obj, item) => ({ ...obj, [item[key]]: item }), {}) : {}

export const groupBy = (data, key = 'id') =>
  Array.isArray(data)
    ? data.reduce((obj, item) => ({ ...obj, [item[key]]: obj[item[key]] ? [...obj[item[key]], item] : [item] }), {})
    : {}

export const orderBy = (data, dateColumn = 'created_at') => {
  if (!data) {
    return []
  }
  const tmp = data.slice()
  tmp.sort((a, b) => {
    if (a.position === b.position) {
      const ad = new Date(a[dateColumn])
      const bd = new Date(b[dateColumn])

      if (ad > bd) {
        return 1
      }

      if (ad < bd) {
        return -1
      }

      return 0
    }

    return a.position - b.position
  })

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
