import { useState, useEffect } from 'react'

/**
 * Debounce a value - useful for search inputs
 * @param {any} value
 * @param {number} delay - ms
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
