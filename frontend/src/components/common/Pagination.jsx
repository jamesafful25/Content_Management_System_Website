import styles from './Pagination.module.css'

const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null

  const getPages = () => {
    const items = []
    for (let i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || (i >= page - 1 && i <= page + 1)) {
        items.push(i)
      } else if (items[items.length - 1] !== '...') {
        items.push('...')
      }
    }
    return items
  }

  return (
    <nav className={styles.pagination}>
      <button
        className={styles.btn}
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        ← Prev
      </button>

      <div className={styles.pages}>
        {getPages().map((p, i) =>
          p === '...'
            ? <span key={`dots-${i}`} className={styles.dots}>…</span>
            : <button
                key={p}
                className={`${styles.page} ${p === page ? styles.active : ''}`}
                onClick={() => onPageChange(p)}
              >
                {p}
              </button>
        )}
      </div>

      <button
        className={styles.btn}
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
      >
        Next →
      </button>
    </nav>
  )
}

export default Pagination
