export default function Signup() {
  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", minHeight: '100vh', background: '#f3f4f6' }}>

      {/* Navbar */}
      <nav style={{ background: '#1B2F5E', padding: '0 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <img src="/logo.png" alt="RecoverJob" style={{ height: 44, width: 'auto', display: 'block' }}
              onError={e => { e.target.style.display = 'none'; }} />
          </a>
          <a href="/login" style={{ fontSize: '0.85rem', fontWeight: 500, color: '#93aed8', textDecoration: 'none' }}>
            Already have an account? <span style={{ color: '#fff' }}>Log in →</span>
          </a>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(160deg, #1B2F5E 0%, #243d75 100%)', padding: '72px 24px 80px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(76,175,41,0.15)', color: '#7ed659', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', padding: '6px 16px', borderRadius: 20, marginBottom: 28 }}>
            <span>✓</span> 30-Day Free Trial — No Credit Card Risk
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 900, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.8px', marginBottom: 20 }}>
            Never Miss Another<br /><span style={{ color: '#4CAF29' }}>Customer Call</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#93aed8', lineHeight: 1.7, marginBottom: 40, maxWidth: 540, margin: '0 auto 40px' }}>
            Automatic text responses for missed calls. Start your 30-day free trial today — set up in minutes.
          </p>
          <a
            href="https://buy.stripe.com/3cIdR2cZX514euXdA0bQY00"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: '#4CAF29', color: '#fff', fontWeight: 700,
              fontSize: '1.1rem', padding: '18px 44px', borderRadius: 12,
              textDecoration: 'none', boxShadow: '0 6px 24px rgba(76,175,41,0.4)',
              transition: 'all 0.18s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#3d9922'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#4CAF29'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Start Free Trial
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
          <p style={{ marginTop: 14, fontSize: '0.82rem', color: '#6b87b8' }}>
            $99/month after trial · Cancel anytime · No contracts
          </p>
        </div>
      </div>

      {/* Benefits */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          {[
            { icon: '⚡', title: 'Capture Every Lead', body: 'Instant automated text responses reach missed callers in under 15 seconds — before they call your competitor.' },
            { icon: '💼', title: 'Always Professional', body: 'Personalized follow-up texts go out on your behalf, even when you\'re on the job or unavailable.' },
            { icon: '📲', title: 'Simple Setup', body: 'Just forward your calls to your RecoverJob number. No complex software, no tech skills needed.' },
            { icon: '💰', title: '$99/Month Flat', body: 'Unlimited missed call texts, lead dashboard, and follow-ups. One price, no surprise fees.' },
          ].map(({ icon, title, body }) => (
            <div key={title} style={{ background: '#fff', borderRadius: 16, padding: '28px 24px', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '2rem', marginBottom: 14 }}>{icon}</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1B2F5E', marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: '0.9rem', color: '#6b7280', lineHeight: 1.6, margin: 0 }}>{body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Social proof strip */}
      <div style={{ background: '#fff', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', padding: '32px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
          {[
            { value: '15 sec', label: 'Average response time' },
            { value: '30–60%', label: 'More leads recovered' },
            { value: '30 days', label: 'Free trial, no risk' },
          ].map(({ value, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#1B2F5E', lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ background: '#1B2F5E', padding: '64px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: '#fff', marginBottom: 12, letterSpacing: '-0.4px' }}>
          Ready to stop losing jobs?
        </h2>
        <p style={{ color: '#93aed8', fontSize: '1rem', marginBottom: 32 }}>
          Join trades businesses using RecoverJob to win more work.
        </p>
        <a
          href="https://buy.stripe.com/3cIdR2cZX514euXdA0bQY00"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: '#4CAF29', color: '#fff', fontWeight: 700,
            fontSize: '1rem', padding: '16px 40px', borderRadius: 12,
            textDecoration: 'none', boxShadow: '0 4px 16px rgba(76,175,41,0.35)',
          }}
        >
          Start Your Free Trial Today →
        </a>
        <p style={{ marginTop: 14, fontSize: '0.8rem', color: '#4a6491' }}>
          $99/month after 30 days · Cancel anytime
        </p>
      </div>

      {/* Footer */}
      <div style={{ background: '#132347', padding: '20px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: '0.8rem', color: '#4a6491' }}>© 2026 RecoverJob. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 20 }}>
            {[['Privacy Policy', '/privacy-policy'], ['Terms', '/terms-and-conditions'], ['Login', '/login']].map(([label, href]) => (
              <a key={href} href={href} style={{ fontSize: '0.8rem', color: '#6b87b8', textDecoration: 'none' }}>{label}</a>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
