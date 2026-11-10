// CorelytixLogo.jsx — Professional SVG logo for Corelytix Technologies
const CorelytixLogo = ({ variant = 'full' }) => {
  if (variant === 'icon') {
    return (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="44" height="44" rx="10" fill="#0f172a" />
        <path d="M22 7 L35 14.5 L35 29.5 L22 37 L9 29.5 L9 14.5 Z" stroke="#e85d26" strokeWidth="2" fill="none" />
        <path d="M22 12 L31 17 L31 27 L22 32 L13 27 L13 17 Z" fill="#e85d26" opacity="0.12" />
        <path d="M27 17 C27 17 22.5 14.5 19 17 C15.5 19.5 15.5 24.5 19 27 C22.5 29.5 27 27 27 27"
          stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <circle cx="22" cy="7" r="2.2" fill="#e85d26" />
        <circle cx="35" cy="14.5" r="1.6" fill="#e85d26" opacity="0.7" />
        <circle cx="35" cy="29.5" r="1.6" fill="#e85d26" opacity="0.7" />
        <circle cx="22" cy="37" r="2.2" fill="#e85d26" />
        <circle cx="9" cy="29.5" r="1.6" fill="#e85d26" opacity="0.7" />
        <circle cx="9" cy="14.5" r="1.6" fill="#e85d26" opacity="0.7" />
      </svg>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      {/* Hexagonal icon mark */}
      <svg width="52" height="52" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="44" height="44" rx="10" fill="#0f172a" />
        <path d="M22 7 L35 14.5 L35 29.5 L22 37 L9 29.5 L9 14.5 Z" stroke="#e85d26" strokeWidth="2" fill="none" />
        <path d="M22 12 L31 17 L31 27 L22 32 L13 27 L13 17 Z" fill="#e85d26" opacity="0.12" />
        <path d="M27 17 C27 17 22.5 14.5 19 17 C15.5 19.5 15.5 24.5 19 27 C22.5 29.5 27 27 27 27"
          stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <circle cx="22" cy="7" r="2.2" fill="#e85d26" />
        <circle cx="35" cy="14.5" r="1.6" fill="#e85d26" opacity="0.7" />
        <circle cx="35" cy="29.5" r="1.6" fill="#e85d26" opacity="0.7" />
        <circle cx="22" cy="37" r="2.2" fill="#e85d26" />
        <circle cx="9" cy="29.5" r="1.6" fill="#e85d26" opacity="0.7" />
        <circle cx="9" cy="14.5" r="1.6" fill="#e85d26" opacity="0.7" />
      </svg>

      {/* Wordmark */}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1px' }}>
          <span style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '1.55rem',
            fontWeight: '900',
            color: '#0f172a',
            letterSpacing: '-0.03em',
          }}>
            Core
          </span>
          <span style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '1.55rem',
            fontWeight: '900',
            color: '#e85d26',
            letterSpacing: '-0.03em',
          }}>
            lytix
          </span>
        </div>
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '0.6rem',
          fontWeight: '700',
          color: '#94a3b8',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          marginTop: '2px',
        }}>
          Technologies
        </span>
      </div>
    </div>
  )
}

export default CorelytixLogo
