import { useState, useEffect, useCallback } from 'react'
import { postAPI } from '../../api/postAPI.js'

/**
 * Custom hook to fetch paginated published posts
 */
export const usePosts = (initialParams = {}) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 })
  const [params, setParams] = useState({ page: 1, limit: 9, ...initialParams })

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await postAPI.getAll(params)
      setPosts(data.posts)
      setPagination({ total: data.total, page: data.page, pages: data.pages })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load posts')
    } finally {
      setLoading(false)
    }
  }, [params])

  useEffect(() => { fetchPosts() }, [fetchPosts])

  const updateParams = (newParams) => setParams((prev) => ({ ...prev, ...newParams, page: 1 }))
  const setPage = (page) => setParams((prev) => ({ ...prev, page }))

  return { posts, loading, error, pagination, updateParams, setPage, refetch: fetchPosts }
}
