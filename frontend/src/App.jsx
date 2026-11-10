import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { ProtectedRoute, SuperAdminRoute } from './components/common/ProtectedRoute.jsx'

// Layouts
import PublicLayout from './components/layout/PublicLayout.jsx'
import AdminLayout from './pages/admin/AdminLayout.jsx'

// Public pages
import HomePage from './pages/public/HomePage.jsx'
import PostDetailPage from './pages/public/PostDetailPage.jsx'
import ContactPage from './pages/public/ContactPage.jsx'
import AboutPage from './pages/public/AboutPage.jsx'
import ServicesPage from './pages/public/ServicesPage.jsx'

// Admin pages
import LoginPage from './pages/admin/LoginPage.jsx'
import DashboardPage from './pages/admin/DashboardPage.jsx'
import PostsListPage from './pages/admin/PostsListPage.jsx'
import PostFormPage from './pages/admin/PostFormPage.jsx'
import CategoriesPage from './pages/admin/CategoriesPage.jsx'
import UsersPage from './pages/admin/UsersPage.jsx'

import './styles/globals.css'

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        {/* ─── PUBLIC ROUTES ─────────────────────────────── */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:slug" element={<PostDetailPage />} />
          <Route path="/category/:slug" element={<HomePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services/:slug" element={<ServicesPage />} />
        </Route>

        {/* ─── ADMIN LOGIN ────────────────────────────────── */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* ─── PROTECTED ADMIN ROUTES ─────────────────────── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<DashboardPage />} />
            <Route path="/admin/posts" element={<PostsListPage />} />
            <Route path="/admin/posts/new" element={<PostFormPage />} />
            <Route path="/admin/posts/edit/:id" element={<PostFormPage />} />
            <Route path="/admin/categories" element={<CategoriesPage />} />

            {/* Superadmin only */}
            <Route element={<SuperAdminRoute />}>
              <Route path="/admin/users" element={<UsersPage />} />
            </Route>
          </Route>
        </Route>

        {/* ─── CATCH-ALL ───────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
)

export default App
