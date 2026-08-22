// Phone shell + reusable UI primitives shared across all screens

function Phone({ children, theme = 'default', label, sublabel, scale = 1 }) {
  const t = window.THEMES[theme];
  const W = 280, H = 580;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: W * scale, height: H * scale,
        position: 'relative',
      }}>
        <div data-theme={theme} style={{
          width: W, height: H,
          borderRadius: 36, overflow: 'hidden',
          background: t.tokens['--bg'],
          color: t.tokens['--ink'],
          fontFamily: t.tokens['--font'],
          boxShadow: '0 30px 60px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.06)',
          position: 'relative',
          ...Object.fromEntries(Object.entries(t.tokens).map(([k,v]) => [k, v])),
          transform: `scale(${scale})`, transformOrigin: 'top left',
        }}>
          {/* status bar */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 28,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '8px 22px', zIndex: 10, fontSize: 10, fontWeight: 700,
          }}>
            <span>9:41</span>
            <span style={{ display: 'flex', gap: 4 }}>
              <span>•••</span><span>📶</span><span>🔋</span>
            </span>
          </div>
          {/* notch */}
          <div style={{
            position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)',
            width: 80, height: 22, borderRadius: 14, background: '#000', zIndex: 11,
          }} />
          {/* home indicator */}
          <div style={{
            position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)',
            width: 90, height: 4, borderRadius: 4, background: 'rgba(0,0,0,0.25)',
            zIndex: 11,
          }} />
          {/* content */}
          <div style={{ paddingTop: 28, height: '100%', boxSizing: 'border-box' }}>
            {children}
          </div>
        </div>
      </div>
      {label && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#1A1A1A', letterSpacing: -0.2 }}>{label}</div>
          {sublabel && <div style={{ fontSize: 10, color: '#6B6B6B', marginTop: 2, fontFamily: 'ui-monospace, monospace' }}>{sublabel}</div>}
        </div>
      )}
    </div>
  );
}

// Bottom nav (used by tab pages)
function BottomNav({ active = 'home' }) {
  const items = [
    { id: 'home', label: '홈', icon: '🏠' },
    { id: 'dict', label: '사전', icon: '📖' },
    { id: 'chat', label: '회화', icon: '💬' },
    { id: 'stats', label: '통계', icon: '📊' },
    { id: 'set', label: '설정', icon: '⚙️' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      paddingBottom: 14, paddingTop: 8,
      background: 'var(--surface)', borderTop: '1px solid var(--border)',
      display: 'flex', justifyContent: 'space-around',
    }}>
      {items.map(i => (
        <div key={i.id} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
          fontSize: 9, fontWeight: 700,
          color: active === i.id ? 'var(--primary)' : 'var(--ink3)',
        }}>
          <span style={{ fontSize: 16, opacity: active === i.id ? 1 : 0.6 }}>{i.icon}</span>
          {i.label}
        </div>
      ))}
    </div>
  );
}

// Header used in sub-pages
function PageHeader({ title, sub, back = true, theme }) {
  return (
    <div style={{
      padding: '8px 18px 12px',
      background: 'linear-gradient(180deg, var(--sakura-100) 0%, transparent 100%)',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      {back && <div style={{ width: 24, height: 24, borderRadius: 12, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, background: 'var(--surface)' }}>‹</div>}
      <div style={{ width: 20, height: 20, borderRadius: 10, background: 'var(--sakura-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>⚙</div>
      <div style={{
        fontSize: 13, fontWeight: 800, letterSpacing: -0.2,
        fontFamily: 'var(--font-display)',
      }}>{title}</div>
      {sub && <span style={{ fontSize: 10, color: 'var(--ink2)' }}>{sub}</span>}
    </div>
  );
}

// Primary button
function BigButton({ children, theme, variant = 'primary', size = 'md', icon }) {
  const styles = variant === 'primary' ? {
    background: 'var(--primary)', color: 'var(--primary-fg)',
    boxShadow: 'var(--shadow)',
  } : variant === 'outline' ? {
    background: 'var(--surface)', color: 'var(--ink)',
    border: '1px solid var(--border)',
  } : {
    background: 'var(--surface2)', color: 'var(--ink)',
  };
  return (
    <div style={{
      ...styles,
      borderRadius: 'var(--radius-lg)',
      padding: size === 'sm' ? '8px 14px' : '12px 14px',
      fontSize: size === 'sm' ? 11 : 13, fontWeight: 800, letterSpacing: -0.2,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      width: '100%', boxSizing: 'border-box',
    }}>
      {icon && <span style={{ fontSize: size === 'sm' ? 12 : 14 }}>{icon}</span>}
      {children}
    </div>
  );
}

// Card wrapper
function PCard({ children, padding = 14, style = {} }) {
  return (
    <div style={{
      background: 'var(--surface)',
      borderRadius: 'var(--radius-lg)',
      padding,
      boxShadow: 'var(--shadow-card)',
      border: '1px solid var(--border)',
      ...style,
    }}>{children}</div>
  );
}

// Mascot image (uses existing PNGs)
function Mascot({ id = 'kotaro', size = 60, bobbing = false }) {
  return (
    <img
      src={`assets/${id}.png`}
      alt={id}
      style={{
        width: size, height: size, objectFit: 'contain',
        animation: bobbing ? 'bob 2.6s ease-in-out infinite' : 'none',
        transformOrigin: 'center bottom',
      }}
    />
  );
}

// Speech bubble (with tail)
function Bubble({ children, side = 'left', small = false }) {
  return (
    <div style={{
      background: 'var(--surface)',
      borderRadius: small ? 12 : 14,
      padding: small ? '6px 10px' : '8px 12px',
      boxShadow: '0 3px 12px rgba(0,0,0,0.08)',
      fontSize: small ? 10 : 11, fontWeight: 600,
      color: 'var(--ink)',
      position: 'relative',
      maxWidth: 140,
    }}>
      {children}
      <div style={{
        position: 'absolute',
        ...(side === 'left'
          ? { left: -4, top: 14, borderRight: '6px solid var(--surface)', borderTop: '5px solid transparent', borderBottom: '5px solid transparent' }
          : { right: -4, top: 14, borderLeft: '6px solid var(--surface)', borderTop: '5px solid transparent', borderBottom: '5px solid transparent' }
        ),
      }}/>
    </div>
  );
}

// Progress bar
function ProgressBar({ pct = 0.4, height = 6 }) {
  return (
    <div style={{
      width: '100%', height, borderRadius: height,
      background: 'var(--surface2)', overflow: 'hidden', position: 'relative',
    }}>
      <div style={{
        position: 'absolute', inset: 0, background: 'var(--primary)',
        borderRadius: height, transform: `scaleX(${pct})`, transformOrigin: 'left',
      }}/>
    </div>
  );
}

// Section title (used between page sections in board)
function SectionTitle({ eyebrow, title, sub }) {
  return (
    <div style={{ maxWidth: 1280, margin: '64px auto 24px', padding: '0 40px' }}>
      <div style={{ fontSize: 11, letterSpacing: 3, color: '#E84992', fontWeight: 800 }}>{eyebrow}</div>
      <h2 style={{ margin: '6px 0 6px', fontSize: 28, fontWeight: 800, letterSpacing: -0.6, color: '#161616' }}>{title}</h2>
      {sub && <p style={{ margin: 0, color: '#6B6B6B', fontSize: 14, lineHeight: 1.6, maxWidth: 640 }}>{sub}</p>}
    </div>
  );
}

// Phone flow row (horizontal scrollable group)
function PhoneRow({ children, label, bg = 'transparent' }) {
  return (
    <div style={{ maxWidth: 1280, margin: '0 auto 28px', padding: '0 40px' }}>
      {label && (
        <div style={{
          display: 'inline-block', marginBottom: 18,
          fontSize: 10, letterSpacing: 2, color: '#6B6B6B', fontWeight: 800,
          padding: '4px 12px', borderRadius: 999, background: '#fff', border: '1px solid #EEE',
        }}>{label}</div>
      )}
      <div style={{
        display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 12,
        background: bg, padding: bg === 'transparent' ? 0 : 16, borderRadius: 24,
        alignItems: 'flex-start',
      }}>
        {children}
      </div>
    </div>
  );
}

// Arrow between phones in a flow
function FlowArrow() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', height: 580 * 0.78, paddingTop: 280,
      color: '#C5BCD0', flexShrink: 0,
    }}>
      <svg width="32" height="20" viewBox="0 0 32 20">
        <path d="M2 10 L26 10 M20 4 L26 10 L20 16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

Object.assign(window, { Phone, BottomNav, PageHeader, BigButton, PCard, Mascot, Bubble, ProgressBar, SectionTitle, PhoneRow, FlowArrow });
