import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { postAPI } from '../../api/postAPI.js'
import { categoryAPI } from '../../api/index.js'
import { useAuth } from '../../context/AuthContext.jsx'
import styles from './DashboardPage.module.css'

const StatCard = ({ icon, label, value, color, to }) => (
  <Link to={to || '#'} className={styles.statCard} style={{ '--card-color': color }}>
    <div className={styles.statIcon}>{icon}</div>
    <div>
      <p className={styles.statValue}>{value ?? '—'}</p>
      <p className={styles.statLabel}>{label}</p>
    </div>
  </Link>
)

const DashboardPage = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({ totalPosts: 0, publishedPosts: 0, draftPosts: 0, totalCategories: 0 })
  const [recentPosts, setRecentPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allRes, pubRes, catRes] = await Promise.all([
          postAPI.adminGetAll({ limit: 5 }),
          postAPI.adminGetAll({ isPublished: 'true', limit: 1 }),
          categoryAPI.getAll()
        ])
        const total = allRes.data.total
        const published = pubRes.data.total
        setStats({
          totalPosts: total,
          publishedPosts: published,
          draftPosts: total - published,
          totalCategories: catRes.data.categories.length
        })
        setRecentPosts(allRes.data.posts)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSub}>Welcome back, {user?.name?.split(' ')[0]} 👋</p>
        </div>
        <Link to="/admin/posts/new" className="btn btn-primary">+ New Post</Link>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <StatCard icon="📝" label="Total Posts" value={stats.totalPosts} color="#6366f1" to="/admin/posts" />
        <StatCard icon="✅" label="Published" value={stats.publishedPosts} color="#10b981" to="/admin/posts" />
        <StatCard icon="📋" label="Drafts" value={stats.draftPosts} color="#f59e0b" to="/admin/posts" />
        <StatCard icon="🏷️" label="Categories" value={stats.totalCategories} color="#e85d26" to="/admin/categories" />
      </div>

      {/* Recent posts */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent Posts</h2>
          <Link to="/admin/posts" className={styles.viewAll}>View all →</Link>
        </div>
        {loading ? (
          <div className={styles.tableWrap}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className={styles.skeletonRow} />
            ))}
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Views</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recentPosts.map(post => (
                  <tr key={post.id}>
                    <td>
                      <span className={styles.postTitle}>{post.title}</span>
                    </td>
                    <td>
                      <span className={styles.categoryChip}>
                        {post.category?.name || '—'}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.status} ${post.isPublished ? styles.published : styles.draft}`}>
                        {post.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className={styles.muted}>{post.views}</td>
                    <td className={styles.muted}>
                      {new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </td>
                    <td>
                      <Link to={`/admin/posts/edit/${post.id}`} className={styles.editLink}>Edit</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
