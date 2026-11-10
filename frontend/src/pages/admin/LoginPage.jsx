import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useForm } from '../../hooks/useForm.js'
import styles from './LoginPage.module.css'

const LoginPage = () => {
  const { login, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')

  const { values, errors, setErrors, handleChange } = useForm({
    email: '', password: ''
  })

  useEffect(() => {
    if (isAuthenticated) navigate('/admin/dashboard')
  }, [isAuthenticated])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')

    const newErrors = {}
    if (!values.email) newErrors.email = 'Email is required'
    if (!values.password) newErrors.password = 'Password is required'
    if (Object.keys(newErrors).length) return setErrors(newErrors)

    const result = await login(values.email, values.password)
    if (!result.success) setServerError(result.message)
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.brandAccent}>Core</span>lytix
        </div>
        <h1 className={styles.title}>Admin Login</h1>
        <p className={styles.subtitle}>Sign in to manage your content</p>

        {serverError && (
          <div className={styles.alert}>⚠️ {serverError}</div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="admin@example.com"
              autoComplete="email"
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
