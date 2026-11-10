import { useEffect } from 'react'
import { useForm } from '../../hooks/useForm.js'
import styles from './CategoryModal.module.css'

const CategoryModal = ({ isOpen, category, onSave, onClose, loading }) => {
  const { values, errors, setErrors, handleChange, reset, setValues } = useForm({
    name: '', description: ''
  })

  useEffect(() => {
    if (category) {
      setValues({ name: category.name, description: category.description || '' })
    } else {
      reset()
    }
  }, [category, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!values.name.trim()) newErrors.name = 'Category name is required'
    if (Object.keys(newErrors).length) return setErrors(newErrors)
    onSave(values)
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>{category ? 'Edit Category' : 'New Category'}</h3>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="form-group">
            <label className="form-label">Category Name *</label>
            <input
              name="name"
              value={values.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="e.g. Technology"
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={values.description}
              onChange={handleChange}
              className="form-input"
              rows={3}
              placeholder="Optional description..."
            />
          </div>

          <div className={styles.actions}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : category ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CategoryModal
