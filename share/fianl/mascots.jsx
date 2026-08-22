// Cute cartoon mascot SVGs — used throughout the onboarding flow

function Kotaro({ size = 96, bobbing = false }) {
  // 코타로 — Shiba inu, golden brown, red bandana
  return (
    <div style={{
      width: size, height: size, position: 'relative',
      animation: bobbing ? 'mascotBob 2.6s ease-in-out infinite' : 'none',
    }}>
      <svg viewBox="0 0 120 120" width={size} height={size} style={{ overflow: 'visible' }}>
        <defs>
          <radialGradient id="kotaroFur" cx="50%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#FDD9A8"/>
            <stop offset="55%" stopColor="#F4B36A"/>
            <stop offset="100%" stopColor="#D88E3F"/>
          </radialGradient>
          <linearGradient id="kotaroBand" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#FF5577"/>
            <stop offset="100%" stopColor="#E02851"/>
          </linearGradient>
        </defs>
        {/* shadow */}
        <ellipse cx="60" cy="112" rx="32" ry="4" fill="rgba(0,0,0,0.12)"/>
        {/* ears back */}
        <path d="M28 38 L36 14 L50 32 Z" fill="#C97734"/>
        <path d="M92 38 L84 14 L70 32 Z" fill="#C97734"/>
        {/* head */}
        <ellipse cx="60" cy="62" rx="40" ry="38" fill="url(#kotaroFur)"/>
        {/* face cream patch */}
        <path d="M60 56 Q42 64 44 90 Q60 100 76 90 Q78 64 60 56 Z" fill="#FFF6E5"/>
        {/* ears front */}
        <path d="M32 36 L40 16 L52 32 Z" fill="#E89C4D"/>
        <path d="M88 36 L80 16 L68 32 Z" fill="#E89C4D"/>
        <path d="M36 30 L42 22 L48 30 Z" fill="#FFDDB8"/>
        <path d="M84 30 L78 22 L72 30 Z" fill="#FFDDB8"/>
        {/* eyes (closed-smile look) */}
        <path d="M44 64 Q48 60 52 64" stroke="#222" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M68 64 Q72 60 76 64" stroke="#222" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        {/* cheek */}
        <circle cx="40" cy="74" r="4" fill="#FF9FB4" opacity="0.7"/>
        <circle cx="80" cy="74" r="4" fill="#FF9FB4" opacity="0.7"/>
        {/* nose */}
        <ellipse cx="60" cy="78" rx="4.5" ry="3.5" fill="#222"/>
        {/* mouth */}
        <path d="M60 82 L60 86 M60 86 Q54 90 50 86 M60 86 Q66 90 70 86" stroke="#222" strokeWidth="2" fill="none" strokeLinecap="round"/>
        {/* bandana */}
        <path d="M22 96 Q60 108 98 96 L96 104 Q60 116 24 104 Z" fill="url(#kotaroBand)"/>
        <circle cx="32" cy="100" r="1.6" fill="#fff" opacity="0.7"/>
        <circle cx="44" cy="103" r="1.6" fill="#fff" opacity="0.7"/>
        <circle cx="60" cy="105" r="1.6" fill="#fff" opacity="0.7"/>
        <circle cx="76" cy="103" r="1.6" fill="#fff" opacity="0.7"/>
        <circle cx="88" cy="100" r="1.6" fill="#fff" opacity="0.7"/>
      </svg>
    </div>
  );
}

function Yuki({ size = 96, bobbing = false }) {
  // 유키 — white arctic fox, blue ribbon
  return (
    <div style={{
      width: size, height: size, position: 'relative',
      animation: bobbing ? 'mascotBob 2.6s ease-in-out infinite' : 'none',
    }}>
      <svg viewBox="0 0 120 120" width={size} height={size} style={{ overflow: 'visible' }}>
        <defs>
          <radialGradient id="yukiFur" cx="50%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF"/>
            <stop offset="60%" stopColor="#EEF4FA"/>
            <stop offset="100%" stopColor="#C6D6E6"/>
          </radialGradient>
          <linearGradient id="yukiRib" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#7FB8E6"/>
            <stop offset="100%" stopColor="#3B7BC4"/>
          </linearGradient>
        </defs>
        <ellipse cx="60" cy="112" rx="32" ry="4" fill="rgba(0,0,0,0.12)"/>
        {/* ears */}
        <path d="M24 40 L34 10 L52 34 Z" fill="#D6E1EC"/>
        <path d="M96 40 L86 10 L68 34 Z" fill="#D6E1EC"/>
        {/* head */}
        <ellipse cx="60" cy="62" rx="40" ry="38" fill="url(#yukiFur)"/>
        {/* face inner */}
        <path d="M60 54 Q40 60 42 90 Q60 100 78 90 Q80 60 60 54 Z" fill="#FFFFFF"/>
        {/* ear inner */}
        <path d="M30 32 L36 18 L46 32 Z" fill="#9FB8D1"/>
        <path d="M90 32 L84 18 L74 32 Z" fill="#9FB8D1"/>
        {/* eyes — sparkle */}
        <ellipse cx="48" cy="66" rx="3.5" ry="5" fill="#1A2B40"/>
        <ellipse cx="72" cy="66" rx="3.5" ry="5" fill="#1A2B40"/>
        <circle cx="49.5" cy="64" r="1.4" fill="#fff"/>
        <circle cx="73.5" cy="64" r="1.4" fill="#fff"/>
        {/* cheek */}
        <circle cx="40" cy="74" r="3.5" fill="#FFC0D1" opacity="0.7"/>
        <circle cx="80" cy="74" r="3.5" fill="#FFC0D1" opacity="0.7"/>
        {/* nose */}
        <ellipse cx="60" cy="78" rx="3.5" ry="2.8" fill="#1A2B40"/>
        <path d="M60 80 Q60 85 56 86 M60 80 Q60 85 64 86" stroke="#1A2B40" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        {/* snowflake forehead */}
        <g transform="translate(60 44)" stroke="#7FB8E6" strokeWidth="1.2" strokeLinecap="round">
          <line x1="-4" y1="0" x2="4" y2="0"/>
          <line x1="0" y1="-4" x2="0" y2="4"/>
          <line x1="-3" y1="-3" x2="3" y2="3"/>
          <line x1="-3" y1="3" x2="3" y2="-3"/>
        </g>
        {/* ribbon */}
        <path d="M48 96 Q44 102 38 100 Q42 106 50 104 Z" fill="url(#yukiRib)"/>
        <path d="M72 96 Q76 102 82 100 Q78 106 70 104 Z" fill="url(#yukiRib)"/>
        <circle cx="60" cy="100" r="6" fill="url(#yukiRib)"/>
        <circle cx="60" cy="100" r="2" fill="#fff" opacity="0.5"/>
      </svg>
    </div>
  );
}

function Sora({ size = 96, bobbing = false }) {
  // 소라 — gray cat, pink bow
  return (
    <div style={{
      width: size, height: size, position: 'relative',
      animation: bobbing ? 'mascotBob 2.6s ease-in-out infinite' : 'none',
    }}>
      <svg viewBox="0 0 120 120" width={size} height={size} style={{ overflow: 'visible' }}>
        <defs>
          <radialGradient id="soraFur" cx="50%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#E4DEEA"/>
            <stop offset="60%" stopColor="#C5BCD0"/>
            <stop offset="100%" stopColor="#9A8FAE"/>
          </radialGradient>
          <linearGradient id="soraBow" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#FF8AB8"/>
            <stop offset="100%" stopColor="#E84992"/>
          </linearGradient>
        </defs>
        <ellipse cx="60" cy="112" rx="32" ry="4" fill="rgba(0,0,0,0.12)"/>
        {/* ears — pointy cat */}
        <path d="M24 44 L30 14 L50 38 Z" fill="#A89BBA"/>
        <path d="M96 44 L90 14 L70 38 Z" fill="#A89BBA"/>
        {/* head */}
        <ellipse cx="60" cy="62" rx="40" ry="38" fill="url(#soraFur)"/>
        {/* face cream patch */}
        <path d="M60 58 Q42 64 44 90 Q60 100 76 90 Q78 64 60 58 Z" fill="#F8F3FB"/>
        {/* ear inner pink */}
        <path d="M30 38 L34 22 L44 36 Z" fill="#FFAEC9"/>
        <path d="M90 38 L86 22 L76 36 Z" fill="#FFAEC9"/>
        {/* eyes — closed happy */}
        <path d="M44 68 Q48 64 52 68" stroke="#2A1F36" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M68 68 Q72 64 76 68" stroke="#2A1F36" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        {/* cheek */}
        <circle cx="40" cy="76" r="4" fill="#FFB6CE" opacity="0.8"/>
        <circle cx="80" cy="76" r="4" fill="#FFB6CE" opacity="0.8"/>
        {/* nose */}
        <path d="M57 78 L63 78 L60 82 Z" fill="#FF7AA8"/>
        {/* mouth */}
        <path d="M60 82 L60 85 M60 85 Q55 88 52 85 M60 85 Q65 88 68 85" stroke="#2A1F36" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        {/* whiskers */}
        <line x1="30" y1="78" x2="42" y2="78" stroke="#9A8FAE" strokeWidth="1" strokeLinecap="round"/>
        <line x1="30" y1="82" x2="42" y2="80" stroke="#9A8FAE" strokeWidth="1" strokeLinecap="round"/>
        <line x1="90" y1="78" x2="78" y2="78" stroke="#9A8FAE" strokeWidth="1" strokeLinecap="round"/>
        <line x1="90" y1="82" x2="78" y2="80" stroke="#9A8FAE" strokeWidth="1" strokeLinecap="round"/>
        {/* bow on left ear */}
        <g transform="translate(34 18)">
          <path d="M-8 0 Q-12 -6 -16 -3 Q-12 2 -8 0 Z" fill="url(#soraBow)"/>
          <path d="M8 0 Q12 -6 16 -3 Q12 2 8 0 Z" fill="url(#soraBow)"/>
          <circle cx="0" cy="0" r="4" fill="url(#soraBow)"/>
          <circle cx="0" cy="0" r="1.4" fill="#fff" opacity="0.6"/>
        </g>
      </svg>
    </div>
  );
}

const MASCOTS = {
  kotaro: { Comp: Kotaro, name: '코타로', jp: 'コタロウ', desc: '에너지 넘치는 친구', accent: '#F4B36A' },
  yuki: { Comp: Yuki, name: '유키', jp: 'ユキ', desc: '차분한 길잡이', accent: '#7FB8E6' },
  sora: { Comp: Sora, name: '소라', jp: 'ソラ', desc: '재치있는 동반자', accent: '#C5BCD0' },
};

Object.assign(window, { Kotaro, Yuki, Sora, MASCOTS });
