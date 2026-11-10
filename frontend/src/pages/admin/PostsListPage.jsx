import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminPosts } from '../../hooks/custom/useAdminPosts.js'
import ConfirmModal from '../../components/modals/ConfirmModal.jsx'
import Pagination from '../../components/common/Pagination.jsx'
import { useDebounce } from '../../hooks/useDebounce.js'
import styles from './PostsListPage.module.css'

const PostsListPage = () => {
  const { posts, loading, actionLoading, pagination, deletePost, updateParams, setPage } = useAdminPosts()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [toast, setToast] = useState(null)

  const debouncedSearch = useDebounce(search, 500)

  const handleSearchChange = (val) => {
    setSearch(val)
    updateParams({ search: val })
  }

  const handleStatusFilter = (val) => {
    setFilterStatus(val)
    updateParams({ isPublished: val })
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleDelete = async () => {
    const result = await deletePost(deleteTarget.id)
    setDeleteTarget(null)
    if (result.success) showToast('Post deleted successfully')
    else showToast(result.message, 'error')
  }

  return (
    <div className={styles.page}>
      {/* Toast */}
      {toast && (
        <div className={`${styles.toast} ${toast.type === 'error' ? styles.toastError : ''}`}>
          {toast.message}
        </div>
      )}

      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Posts</h1>
          <p className={styles.pageSub}>{pagination.total} total posts</p>
        </div>
        <Link to="/admin/posts/new" className="btn btn-primary">+ New Post</Link>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={filterStatus}
          onChange={(e) => handleStatusFilter(e.target.value)}
          className={styles.select}
        >
          <option value="">All Posts</option>
          <option value="true">Published</option>
          <option value="false">Drafts</option>
        </select>
      </div>

      {/* Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrap}>
          {loading ? (
            <div className={styles.loadingRows}>
              {[...Array(5)].map((_, i) => <div key={i} className={styles.skeletonRow} />)}
            </div>
          ) : posts.length === 0 ? (
            <div className={styles.empty}>
              <p>No posts found</p>
              <Link to="/admin/posts/new" className="btn btn-primary">Create First Post</Link>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Views</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id}>
                    <td>
                      <div className={styles.thumb}>
                        <img
                          src={post.imageUrl || '/placeholder.jpg'}
                          alt={post.title}
                        />
                      </div>
                    </td>
                    <td>
                      <p className={styles.postTitle}>{post.title}</p>
                      <p className={styles.postSlug}>/{post.slug}</p>
                    </td>
                    <td>
                      <span className={styles.chip}>{post.category?.name || '—'}</span>
                    </td>
                    <td>
                      <span className={`${styles.status} ${post.isPublished ? styles.published : styles.draft}`}>
                        {post.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.featured} ${post.isFeatured ? styles.yes : styles.no}`}>
                        {post.isFeatured ? '⭐ Yes' : 'No'}
                      </span>
                    </td>
                    <td className={styles.muted}>{post.views}</td>
                    <td className={styles.muted}>
                      {new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <Link to={`/admin/posts/edit/${post.id}`} className={styles.editBtn}>Edit</Link>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => setDeleteTarget(post)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {!loading && posts.length > 0 && (
          <div className={styles.paginationWrap}>
            <Pagination page={pagination.page} pages={pagination.pages} onPageChange={setPage} />
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Post"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={actionLoading}
      />
    </div>
  )
}

export default PostsListPage
