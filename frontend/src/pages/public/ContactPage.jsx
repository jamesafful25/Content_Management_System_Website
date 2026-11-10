import { useState } from 'react'
import { useForm } from '../../hooks/useForm.js'
import styles from './ContactPage.module.css'

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { values, errors, setErrors, handleChange, reset } = useForm({
    name: '', email: '', phone: '', subject: '', message: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!values.name.trim()) newErrors.name = 'Name is required'
    if (!values.email.trim()) newErrors.email = 'Email is required'
    if (!values.message.trim()) newErrors.message = 'Message is required'
    if (Object.keys(newErrors).length) return setErrors(newErrors)

    setSubmitting(true)
    // Simulate sending — replace with real email API later
    await new Promise(r => setTimeout(r, 1200))
    setSubmitting(false)
    setSubmitted(true)
    reset()
  }

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className="container">
          <span className="badge">Get In Touch</span>
          <h1 className={styles.heroTitle}>Contact Corelytix Technologies</h1>
          <p className={styles.heroSub}>
            Have a story tip, partnership inquiry, or general question? We'd love to hear from you.
          </p>
        </div>
      </div>

      <div className="container">
        <div className={styles.layout}>

          {/* Contact form */}
          <div className={styles.formCard}>
            <h2 className={styles.cardTitle}>Send Us a Message</h2>
            <p className={styles.cardSub}>Fill in the form and we'll get back to you as soon as possible.</p>

            {submitted ? (
              <div className={styles.successBox}>
                <span className={styles.successIcon}>✅</span>
                <h3>Message Sent!</h3>
                <p>Thank you for reaching out. We'll respond to your message shortly.</p>
                <button className="btn btn-primary" onClick={() => setSubmitted(false)}>
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.row}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      className={`form-input ${errors.name ? 'error' : ''}`}
                      placeholder="Your full name"
                    />
                    {errors.name && <span className="form-error">{errors.name}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      placeholder="your@email.com"
                    />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                  </div>
                </div>

                <div className={styles.row}>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="+233 ..."
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input
                      name="subject"
                      value={values.subject}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="What is this about?"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea
                    name="message"
                    value={values.message}
                    onChange={handleChange}
                    className={`form-input ${errors.message ? 'error' : ''}`}
                    rows={6}
                    placeholder="Write your message here..."
                  />
                  {errors.message && <span className="form-error">{errors.message}</span>}
                </div>

                <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={submitting}>
                  {submitting ? 'Sending...' : 'Send Message →'}
                </button>
              </form>
            )}
          </div>

          {/* Contact details sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.infoCard}>
              <h3 className={styles.infoTitle}>Contact Information</h3>

              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>📞</div>
                <div>
                  <p className={styles.infoLabel}>Phone / WhatsApp</p>
                  <a href="tel:+233242969042" className={styles.infoValue}>+233 242 969 042</a>
                  <a
                    href="https://wa.me/233242969042"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.whatsappBtn}
                  >
                    <WhatsAppIcon /> Chat on WhatsApp
                  </a>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>✉️</div>
                <div>
                  <p className={styles.infoLabel}>Email Address</p>
                  <a href="mailto:james.afful47@gmail.com" className={styles.infoValue}>
                    james.afful47@gmail.com
                  </a>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>🏢</div>
                <div>
                  <p className={styles.infoLabel}>Company</p>
                  <p className={styles.infoValue}>Corelytix Technologies</p>
                </div>
              </div>
            </div>

            {/* Social media */}
            <div className={styles.socialCard}>
              <h3 className={styles.infoTitle}>Follow Us</h3>
              <div className={styles.socialLinks}>
                <a href="https://facebook.com/JamesAfful" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  <FacebookIcon />
                  <div>
                    <p className={styles.socialName}>Facebook</p>
                    <p className={styles.socialHandle}>James Afful</p>
                  </div>
                </a>
                <a href="https://instagram.com/afful25" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  <InstagramIcon />
                  <div>
                    <p className={styles.socialName}>Instagram</p>
                    <p className={styles.socialHandle}>@afful25</p>
                  </div>
                </a>
                <a href="https://x.com/mankind47" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  <XIcon />
                  <div>
                    <p className={styles.socialName}>X (Twitter)</p>
                    <p className={styles.socialHandle}>@mankind47</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)
const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)
const XIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)
const WhatsAppIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
)

export default ContactPage
