import { useState } from 'react'
import { useCategories } from '../../hooks/custom/useCategories.js'
import CategoryModal from '../../components/modals/CategoryModal.jsx'
import ConfirmModal from '../../components/modals/ConfirmModal.jsx'
import styles from './CategoriesPage.module.css'

const CategoriesPage = () => {
  const { categories, loading, actionLoading, createCategory, updateCategory, deleteCategory } = useCategories()
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSave = async (data) => {
    const result = editTarget
      ? await updateCategory(editTarget.id, data)
      : await createCategory(data)

    if (result.success) {
      setModalOpen(false)
      setEditTarget(null)
      showToast(editTarget ? 'Category updated' : 'Category created')
    } else {
      showToast(result.message, 'error')
    }
  }

  const handleDelete = async () => {
    const result = await deleteCategory(deleteTarget.id)
    setDeleteTarget(null)
    if (result.success) showToast('Category deleted')
    else showToast(result.message, 'error')
  }

  const openEdit = (cat) => { setEditTarget(cat); setModalOpen(true) }
  const openNew = () => { setEditTarget(null); setModalOpen(true) }

  return (
    <div className={styles.page}>
      {toast && (
        <div className={`${styles.toast} ${toast.type === 'error' ? styles.toastError : ''}`}>
          {toast.message}
        </div>
      )}

      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Categories</h1>
          <p className={styles.pageSub}>{categories.length} categories</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>+ New Category</button>
      </div>

      <div className={styles.grid}>
        {loading ? (
          [...Array(4)].map((_, i) => <div key={i} className={styles.skeleton} />)
        ) : categories.length === 0 ? (
          <div className={styles.empty}>
            <p>No categories yet.</p>
            <button className="btn btn-primary" onClick={openNew}>Create First Category</button>
          </div>
        ) : (
          categories.map(cat => (
            <div key={cat.id} className={styles.card}>
              <div className={styles.cardIcon}>🏷️</div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardName}>{cat.name}</h3>
                <p className={styles.cardSlug}>/{cat.slug}</p>
                {cat.description && <p className={styles.cardDesc}>{cat.description}</p>}
              </div>
              <div className={styles.cardActions}>
                <button className={styles.editBtn} onClick={() => openEdit(cat)}>Edit</button>
                <button className={styles.deleteBtn} onClick={() => setDeleteTarget(cat)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      <CategoryModal
        isOpen={modalOpen}
        category={editTarget}
        onSave={handleSave}
        onClose={() => { setModalOpen(false); setEditTarget(null) }}
        loading={actionLoading}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Category"
        message={`Delete "${deleteTarget?.name}"? Posts in this category will be uncategorized.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={actionLoading}
      />
    </div>
  )
}

export default CategoriesPage
