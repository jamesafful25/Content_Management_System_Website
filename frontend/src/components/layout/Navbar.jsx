import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import CorelytixLogo from '../common/CorelytixLogo.jsx'
import styles from './Navbar.module.css'

const services = [
  { icon: '📊', label: 'Business Intelligence', slug: 'business-intelligence' },
  { icon: '☁️', label: 'Cloud Computing', slug: 'cloud-computing' },
  { icon: '🔐', label: 'Cyber Security', slug: 'cyber-security' },
  { icon: '🗄️', label: 'Data Engineering', slug: 'data-engineering' },
  { icon: '🤖', label: 'Data Science', slug: 'data-science' },
  { icon: '⚙️', label: 'DevOps Engineering', slug: 'devops-engineering' },
  { icon: '💻', label: 'Software Engineering', slug: 'software-engineering' },
]

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const location = useLocation()

  // close menu on route change
  useState(() => { setMenuOpen(false) }, [location])

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>

        {/* ── LOGO ── */}
        <Link to="/" className={styles.logo}>
          <CorelytixLogo variant="full" />
        </Link>

        {/* ── NAV LINKS ── */}
        <nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`}>

          <Link to="/" className={styles.navLink} onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          {/* Services dropdown */}
          <div
            className={`${styles.dropdown} ${servicesOpen ? styles.mobileOpen : ''}`}
          >
            <button
              className={styles.dropdownTrigger}
              onClick={() => setServicesOpen(!servicesOpen)}
            >
              Services <span className={styles.dropdownArrow}>▼</span>
            </button>
            <div className={styles.dropdownMenu}>
              {services.map(s => (
                <Link
                  key={s.slug}
                  to={`/services/${s.slug}`}
                  className={styles.dropdownItem}
                  onClick={() => { setMenuOpen(false); setServicesOpen(false) }}
                >
                  <span className={styles.dropdownIcon}>{s.icon}</span>
                  {s.label}
                </Link>
              ))}
            </div>
          </div>

          <Link to="/about" className={styles.navLink} onClick={() => setMenuOpen(false)}>
            About Us
          </Link>

          <Link to="/contact" className={styles.navLink} onClick={() => setMenuOpen(false)}>
            Contact
          </Link>
        </nav>

        {/* ── ACTIONS ── */}
        <div className={styles.actions}>
          <Link
            to="/admin/login"
            className="btn btn-primary"
            style={{ fontSize: '0.8rem', padding: '7px 18px' }}
          >
            Admin
          </Link>
          <button
            className={styles.burger}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>

      </div>
    </header>
  )
}

export default Navbar
