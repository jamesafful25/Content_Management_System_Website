import { useState, useEffect } from 'react'
import { postAPI } from '../../api/postAPI.js'

/**
 * Custom hook to fetch featured posts for the carousel
 */
export const useFeaturedPosts = (limit = 5) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const { data } = await postAPI.getFeatured(limit)
        setPosts(data.posts)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load featured posts')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [limit])

  return { posts, loading, error }
}
