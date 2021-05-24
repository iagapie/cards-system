import { useState } from 'react'

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)

      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.log('Local storage error: ', error)

      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.log('Local storage error: ', error)
    }
  }

  const clearStoredValue = () => {
    try {
      window.localStorage.removeItem(key)
    } catch (error) {
      console.log('Local storage error: ', error)
    }
  }

  return {
    storedValue,
    setStoredValue: setValue,
    clearStoredValue,
  }
}
