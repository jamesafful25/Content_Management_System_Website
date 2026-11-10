import { Outlet } from 'react-router-dom'
import TopBar from './TopBar.jsx'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import styles from './PublicLayout.module.css'

const PublicLayout = () => (
  <div className={styles.layout}>
    <TopBar />
    <Navbar />
    <main className={styles.main}>
      <Outlet />
    </main>
    <Footer />
  </div>
)

export default PublicLayout
