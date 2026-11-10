import { useState, useEffect, useCallback } from 'react'
import { postAPI } from '../../api/postAPI.js'

/**
 * Custom hook for admin post CRUD operations
 */
export const useAdminPosts = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 })
  const [params, setParams] = useState({ page: 1, limit: 10 })

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await postAPI.adminGetAll(params)
      setPosts(data.posts)
      setPagination({ total: data.total, page: data.page, pages: data.pages })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load posts')
    } finally {
      setLoading(false)
    }
  }, [params])

  useEffect(() => { fetchPosts() }, [fetchPosts])

  const createPost = async (formData) => {
    setActionLoading(true)
    try {
      const { data } = await postAPI.create(formData)
      await fetchPosts()
      return { success: true, post: data.post }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to create post' }
    } finally {
      setActionLoading(false)
    }
  }

  const updatePost = async (id, formData) => {
    setActionLoading(true)
    try {
      const { data } = await postAPI.update(id, formData)
      await fetchPosts()
      return { success: true, post: data.post }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to update post' }
    } finally {
      setActionLoading(false)
    }
  }

  const deletePost = async (id) => {
    setActionLoading(true)
    try {
      await postAPI.delete(id)
      await fetchPosts()
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to delete post' }
    } finally {
      setActionLoading(false)
    }
  }

  const updateParams = (newParams) => setParams((prev) => ({ ...prev, ...newParams, page: 1 }))
  const setPage = (page) => setParams((prev) => ({ ...prev, page }))

  return {
    posts, loading, actionLoading, error, pagination,
    createPost, updatePost, deletePost, updateParams, setPage, refetch: fetchPosts
  }
}
