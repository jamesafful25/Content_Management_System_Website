import { Link } from 'react-router-dom'
import styles from './PostCard.module.css'

const PostCard = ({ post }) => {
  const date = new Date(post.publishedAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  })

  return (
    <article className={styles.card}>
      <Link to={`/post/${post.slug}`} className={styles.imageWrap}>
        <img
          src={post.imageUrl || '/placeholder.jpg'}
          alt={post.title}
          className={styles.image}
          loading="lazy"
        />
        {post.category && (
          <span className={styles.category}>{post.category.name}</span>
        )}
      </Link>

      <div className={styles.body}>
        <Link to={`/post/${post.slug}`}>
          <h2 className={styles.title}>{post.title}</h2>
        </Link>

        {post.summary && (
          <p className={styles.summary}>{post.summary}</p>
        )}

        <div className={styles.footer}>
          <div className={styles.author}>
            <div className={styles.avatar}>
              {post.author?.name?.[0]?.toUpperCase()}
            </div>
            <span>{post.author?.name}</span>
          </div>
          <time className={styles.date}>{date}</time>
        </div>
      </div>
    </article>
  )
}

export default PostCard
