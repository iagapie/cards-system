export const toObject = (data, key = 'id') => {
  const obj = {}

  if (!Array.isArray(data)) {
    return obj
  }

  for (const item of data) {
    obj[item[key]] = item
  }

  return obj
}
