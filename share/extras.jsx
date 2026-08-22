// Intro carousel + error/boundary screens

// ─────────────────────── Intro carousel ───────────────────────
const INTRO_SLIDES = [
  {
    tag: 'DAILY',
    title: '매일 5분이면\n충분해요',
    body: '바쁜 하루에도 가볍게.\n5분 학습으로 일본어가 익숙해져요.',
    color: '#FF3366',
    art: (primary) => (
      <svg viewBox="0 0 200 200" width="200" height="200">
        <defs>
          <linearGradient id="dailyG" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={primary}/>
            <stop offset="100%" stopColor="#FF8FB1"/>
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="76" fill="none" stroke="#F2EAEC" strokeWidth="14"/>
        <circle cx="100" cy="100" r="76" fill="none" stroke="url(#dailyG)" strokeWidth="14"
          strokeDasharray="80 400" strokeLinecap="round" transform="rotate(-90 100 100)"
          style={{ animation: 'introRing 2.4s ease-in-out infinite' }}/>
        <text x="100" y="96" textAnchor="middle" fontSize="40" fontWeight="800" fill="#1A1A1A">5</text>
        <text x="100" y="124" textAnchor="middle" fontSize="14" fontWeight="700" fill="#6B6B6B" letterSpacing="2">MINUTES</text>
        {[0,1,2,3,4].map(i => (
          <circle key={i} cx={100 + Math.cos(i*1.25 - 1.5) * 76} cy={100 + Math.sin(i*1.25 - 1.5) * 76}
            r="4" fill={primary} style={{ animation: `introDot 2s ${i*0.15}s infinite` }}/>
        ))}
      </svg>
    ),
  },
  {
    tag: 'COMPANION',
    title: '마스코트와 함께\n즐겁게',
    body: '학습이 외롭지 않게.\n매일 응원해주는 친구가 있어요.',
    color: '#F4B36A',
    art: (primary, mascot) => {
      const M = MASCOTS[mascot].Comp;
      return (
        <div style={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            position: 'absolute', width: 180, height: 180, borderRadius: '50%',
            background: `radial-gradient(circle, ${primary}33 0%, transparent 70%)`,
            animation: 'haloPulse 3s ease-in-out infinite',
          }}/>
          <M size={160} bobbing/>
          {[
            { e: '✨', x: '12%', y: '20%', d: '0s' },
            { e: '💬', x: '78%', y: '24%', d: '.4s' },
            { e: '⭐', x: '14%', y: '74%', d: '.8s' },
            { e: '🌸', x: '80%', y: '72%', d: '1.2s' },
          ].map((s,i) => (
            <div key={i} style={{
              position: 'absolute', left: s.x, top: s.y, fontSize: 22,
              animation: `introSparkle 2s ${s.d} infinite`,
            }}>{s.e}</div>
          ))}
        </div>
      );
    },
  },
  {
    tag: 'ALL-IN-ONE',
    title: '단어 · 한자 · 회화\n한 번에',
    body: 'N5부터 N3까지 600+ 단어와\nAI 회화 튜터를 한 앱에서.',
    color: '#7FB8E6',
    art: (primary) => (
      <svg viewBox="0 0 220 200" width="220" height="200">
        <g style={{ animation: 'introCard1 3s ease-in-out infinite' }}>
          <rect x="22" y="48" width="80" height="104" rx="14" fill="#fff" stroke="#EEE" strokeWidth="1"/>
          <text x="62" y="98" textAnchor="middle" fontSize="34" fontWeight="800" fill="#1A1A1A" fontFamily="Hiragino Sans, Noto Sans JP">学</text>
          <text x="62" y="124" textAnchor="middle" fontSize="10" fill="#A3A3A3" fontWeight="700">한자 学</text>
        </g>
        <g style={{ animation: 'introCard2 3s ease-in-out infinite' }}>
          <rect x="74" y="36" width="80" height="104" rx="14" fill="#fff" stroke="#EEE" strokeWidth="1" filter="drop-shadow(0 4px 12px rgba(0,0,0,0.06))"/>
          <text x="114" y="84" textAnchor="middle" fontSize="22" fontWeight="800" fill="#1A1A1A" fontFamily="Hiragino Sans, Noto Sans JP">先生</text>
          <text x="114" y="110" textAnchor="middle" fontSize="11" fill="#6B6B6B" fontWeight="600">선생님</text>
          <rect x="92" y="118" width="44" height="14" rx="7" fill={primary} opacity="0.15"/>
          <text x="114" y="128" textAnchor="middle" fontSize="9" fill={primary} fontWeight="700">N5</text>
        </g>
        <g style={{ animation: 'introCard3 3s ease-in-out infinite' }}>
          <rect x="118" y="56" width="84" height="92" rx="14" fill="#161616"/>
          <circle cx="138" cy="86" r="10" fill={primary}/>
          <text x="138" y="90" textAnchor="middle" fontSize="11" fill="#fff">💬</text>
          <rect x="154" y="78" width="40" height="6" rx="3" fill="rgba(255,255,255,0.3)"/>
          <rect x="154" y="90" width="30" height="6" rx="3" fill="rgba(255,255,255,0.18)"/>
          <rect x="128" y="116" width="64" height="20" rx="10" fill="rgba(255,255,255,0.06)"/>
          <text x="160" y="129" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.7)" fontWeight="600">AI 튜터</text>
        </g>
      </svg>
    ),
  },
  {
    tag: 'STREAK',
    title: '연속 학습으로\n습관이 돼요',
    body: '하루도 빼먹지 않으면\n불꽃이 점점 더 커져요. 🔥',
    color: '#FF8A4D',
    art: (primary) => (
      <svg viewBox="0 0 220 200" width="220" height="200">
        <defs>
          <linearGradient id="flameG" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#FFD400"/>
            <stop offset="50%" stopColor="#FF8A4D"/>
            <stop offset="100%" stopColor="#FF3366"/>
          </linearGradient>
        </defs>
        <g style={{ transformOrigin: '110px 100px', animation: 'flameFlicker 1.8s ease-in-out infinite' }}>
          <path d="M110 30 C 130 60 150 70 145 110 C 140 150 120 160 110 165 C 100 160 80 150 75 110 C 70 70 90 60 110 30 Z" fill="url(#flameG)"/>
          <path d="M110 70 C 122 90 130 100 125 125 C 120 145 115 152 110 155 C 105 152 100 145 95 125 C 90 100 98 90 110 70 Z" fill="#FFF" opacity="0.5"/>
        </g>
        {[1,2,3,4,5,6,7].map((d,i) => (
          <g key={i}>
            <rect x={18 + i*26} y="172" width="20" height="20" rx="6" fill={i < 5 ? primary : '#EEE'}/>
            <text x={28 + i*26} y="186" textAnchor="middle" fontSize="9" fontWeight="700" fill={i < 5 ? '#fff' : '#A3A3A3'}>{d}</text>
          </g>
        ))}
      </svg>
    ),
  },
  {
    tag: 'INSIGHTS',
    title: '약점을 알려주는\n맞춤 통계',
    body: '내가 자주 틀리는 단어와 패턴을\n자동으로 분석해서 보여줘요.',
    color: '#2EBD6B',
    art: (primary) => (
      <svg viewBox="0 0 220 200" width="220" height="200">
        <rect x="20" y="30" width="180" height="140" rx="16" fill="#fff" stroke="#EEE" strokeWidth="1"/>
        <text x="34" y="54" fontSize="10" fontWeight="800" fill="#A3A3A3" letterSpacing="1.5">WEEKLY XP</text>
        <g>
          {[42, 68, 30, 90, 55, 78, 100].map((h,i) => (
            <g key={i}>
              <rect x={36 + i*22} y={150 - h} width="14" height={h} rx="4"
                fill={i === 6 ? primary : i === 3 ? '#FFB400' : '#FFD0D8'}
                style={{ transformOrigin: `${43 + i*22}px 150px`, animation: `barGrow 1.4s ${i*0.08}s ease-out both` }}/>
              <text x={43 + i*22} y="166" textAnchor="middle" fontSize="8" fill="#A3A3A3">{['M','T','W','T','F','S','S'][i]}</text>
            </g>
          ))}
        </g>
        <circle cx="172" cy="60" r="20" fill={primary} opacity="0.12"/>
        <text x="172" y="58" textAnchor="middle" fontSize="14" fontWeight="800" fill={primary}>+34%</text>
        <text x="172" y="72" textAnchor="middle" fontSize="7" fill={primary} fontWeight="700">vs 지난주</text>
      </svg>
    ),
  },
];

function IntroScreen({ go, tweaks }) {
  const [idx, setIdx] = React.useState(0);
  const [drag, setDrag] = React.useState(0);
  const startX = React.useRef(null);
  const cur = INTRO_SLIDES[idx];

  function next() {
    if (idx + 1 < INTRO_SLIDES.length) setIdx(idx + 1);
    else go('auth');
  }
  function prev() { if (idx > 0) setIdx(idx - 1); }

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: '#fff', position: 'relative', overflow: 'hidden',
      animation: `screenIn ${0.5/tweaks.speed}s ease-out`,
    }}>
      {/* top bar */}
      <div style={{
        position: 'absolute', top: 56, left: 0, right: 0, zIndex: 5,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px',
      }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {INTRO_SLIDES.map((_, i) => (
            <div key={i} style={{
              width: i === idx ? 22 : 6, height: 6, borderRadius: 3,
              background: i === idx ? tweaks.primary : '#E5E5E5',
              transition: 'all .35s',
            }}/>
          ))}
        </div>
        <button onClick={() => go('auth')} style={{
          background: 'none', border: 'none', fontSize: 13, color: '#6B6B6B',
          fontWeight: 600, cursor: 'pointer',
        }}>건너뛰기</button>
      </div>

      {/* swipeable slide */}
      <div
        onTouchStart={e => { startX.current = e.touches[0].clientX; }}
        onTouchMove={e => { if (startX.current != null) setDrag(e.touches[0].clientX - startX.current); }}
        onTouchEnd={() => {
          if (drag < -50) next();
          else if (drag > 50) prev();
          setDrag(0); startX.current = null;
        }}
        onMouseDown={e => { startX.current = e.clientX; }}
        onMouseMove={e => { if (startX.current != null) setDrag(e.clientX - startX.current); }}
        onMouseUp={() => { if (drag < -50) next(); else if (drag > 50) prev(); setDrag(0); startX.current = null; }}
        onMouseLeave={() => { setDrag(0); startX.current = null; }}
        style={{
          flex: 1, paddingTop: 110, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', userSelect: 'none', cursor: 'grab',
        }}>
        <div key={idx} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          transform: `translateX(${drag * 0.4}px)`,
          transition: drag === 0 ? 'transform .3s' : 'none',
          animation: `introSlide ${0.55/tweaks.speed}s cubic-bezier(.2,.7,.2,1.05)`,
        }}>
          <div style={{ marginBottom: 36 }}>{cur.art(tweaks.primary, tweaks.mascot)}</div>
          <div style={{
            fontSize: 11, letterSpacing: 3, color: cur.color, fontWeight: 800,
          }}>{cur.tag}</div>
          <div style={{
            marginTop: 10, fontSize: 28, fontWeight: 800, letterSpacing: -0.6,
            textAlign: 'center', lineHeight: 1.25, whiteSpace: 'pre-line',
          }}>{cur.title}</div>
          <div style={{
            marginTop: 14, fontSize: 14, color: '#6B6B6B',
            textAlign: 'center', lineHeight: 1.6, whiteSpace: 'pre-line', maxWidth: 280,
          }}>{cur.body}</div>
        </div>
      </div>

      <div style={{ padding: '0 28px 36px' }}>
        <BigButton primary={tweaks.primary} onClick={next}>
          {idx + 1 < INTRO_SLIDES.length ? '다음' : '시작하기'}
        </BigButton>
      </div>
    </div>
  );
}

// ─────────────────────── Error / boundary screens ───────────────────────
const ERRORS = {
  network: {
    tag: 'NETWORK ERROR',
    title: '인터넷 연결을\n확인해주세요',
    body: '연결이 끊어졌어요.\nWi-Fi 또는 데이터를 확인하고 다시 시도해보세요.',
    primaryAction: '다시 시도',
    secondaryAction: '오프라인으로 사용',
    color: '#FF8A4D',
    art: (
      <svg viewBox="0 0 160 160" width="160" height="160">
        <circle cx="80" cy="110" r="6" fill="#FF8A4D"/>
        <path d="M50 86 Q80 64 110 86" stroke="#FF8A4D" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.6"/>
        <path d="M32 66 Q80 24 128 66" stroke="#FF8A4D" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.35"/>
        <path d="M14 46 Q80 -10 146 46" stroke="#FF8A4D" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.18"/>
        <line x1="20" y1="20" x2="140" y2="140" stroke="#FF4D4D" strokeWidth="6" strokeLinecap="round"/>
      </svg>
    ),
  },
  server: {
    tag: 'SERVER ERROR',
    title: '잠시 후 다시\n시도해주세요',
    body: '서버에 일시적인 문제가 발생했어요.\n계속되면 고객센터로 문의해주세요.',
    primaryAction: '다시 시도',
    secondaryAction: '고객센터 문의',
    color: '#FF4D6D',
    art: (
      <svg viewBox="0 0 160 160" width="160" height="160">
        <rect x="32" y="48" width="96" height="22" rx="6" fill="#FFE5EA" stroke="#FF4D6D" strokeWidth="2"/>
        <circle cx="44" cy="59" r="3" fill="#FF4D6D"/>
        <rect x="32" y="74" width="96" height="22" rx="6" fill="#FFD0D8" stroke="#FF4D6D" strokeWidth="2"/>
        <circle cx="44" cy="85" r="3" fill="#FF4D6D"/>
        <rect x="32" y="100" width="96" height="22" rx="6" fill="#FFB0BC" stroke="#FF4D6D" strokeWidth="2"/>
        <text x="80" y="112" textAnchor="middle" fontSize="14" fontWeight="800" fill="#fff">500</text>
        <path d="M118 30 L138 50 M138 30 L118 50" stroke="#FF4D6D" strokeWidth="3" strokeLinecap="round"
          style={{ animation: 'errBounce 1.4s ease-in-out infinite' }}/>
      </svg>
    ),
  },
  permission: {
    tag: 'PERMISSION',
    title: '알림 권한이\n필요해요',
    body: '학습 알림을 받으려면 설정 > 알림에서\n권한을 허용해주세요.',
    primaryAction: '설정으로 이동',
    secondaryAction: '나중에',
    color: '#7FB8E6',
    art: (
      <svg viewBox="0 0 160 160" width="160" height="160">
        <path d="M80 30 C 60 30 50 50 50 70 L 50 100 L 40 110 L 120 110 L 110 100 L 110 70 C 110 50 100 30 80 30 Z"
          fill="#EAF3FB" stroke="#7FB8E6" strokeWidth="3"/>
        <circle cx="80" cy="120" r="8" fill="#7FB8E6"/>
        <circle cx="115" cy="50" r="18" fill="#FF4D6D"/>
        <text x="115" y="56" textAnchor="middle" fontSize="20" fontWeight="800" fill="#fff">!</text>
      </svg>
    ),
  },
  maintenance: {
    tag: 'MAINTENANCE',
    title: '잠시 점검 중이에요',
    body: '5월 12일 오전 2시 ~ 4시까지\n서비스 안정화 작업을 진행해요.',
    primaryAction: '확인',
    secondaryAction: '공지 보기',
    color: '#A89BBA',
    art: (
      <svg viewBox="0 0 160 160" width="160" height="160">
        <g style={{ transformOrigin: '80px 80px', animation: 'gearSpin 6s linear infinite' }}>
          <path d="M80 30 L86 30 L88 40 L96 42 L102 36 L108 42 L102 50 L106 58 L116 60 L116 66 L106 68 L102 76 L108 84 L102 90 L94 84 L86 86 L84 96 L78 96 L76 86 L68 84 L62 90 L56 84 L62 76 L58 68 L48 66 L48 60 L58 58 L62 50 L56 42 L62 36 L70 42 L78 40 Z"
            fill="#E4DEEA" stroke="#A89BBA" strokeWidth="2"/>
          <circle cx="82" cy="63" r="10" fill="#fff" stroke="#A89BBA" strokeWidth="2"/>
        </g>
        <g style={{ transformOrigin: '116px 116px', animation: 'gearSpin 4s linear infinite reverse' }}>
          <circle cx="116" cy="116" r="20" fill="#D6CEDF" stroke="#A89BBA" strokeWidth="2"/>
          <circle cx="116" cy="116" r="6" fill="#fff"/>
        </g>
      </svg>
    ),
  },
  update: {
    tag: 'UPDATE REQUIRED',
    title: '새로운 버전이\n나왔어요',
    body: 'v2.4.0에서 성능과 안정성이\n크게 개선되었어요.',
    primaryAction: '업데이트',
    secondaryAction: '나중에',
    color: '#2EBD6B',
    art: (
      <svg viewBox="0 0 160 160" width="160" height="160">
        <circle cx="80" cy="80" r="60" fill="#E8F8EF"/>
        <path d="M80 40 L80 100 M62 82 L80 100 L98 82" stroke="#2EBD6B" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
          style={{ animation: 'updateArrow 1.8s ease-in-out infinite' }}/>
        <line x1="55" y1="116" x2="105" y2="116" stroke="#2EBD6B" strokeWidth="6" strokeLinecap="round"/>
      </svg>
    ),
  },
  notfound: {
    tag: '404',
    title: '페이지를 찾을 수\n없어요',
    body: '주소가 잘못되었거나 삭제된 페이지예요.\n홈으로 돌아가서 다시 시도해주세요.',
    primaryAction: '홈으로',
    secondaryAction: '도움말',
    color: '#1A1A1A',
    art: (
      <svg viewBox="0 0 200 160" width="200" height="160">
        <text x="100" y="110" textAnchor="middle" fontSize="92" fontWeight="900"
          fill="#1A1A1A" letterSpacing="-4">404</text>
        <circle cx="71" cy="84" r="10" fill="#FF3366"/>
        <circle cx="129" cy="84" r="10" fill="#FF3366"/>
        <path d="M80 124 Q100 110 120 124" stroke="#1A1A1A" strokeWidth="4" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },
};

function ErrorScreen({ go, tweaks, kind = 'network' }) {
  const e = ERRORS[kind] || ERRORS.network;
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: '#fff', paddingTop: 90,
      animation: `screenIn ${0.5/tweaks.speed}s ease-out`,
    }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 28px' }}>
        <div style={{ marginBottom: 24, animation: 'badgePop 0.7s cubic-bezier(.2,1.5,.3,1)' }}>{e.art}</div>
        <div style={{ fontSize: 11, letterSpacing: 3, color: e.color, fontWeight: 800 }}>{e.tag}</div>
        <div style={{
          marginTop: 10, fontSize: 26, fontWeight: 800, letterSpacing: -0.5,
          textAlign: 'center', lineHeight: 1.25, whiteSpace: 'pre-line',
        }}>{e.title}</div>
        <div style={{
          marginTop: 12, fontSize: 14, color: '#6B6B6B',
          textAlign: 'center', lineHeight: 1.6, whiteSpace: 'pre-line', maxWidth: 290,
        }}>{e.body}</div>
      </div>
      <div style={{ padding: '0 28px 36px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <BigButton primary={tweaks.primary} onClick={() => go('home')}>{e.primaryAction}</BigButton>
        <button onClick={() => go('home')} style={{
          background: 'none', border: 'none', fontSize: 14, color: '#6B6B6B',
          padding: 12, cursor: 'pointer', fontWeight: 500,
        }}>{e.secondaryAction}</button>
      </div>
    </div>
  );
}

const ErrNetwork    = (p) => <ErrorScreen {...p} kind="network"/>;
const ErrServer     = (p) => <ErrorScreen {...p} kind="server"/>;
const ErrPermission = (p) => <ErrorScreen {...p} kind="permission"/>;
const ErrMaintenance= (p) => <ErrorScreen {...p} kind="maintenance"/>;
const ErrUpdate     = (p) => <ErrorScreen {...p} kind="update"/>;
const ErrNotFound   = (p) => <ErrorScreen {...p} kind="notfound"/>;

Object.assign(window, {
  IntroScreen, ErrorScreen,
  ErrNetwork, ErrServer, ErrPermission, ErrMaintenance, ErrUpdate, ErrNotFound,
});
