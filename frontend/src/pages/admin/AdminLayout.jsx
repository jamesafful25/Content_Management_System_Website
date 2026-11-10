import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import styles from './AdminLayout.module.css'

const navItems = [
  { to: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/admin/posts', icon: '📝', label: 'Posts' },
  { to: '/admin/posts/new', icon: '✏️', label: 'New Post' },
  { to: '/admin/categories', icon: '🏷️', label: 'Categories' },
  { to: '/admin/users', icon: '👥', label: 'Users', adminOnly: true }
]

const AdminLayout = () => {
  const { user, logout, isSuperAdmin } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const filteredNav = navItems.filter(item => !item.adminOnly || isSuperAdmin)

  return (
    <div className={`${styles.layout} admin-layout`}>
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        <div className={styles.sidebarTop}>
          <div className={styles.logo}>
            <span className={styles.logoAccent}>Core</span>lytix
          </div>
        </div>

        <nav className={styles.nav}>
          <p className={styles.navLabel}>Menu</p>
          {filteredNav.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin/dashboard'}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <span className={styles.navIcon}>{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarBottom}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className={styles.userName}>{user?.name}</p>
              <p className={styles.userRole}>{user?.role}</p>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className={styles.main}>
        {/* Top bar */}
        <header className={styles.topbar}>
          <button className={styles.burgerBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
          <div className={styles.topbarRight}>
            <span className={styles.topbarUser}>Hi, {user?.name?.split(' ')[0]}</span>
          </div>
        </header>

        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
