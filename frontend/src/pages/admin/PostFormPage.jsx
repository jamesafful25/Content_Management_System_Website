import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useAdminPosts } from '../../hooks/custom/useAdminPosts.js'
import { useCategories } from '../../hooks/custom/useCategories.js'
import { useForm } from '../../hooks/useForm.js'
import { postAPI } from '../../api/postAPI.js'
import styles from './PostFormPage.module.css'

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    [{ align: [] }],
    ['clean']
  ]
}

const PostFormPage = () => {
  const { id } = useParams()
  const isEditing = !!id
  const navigate = useNavigate()

  const { createPost, updatePost, actionLoading } = useAdminPosts()
  const { categories } = useCategories()

  const [content, setContent] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [serverError, setServerError] = useState('')
  const [loadingPost, setLoadingPost] = useState(isEditing)

  const fileRef = useRef()

  const { values, errors, setErrors, handleChange, setFieldValue, setValues } = useForm({
    title: '',
    summary: '',
    categoryId: '',
    isFeatured: false,
    isPublished: false
  })

  // Load post data if editing
  useEffect(() => {
    if (!isEditing) return
    const loadPost = async () => {
      try {
        const { data } = await postAPI.adminGetById(id)
        const p = data.post
        setValues({
          title: p.title,
          summary: p.summary || '',
          categoryId: p.categoryId || '',
          isFeatured: p.isFeatured,
          isPublished: p.isPublished
        })
        setContent(p.content)
        if (p.imageUrl) setImagePreview(p.imageUrl)
      } catch {
        setServerError('Failed to load post')
      } finally {
        setLoadingPost(false)
      }
    }
    loadPost()
  }, [id])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')

    const newErrors = {}
    if (!values.title.trim()) newErrors.title = 'Title is required'
    if (!content.trim() || content === '<p><br></p>') newErrors.content = 'Content is required'
    if (!values.categoryId) newErrors.categoryId = 'Please select a category'
    if (Object.keys(newErrors).length) return setErrors(newErrors)

    const formData = new FormData()
    formData.append('title', values.title)
    formData.append('summary', values.summary)
    formData.append('content', content)
    formData.append('categoryId', values.categoryId)
    formData.append('isFeatured', values.isFeatured)
    formData.append('isPublished', values.isPublished)
    if (imageFile) formData.append('image', imageFile)

    const result = isEditing
      ? await updatePost(id, formData)
      : await createPost(formData)

    if (result.success) {
      navigate('/admin/posts')
    } else {
      setServerError(result.message)
    }
  }

  if (loadingPost) return <div className="spinner" />

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>{isEditing ? 'Edit Post' : 'New Post'}</h1>
          <p className={styles.pageSub}>{isEditing ? 'Update the post details below' : 'Fill in the details to create a new post'}</p>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate('/admin/posts')}>
          ← Back to Posts
        </button>
      </div>

      {serverError && <div className={styles.alert}>⚠️ {serverError}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.mainCol}>
          {/* Title */}
          <div className={`${styles.card} form-group`}>
            <label className="form-label">Post Title *</label>
            <input
              name="title"
              value={values.title}
              onChange={handleChange}
              className={`form-input ${errors.title ? 'error' : ''}`}
              placeholder="Enter a compelling title..."
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>

          {/* Summary */}
          <div className={`${styles.card} form-group`}>
            <label className="form-label">Summary / Excerpt</label>
            <textarea
              name="summary"
              value={values.summary}
              onChange={handleChange}
              className="form-input"
              rows={3}
              placeholder="Short description shown under the image (optional)..."
            />
          </div>

          {/* Content editor */}
          <div className={styles.card}>
            <label className="form-label">Content *</label>
            <div className={`${styles.editorWrap} ${errors.content ? styles.editorError : ''}`}>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={quillModules}
                placeholder="Write your article here..."
                className={styles.editor}
              />
            </div>
            {errors.content && <span className="form-error">{errors.content}</span>}
          </div>
        </div>

        {/* Sidebar */}
        <div className={styles.sideCol}>
          {/* Publish settings */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Publish Settings</h3>
            <div className={styles.toggleGroup}>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={values.isPublished}
                  onChange={handleChange}
                />
                <span className={styles.toggleTrack} />
                <span className={styles.toggleLabel}>
                  {values.isPublished ? '✅ Published' : '📋 Draft'}
                </span>
              </label>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={values.isFeatured}
                  onChange={handleChange}
                />
                <span className={styles.toggleTrack} />
                <span className={styles.toggleLabel}>
                  {values.isFeatured ? '⭐ Featured' : '☆ Not Featured'}
                </span>
              </label>
            </div>
            <p className={styles.hint}>Featured posts appear in the homepage carousel</p>
          </div>

          {/* Category */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Category *</h3>
            <select
              name="categoryId"
              value={values.categoryId}
              onChange={handleChange}
              className={`form-input ${errors.categoryId ? 'error' : ''}`}
            >
              <option value="">Select a category...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.categoryId && <span className="form-error">{errors.categoryId}</span>}
          </div>

          {/* Image upload */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Featured Image</h3>
            <div
              className={styles.imageUpload}
              onClick={() => fileRef.current.click()}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
              ) : (
                <div className={styles.imagePlaceholder}>
                  <span>📷</span>
                  <p>Click to upload image</p>
                  <small>JPEG, PNG, WEBP — max 5MB</small>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            {imagePreview && (
              <button
                type="button"
                className={styles.removeImage}
                onClick={() => { setImageFile(null); setImagePreview(null) }}
              >
                Remove image
              </button>
            )}
          </div>

          {/* Submit */}
          <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={actionLoading}>
            {actionLoading ? 'Saving...' : isEditing ? 'Update Post' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PostFormPage
