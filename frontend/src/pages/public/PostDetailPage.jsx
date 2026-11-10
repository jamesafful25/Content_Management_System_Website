import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { postAPI } from '../../api/postAPI.js'
import styles from './PostDetailPage.module.css'

const PostDetailPage = () => {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data } = await postAPI.getBySlug(slug)
        setPost(data.post)
      } catch (err) {
        setError(err.response?.data?.message || 'Post not found')
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [slug])

  if (loading) return (
    <div className={styles.loadingWrap}>
      <div className={styles.skeletonHero} />
      <div className="container">
        <div className={styles.skeletonContent}>
          {[...Array(6)].map((_, i) => <div key={i} className={styles.skeletonLine} />)}
        </div>
      </div>
    </div>
  )

  if (error) return (
    <div className={styles.errorWrap}>
      <h2>😕 {error}</h2>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </div>
  )

  if (!post) return null

  const date = new Date(post.publishedAt).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <article className={styles.article}>
      {/* Hero image */}
      <div className={styles.hero}>
        <img
          src={post.imageUrl || '/placeholder.jpg'}
          alt={post.title}
          className={styles.heroImage}
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <div className="container">
            {post.category && (
              <Link to={`/category/${post.category.slug}`} className={styles.categoryBadge}>
                {post.category.name}
              </Link>
            )}
            <h1 className={styles.title}>{post.title}</h1>
            <div className={styles.meta}>
              <div className={styles.author}>
                <div className={styles.avatar}>{post.author?.name?.[0]?.toUpperCase()}</div>
                <div>
                  <span className={styles.authorName}>{post.author?.name}</span>
                  <time className={styles.date}>{date}</time>
                </div>
              </div>
              <div className={styles.views}>
                👁 {post.views?.toLocaleString()} views
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container">
        <div className={styles.contentWrap}>
          {post.summary && (
            <p className={styles.summary}>{post.summary}</p>
          )}
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className={styles.backWrap}>
            <Link to="/" className="btn btn-outline">← Back to Stories</Link>
          </div>
        </div>
      </div>
    </article>
  )
}

export default PostDetailPage
