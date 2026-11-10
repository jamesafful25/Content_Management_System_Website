import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import FeaturedCarousel from '../../components/carousel/FeaturedCarousel.jsx'
import PostCard from '../../components/cards/PostCard.jsx'
import Pagination from '../../components/common/Pagination.jsx'
import { usePosts } from '../../hooks/custom/usePosts.js'
import { useCategories } from '../../hooks/custom/useCategories.js'
import { useDebounce } from '../../hooks/useDebounce.js'
import styles from './HomePage.module.css'

const HomePage = () => {
  // Read category slug from URL e.g. /category/data-science
  const { slug: urlSlug } = useParams()

  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(urlSlug || '')

  const { posts, loading, error, pagination, setPage, updateParams } = usePosts({
    categorySlug: urlSlug || ''
  })
  const { categories } = useCategories()
  const debouncedSearch = useDebounce(search, 500)

  // When the URL slug changes (navbar click), sync the active tab and fetch
  useEffect(() => {
    setActiveCategory(urlSlug || '')
    setSearch('')
    updateParams({ categorySlug: urlSlug || '', search: '' })
  }, [urlSlug])

  // When debounced search changes, update params
  useEffect(() => {
    updateParams({ search: debouncedSearch })
  }, [debouncedSearch])

  const handleSearch = (val) => {
    setSearch(val)
  }

  const handleCategoryTab = (slug) => {
    setActiveCategory(slug)
    setSearch('')
    updateParams({ categorySlug: slug, search: '' })
  }

  return (
    <div>
      {/* ── CAROUSEL ── */}
      <FeaturedCarousel />

      {/* ── LATEST NEWS ── */}
      <section className="section">
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>
                {activeCategory
                  ? categories.find(c => c.slug === activeCategory)?.name || 'Stories'
                  : 'Latest Stories'}
              </h2>
              <p className={styles.sectionSub}>Stay informed with our most recent articles</p>
            </div>
            <div className={styles.searchBox}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search stories..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>

          {/* Category filter tabs */}
          <div className={styles.filterTabs}>
            <button
              className={`${styles.tab} ${activeCategory === '' ? styles.active : ''}`}
              onClick={() => handleCategoryTab('')}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`${styles.tab} ${activeCategory === cat.slug ? styles.active : ''}`}
                onClick={() => handleCategoryTab(cat.slug)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Posts grid */}
          {loading ? (
            <div className={styles.grid}>
              {[...Array(6)].map((_, i) => <div key={i} className={styles.cardSkeleton} />)}
            </div>
          ) : error ? (
            <div className={styles.errorState}>
              <p>⚠️ {error}</p>
              <button className="btn btn-outline" onClick={() => window.location.reload()}>Retry</button>
            </div>
          ) : posts.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No stories found. Try a different search or category.</p>
            </div>
          ) : (
            <>
              <div className={styles.grid}>
                {posts.map((post) => <PostCard key={post.id} post={post} />)}
              </div>
              <Pagination
                page={pagination.page}
                pages={pagination.pages}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default HomePage
