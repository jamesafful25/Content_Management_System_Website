import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules'
import { Link } from 'react-router-dom'
import { useFeaturedPosts } from '../../hooks/custom/useFeaturedPosts.js'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'
import styles from './FeaturedCarousel.module.css'

const FeaturedCarousel = () => {
  const { posts, loading } = useFeaturedPosts(6)

  if (loading) return <div className={styles.skeleton} />
  if (!posts.length) return null

  return (
    <section className={styles.carousel}>
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop
        className={styles.swiper}
      >
        {posts.map((post) => (
          <SwiperSlide key={post.id}>
            <div className={styles.slide}>
              <img
                src={post.imageUrl || '/placeholder.jpg'}
                alt={post.title}
                className={styles.image}
              />
              <div className={styles.overlay} />
              <div className={styles.content}>
                {post.category && (
                  <span className={styles.category}>{post.category.name}</span>
                )}
                <h1 className={styles.title}>{post.title}</h1>
                {post.summary && (
                  <p className={styles.summary}>{post.summary}</p>
                )}
                <div className={styles.meta}>
                  <span>{post.author?.name}</span>
                  <span className={styles.dot}>·</span>
                  <span>{new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <Link to={`/post/${post.slug}`} className={styles.readBtn}>
                  Read Story →
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}

export default FeaturedCarousel
