import { Link } from 'react-router-dom'
import styles from './AboutPage.module.css'

const services = [
  { icon: '📊', title: 'Business Intelligence', desc: 'Transform raw data into actionable insights with powerful dashboards, reports, and analytics that drive smarter business decisions.' },
  { icon: '☁️', title: 'Cloud Computing', desc: 'Seamlessly migrate, manage, and scale your infrastructure on the cloud with secure, cost-efficient, and high-performance solutions.' },
  { icon: '🔐', title: 'Cyber Security', desc: 'Protect your business from evolving digital threats with end-to-end security audits, monitoring, and incident response services.' },
  { icon: '🗄️', title: 'Data Engineering', desc: 'Build robust data pipelines, warehouses, and integration systems that ensure your data is clean, reliable, and always ready.' },
  { icon: '🤖', title: 'Data Science', desc: 'Leverage machine learning and AI models to uncover patterns, predict trends, and automate intelligence across your operations.' },
  { icon: '⚙️', title: 'DevOps Engineering', desc: 'Accelerate software delivery with CI/CD pipelines, infrastructure automation, and DevOps best practices that reduce deployment risk.' },
  { icon: '💻', title: 'Software Engineering', desc: 'Custom-built web and mobile applications designed to solve real business problems — scalable, maintainable, and user-focused.' },
]

const values = [
  { icon: '🎯', title: 'Precision', desc: 'We deliver accurate, well-engineered solutions with attention to every detail.' },
  { icon: '🤝', title: 'Integrity', desc: 'We build trust through transparency, honesty, and consistent delivery on our promises.' },
  { icon: '🚀', title: 'Innovation', desc: 'We stay ahead of the curve, embracing new technologies to solve old problems better.' },
  { icon: '🌍', title: 'Impact', desc: 'We measure success by the real-world difference our work makes for our clients.' },
]

const AboutPage = () => (
  <div className={styles.page}>

    {/* ── HERO ── */}
    <div className={styles.hero}>
      <div className="container">
        <span className="badge">Who We Are</span>
        <h1 className={styles.heroTitle}>
          Powering the Future with <span className={styles.accent}>Data & Technology</span>
        </h1>
        <p className={styles.heroSub}>
          Corelytix Technologies is a Ghanaian technology company delivering cutting-edge
          data, cloud, and software engineering solutions to businesses across Africa and beyond.
        </p>
        <div className={styles.heroActions}>
          <Link to="/contact" className="btn btn-primary">Get In Touch →</Link>
          <a href="#services" className="btn btn-outline">Our Services</a>
        </div>
      </div>
    </div>

    {/* ── MISSION & VISION ── */}
    <section className="section">
      <div className="container">
        <div className={styles.mvGrid}>
          <div className={styles.mvCard}>
            <div className={styles.mvIcon}>🎯</div>
            <h3 className={styles.mvTitle}>Our Mission</h3>
            <p className={styles.mvText}>
              To empower organizations with intelligent technology solutions that simplify complexity,
              unlock the value of data, and accelerate sustainable growth in the digital economy.
            </p>
          </div>
          <div className={styles.mvCard}>
            <div className={styles.mvIcon}>🔭</div>
            <h3 className={styles.mvTitle}>Our Vision</h3>
            <p className={styles.mvText}>
              To be Africa's most trusted technology partner — known for excellence, innovation,
              and a relentless commitment to delivering measurable impact for every client we serve.
            </p>
          </div>
          <div className={styles.mvCard}>
            <div className={styles.mvIcon}>⭐</div>
            <h3 className={styles.mvTitle}>Why Choose Us</h3>
            <p className={styles.mvText}>
              We combine deep technical expertise with a genuine understanding of African business
              challenges — delivering world-class solutions built specifically for your context.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* ── SERVICES ── */}
    <section id="services" className={`section ${styles.servicesBg}`}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <span className="badge">What We Do</span>
          <h2 className={styles.sectionTitle}>Our Core Services</h2>
          <p className={styles.sectionSub}>
            From data pipelines to cloud infrastructure, we cover the full technology spectrum
            your business needs to compete and grow.
          </p>
        </div>

        <div className={styles.servicesGrid}>
          {services.map((s) => (
            <div key={s.title} className={styles.serviceCard}>
              <div className={styles.serviceIcon}>{s.icon}</div>
              <h3 className={styles.serviceTitle}>{s.title}</h3>
              <p className={styles.serviceDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── VALUES ── */}
    <section className="section">
      <div className="container">
        <div className={styles.sectionHeader}>
          <span className="badge">What Drives Us</span>
          <h2 className={styles.sectionTitle}>Our Core Values</h2>
        </div>
        <div className={styles.valuesGrid}>
          {values.map((v) => (
            <div key={v.title} className={styles.valueCard}>
              <span className={styles.valueIcon}>{v.icon}</span>
              <h4 className={styles.valueTitle}>{v.title}</h4>
              <p className={styles.valueDesc}>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── CTA ── */}
    <section className={styles.cta}>
      <div className="container">
        <h2 className={styles.ctaTitle}>Ready to Work With Us?</h2>
        <p className={styles.ctaSub}>
          Let's discuss how Corelytix Technologies can help your business harness the power of data and technology.
        </p>
        <div className={styles.ctaActions}>
          <Link to="/contact" className="btn btn-primary">Contact Us Today →</Link>
          <a href="https://wa.me/233242969042" target="_blank" rel="noopener noreferrer" className={styles.waBtn}>
            <WhatsAppIcon /> Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>

  </div>
)

const WhatsAppIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
)

export default AboutPage
