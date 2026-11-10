import { useState, useEffect } from 'react'
import { userAPI, authAPI } from '../../api/index.js'
import { useAuth } from '../../context/AuthContext.jsx'
import ConfirmModal from '../../components/modals/ConfirmModal.jsx'
import styles from './UsersPage.module.css'

const UsersPage = () => {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [showRegister, setShowRegister] = useState(false)
  const [toast, setToast] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'author' })
  const [formError, setFormError] = useState('')

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchUsers = async () => {
    try {
      const { data } = await userAPI.getAll()
      setUsers(data.users)
    } catch { } finally { setLoading(false) }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleRegister = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!form.name || !form.email || !form.password) return setFormError('All fields required')
    setActionLoading(true)
    try {
      await authAPI.register(form)
      await fetchUsers()
      setForm({ name: '', email: '', password: '', role: 'author' })
      setShowRegister(false)
      showToast('Admin user created')
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create user')
    } finally { setActionLoading(false) }
  }

  const handleRoleChange = async (userId, newRole) => {
    try {
      await userAPI.update(userId, { role: newRole })
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
      showToast('Role updated')
    } catch { showToast('Failed to update role', 'error') }
  }

  const handleDelete = async () => {
    setActionLoading(true)
    try {
      await userAPI.delete(deleteTarget.id)
      setUsers(prev => prev.filter(u => u.id !== deleteTarget.id))
      showToast('User deleted')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete user', 'error')
    } finally { setActionLoading(false); setDeleteTarget(null) }
  }

  return (
    <div className={styles.page}>
      {toast && (
        <div className={`${styles.toast} ${toast.type === 'error' ? styles.toastError : ''}`}>
          {toast.message}
        </div>
      )}

      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Users</h1>
          <p className={styles.pageSub}>{users.length} admin users</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowRegister(!showRegister)}>
          {showRegister ? 'Cancel' : '+ New Admin'}
        </button>
      </div>

      {/* Register form */}
      {showRegister && (
        <div className={styles.registerCard}>
          <h3 className={styles.registerTitle}>Create New Admin</h3>
          {formError && <div className={styles.formError}>⚠️ {formError}</div>}
          <form onSubmit={handleRegister} className={styles.registerForm}>
            <input placeholder="Full name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="form-input" />
            <input type="email" placeholder="Email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="form-input" />
            <input type="password" placeholder="Password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} className="form-input" />
            <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} className="form-input">
              <option value="author">Author</option>
              <option value="editor">Editor</option>
              <option value="superadmin">Super Admin</option>
            </select>
            <button type="submit" className="btn btn-primary" disabled={actionLoading}>
              {actionLoading ? 'Creating...' : 'Create User'}
            </button>
          </form>
        </div>
      )}

      {/* Users table */}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i}><td colSpan={6}><div className={styles.skeletonRow} /></td></tr>
              ))
            ) : users.map(user => (
              <tr key={user.id}>
                <td>
                  <div className={styles.userCell}>
                    <div className={styles.avatar}>{user.name?.[0]?.toUpperCase()}</div>
                    <span className={styles.userName}>{user.name}</span>
                    {user.id === currentUser.id && <span className={styles.youBadge}>You</span>}
                  </div>
                </td>
                <td className={styles.muted}>{user.email}</td>
                <td>
                  {user.id !== currentUser.id ? (
                    <select
                      value={user.role}
                      onChange={e => handleRoleChange(user.id, e.target.value)}
                      className={styles.roleSelect}
                    >
                      <option value="author">Author</option>
                      <option value="editor">Editor</option>
                      <option value="superadmin">Super Admin</option>
                    </select>
                  ) : (
                    <span className={styles.roleChip}>{user.role}</span>
                  )}
                </td>
                <td>
                  <span className={`${styles.status} ${user.isActive ? styles.active : styles.inactive}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className={styles.muted}>
                  {new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                </td>
                <td>
                  {user.id !== currentUser.id && (
                    <button className={styles.deleteBtn} onClick={() => setDeleteTarget(user)}>Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete User"
        message={`Delete "${deleteTarget?.name}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={actionLoading}
      />
    </div>
  )
}

export default UsersPage
