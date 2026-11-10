import { useParams, Link } from 'react-router-dom'
import styles from './ServicesPage.module.css'

const servicesData = {
  'business-intelligence': {
    icon: '📊',
    title: 'Business Intelligence',
    tagline: 'Turn your data into your greatest competitive advantage.',
    description: 'Our Business Intelligence solutions help organizations collect, analyze, and visualize data to make faster, smarter decisions. We design custom dashboards, KPI tracking systems, and automated reports that give you a real-time view of your business performance.',
    features: ['Custom Dashboards & Reports', 'KPI Monitoring Systems', 'Data Visualization', 'Executive Reporting', 'Sales & Revenue Analytics', 'Performance Benchmarking'],
  },
  'cloud-computing': {
    icon: '☁️',
    title: 'Cloud Computing',
    tagline: 'Scale without limits. Pay for what you use.',
    description: 'We help businesses migrate to, optimize, and manage cloud environments on AWS, Azure, and Google Cloud. From infrastructure design to cost optimization, our cloud engineers ensure your systems are secure, scalable, and always available.',
    features: ['Cloud Migration Strategy', 'AWS / Azure / GCP Setup', 'Cost Optimization', 'Cloud Security', 'Disaster Recovery', 'Serverless Architecture'],
  },
  'cyber-security': {
    icon: '🔐',
    title: 'Cyber Security',
    tagline: 'Your digital assets deserve world-class protection.',
    description: 'We identify vulnerabilities before attackers do. Our cybersecurity team conducts penetration testing, security audits, and implements defense systems that keep your data, infrastructure, and reputation safe.',
    features: ['Penetration Testing', 'Security Audits', 'Threat Monitoring', 'Incident Response', 'Compliance & Governance', 'Employee Security Training'],
  },
  'data-engineering': {
    icon: '🗄️',
    title: 'Data Engineering',
    tagline: 'Clean, reliable data — the foundation of everything.',
    description: 'We build the pipes that your data flows through. From ETL pipelines to data warehouses and lakehouse architectures, we ensure your data is collected, cleaned, transformed, and ready for analysis at any scale.',
    features: ['ETL / ELT Pipelines', 'Data Warehousing', 'Real-time Data Streaming', 'Data Lake Architecture', 'Database Optimization', 'API Data Integrations'],
  },
  'data-science': {
    icon: '🤖',
    title: 'Data Science',
    tagline: 'Predict the future. Automate the present.',
    description: 'Our data scientists build machine learning models and AI solutions that help you predict customer behavior, detect anomalies, automate decisions, and uncover opportunities hidden in your data.',
    features: ['Machine Learning Models', 'Predictive Analytics', 'NLP & Text Analysis', 'Computer Vision', 'Recommendation Systems', 'AI Model Deployment'],
  },
  'devops-engineering': {
    icon: '⚙️',
    title: 'DevOps Engineering',
    tagline: 'Ship faster. Break less. Recover instantly.',
    description: 'We bridge the gap between development and operations by implementing CI/CD pipelines, infrastructure as code, and automated testing frameworks that accelerate your software delivery lifecycle.',
    features: ['CI/CD Pipeline Setup', 'Infrastructure as Code', 'Docker & Kubernetes', 'Automated Testing', 'Monitoring & Alerting', 'Release Management'],
  },
  'software-engineering': {
    icon: '💻',
    title: 'Software Engineering',
    tagline: 'Custom software built to solve your exact problem.',
    description: 'We design and build web applications, APIs, and enterprise software tailored to your business processes. Every line of code is written with scalability, maintainability, and user experience in mind.',
    features: ['Web Application Development', 'REST & GraphQL APIs', 'Mobile Applications', 'System Architecture', 'Legacy System Modernization', 'Technical Consulting'],
  },
}

const ServicesPage = () => {
  const { slug } = useParams()
  const service = servicesData[slug]

  if (!service) {
    return (
      <div className={styles.notFound}>
        <h2>Service not found</h2>
        <Link to="/about#services" className="btn btn-primary">View All Services</Link>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className="container">
          <Link to="/about#services" className={styles.backLink}>← All Services</Link>
          <div className={styles.heroIcon}>{service.icon}</div>
          <h1 className={styles.heroTitle}>{service.title}</h1>
          <p className={styles.heroTagline}>{service.tagline}</p>
        </div>
      </div>

      <div className="container">
        <div className={styles.layout}>
          {/* Main content */}
          <div className={styles.main}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Overview</h2>
              <p className={styles.desc}>{service.description}</p>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>What's Included</h2>
              <ul className={styles.featureList}>
                {service.features.map(f => (
                  <li key={f} className={styles.featureItem}>
                    <span className={styles.check}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar CTA */}
          <div className={styles.sidebar}>
            <div className={styles.ctaCard}>
              <h3 className={styles.ctaTitle}>Interested in {service.title}?</h3>
              <p className={styles.ctaText}>Let's discuss how we can tailor this service to your specific needs.</p>
              <Link to="/contact" className={`btn btn-primary ${styles.ctaBtn}`}>Get a Free Consultation</Link>
              <a
                href="https://wa.me/233242969042"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.waBtn}
              >
                💬 Chat on WhatsApp
              </a>
            </div>

            <div className={styles.otherServices}>
              <h4 className={styles.otherTitle}>Other Services</h4>
              {Object.entries(servicesData)
                .filter(([s]) => s !== slug)
                .map(([s, data]) => (
                  <Link key={s} to={`/services/${s}`} className={styles.otherItem}>
                    <span>{data.icon}</span>
                    <span>{data.title}</span>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServicesPage
