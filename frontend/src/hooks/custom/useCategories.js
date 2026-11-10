import { useState, useEffect, useCallback } from 'react'
import { categoryAPI } from '../../api/index.js'

/**
 * Custom hook for category management
 */
export const useCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await categoryAPI.getAll()
      setCategories(data.categories)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load categories')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchCategories() }, [fetchCategories])

  const createCategory = async (data) => {
    setActionLoading(true)
    try {
      const res = await categoryAPI.create(data)
      await fetchCategories()
      return { success: true, category: res.data.category }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to create category' }
    } finally {
      setActionLoading(false)
    }
  }

  const updateCategory = async (id, data) => {
    setActionLoading(true)
    try {
      const res = await categoryAPI.update(id, data)
      await fetchCategories()
      return { success: true, category: res.data.category }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to update category' }
    } finally {
      setActionLoading(false)
    }
  }

  const deleteCategory = async (id) => {
    setActionLoading(true)
    try {
      await categoryAPI.delete(id)
      await fetchCategories()
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to delete category' }
    } finally {
      setActionLoading(false)
    }
  }

  return { categories, loading, actionLoading, error, createCategory, updateCategory, deleteCategory, refetch: fetchCategories }
}
