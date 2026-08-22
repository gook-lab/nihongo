// Remaining pages — error/system, content extras, account & legal

// ─── ERROR SCREENS (5) ───
function makeErrorScreen({ tag, title, body, primary, secondary, accent, art }) {
  return function ErrorScreen() {
    return (
      <div style={{
        height: '100%', display: 'flex', flexDirection: 'column',
        padding: '40px 18px 24px', boxSizing: 'border-box',
        background: 'var(--bg)',
      }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 12 }}>
          <div>{art}</div>
          <div style={{ fontSize: 10, letterSpacing: 3, color: accent, fontWeight: 800 }}>{tag}</div>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.4, lineHeight: 1.2, whiteSpace: 'pre-line', fontFamily: 'var(--font-display)' }}>{title}</div>
          <div style={{ fontSize: 11, color: 'var(--ink2)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{body}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <BigButton variant="primary" size="sm">{primary}</BigButton>
          <div style={{ fontSize: 10, color: 'var(--ink2)', textAlign: 'center', padding: 8, fontWeight: 600 }}>{secondary}</div>
        </div>
      </div>
    );
  };
}

const NetworkErrorScreen = makeErrorScreen({
  tag: 'NETWORK ERROR',
  title: '인터넷 연결을\n확인해주세요',
  body: '연결이 끊어졌어요.\nWi-Fi 또는 데이터를 확인해주세요.',
  primary: '다시 시도', secondary: '오프라인으로 사용',
  accent: '#FF8A4D',
  art: (
    <svg width="80" height="80" viewBox="0 0 160 160">
      <circle cx="80" cy="110" r="6" fill="#FF8A4D"/>
      <path d="M50 86 Q80 64 110 86" stroke="#FF8A4D" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.6"/>
      <path d="M32 66 Q80 24 128 66" stroke="#FF8A4D" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.35"/>
      <path d="M14 46 Q80 -10 146 46" stroke="#FF8A4D" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.18"/>
      <line x1="20" y1="20" x2="140" y2="140" stroke="#FF4D4D" strokeWidth="6" strokeLinecap="round"/>
    </svg>
  ),
});

const ServerErrorScreen = makeErrorScreen({
  tag: 'SERVER ERROR · 500',
  title: '잠시 후 다시\n시도해주세요',
  body: '서버에 일시적인 문제가 있어요.\n계속되면 고객센터로 문의해주세요.',
  primary: '다시 시도', secondary: '고객센터 문의',
  accent: '#FF4D6D',
  art: (
    <svg width="80" height="80" viewBox="0 0 160 160">
      <rect x="32" y="48" width="96" height="22" rx="6" fill="#FFE5EA" stroke="#FF4D6D" strokeWidth="2"/>
      <rect x="32" y="74" width="96" height="22" rx="6" fill="#FFD0D8" stroke="#FF4D6D" strokeWidth="2"/>
      <rect x="32" y="100" width="96" height="22" rx="6" fill="#FFB0BC" stroke="#FF4D6D" strokeWidth="2"/>
      <text x="80" y="116" textAnchor="middle" fontSize="14" fontWeight="800" fill="#fff">500</text>
    </svg>
  ),
});

const PermissionErrorScreen = makeErrorScreen({
  tag: 'PERMISSION',
  title: '알림 권한이\n필요해요',
  body: '학습 알림을 받으려면\n설정에서 권한을 허용해주세요.',
  primary: '설정으로 이동', secondary: '나중에',
  accent: '#7FB8E6',
  art: (
    <svg width="80" height="80" viewBox="0 0 160 160">
      <path d="M80 30 C 60 30 50 50 50 70 L 50 100 L 40 110 L 120 110 L 110 100 L 110 70 C 110 50 100 30 80 30 Z" fill="#EAF3FB" stroke="#7FB8E6" strokeWidth="3"/>
      <circle cx="80" cy="120" r="8" fill="#7FB8E6"/>
      <circle cx="115" cy="50" r="18" fill="#FF4D6D"/>
      <text x="115" y="58" textAnchor="middle" fontSize="22" fontWeight="900" fill="#fff">!</text>
    </svg>
  ),
});

const MaintenanceScreen = makeErrorScreen({
  tag: 'MAINTENANCE',
  title: '잠시 점검 중이에요',
  body: '5월 16일 오전 2시 ~ 4시\n서비스 안정화 작업',
  primary: '확인', secondary: '공지 보기',
  accent: '#A89BBA',
  art: (
    <svg width="80" height="80" viewBox="0 0 160 160">
      <path d="M80 30 L86 30 L88 40 L96 42 L102 36 L108 42 L102 50 L106 58 L116 60 L116 66 L106 68 L102 76 L108 84 L102 90 L94 84 L86 86 L84 96 L78 96 L76 86 L68 84 L62 90 L56 84 L62 76 L58 68 L48 66 L48 60 L58 58 L62 50 L56 42 L62 36 L70 42 L78 40 Z" fill="#E4DEEA" stroke="#A89BBA" strokeWidth="2"/>
      <circle cx="82" cy="63" r="10" fill="#fff" stroke="#A89BBA" strokeWidth="2"/>
    </svg>
  ),
});

const UpdateScreen = makeErrorScreen({
  tag: 'UPDATE',
  title: '새로운 버전이\n나왔어요',
  body: 'v2.4.0에서 성능과 안정성이\n크게 개선되었어요.',
  primary: '업데이트', secondary: '나중에',
  accent: '#2EBD6B',
  art: (
    <svg width="80" height="80" viewBox="0 0 160 160">
      <circle cx="80" cy="80" r="60" fill="#E8F8EF"/>
      <path d="M80 40 L80 100 M62 82 L80 100 L98 82" stroke="#2EBD6B" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <line x1="55" y1="116" x2="105" y2="116" stroke="#2EBD6B" strokeWidth="6" strokeLinecap="round"/>
    </svg>
  ),
});

const NotFoundScreen = makeErrorScreen({
  tag: '404',
  title: '페이지를 찾을 수\n없어요',
  body: '주소가 잘못되었거나\n삭제된 페이지예요.',
  primary: '홈으로', secondary: '도움말',
  accent: '#1A1A1A',
  art: (
    <svg width="120" height="80" viewBox="0 0 200 160">
      <text x="100" y="110" textAnchor="middle" fontSize="78" fontWeight="900" fill="#1A1A1A" letterSpacing="-3">404</text>
      <circle cx="71" cy="84" r="8" fill="var(--primary)"/>
      <circle cx="129" cy="84" r="8" fill="var(--primary)"/>
      <path d="M80 124 Q100 110 120 124" stroke="#1A1A1A" strokeWidth="4" strokeLinecap="round" fill="none"/>
    </svg>
  ),
});

// ─── AI READING ───
function AIReadingScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="AI 맞춤 글" sub="관심사로 직접 생성"/>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 14px 16px' }}>
        <div style={{ fontSize: 9, color: 'var(--ink3)', fontWeight: 800, letterSpacing: 1 }}>관심사 (복수 선택)</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
          {[
            { l: '🍣 음식', a: true },
            { l: '🌸 일본 여행', a: true },
            { l: '🎌 문화' },
            { l: '🎬 영화' },
            { l: '🎵 음악', a: true },
            { l: '⚾ 스포츠' },
            { l: '💼 비즈니스' },
          ].map((c, i) => (
            <div key={i} style={{
              padding: '5px 10px', borderRadius: 999,
              background: c.a ? 'var(--primary)' : 'var(--surface)',
              color: c.a ? 'var(--primary-fg)' : 'var(--ink2)',
              border: c.a ? 'none' : '1px solid var(--border)',
              fontSize: 10, fontWeight: 700,
            }}>{c.l}</div>
          ))}
        </div>

        <div style={{ marginTop: 14, fontSize: 9, color: 'var(--ink3)', fontWeight: 800, letterSpacing: 1 }}>난이도</div>
        <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
          {['N5', 'N4', 'N3'].map((l, i) => (
            <div key={l} style={{
              flex: 1, padding: '5px 8px', borderRadius: 'var(--radius)',
              background: i === 1 ? 'var(--primary)' : 'var(--surface)',
              color: i === 1 ? 'var(--primary-fg)' : 'var(--ink2)',
              border: i === 1 ? 'none' : '1px solid var(--border)',
              textAlign: 'center', fontSize: 10, fontWeight: 800,
            }}>{l}</div>
          ))}
        </div>

        <div style={{ marginTop: 14, fontSize: 9, color: 'var(--ink3)', fontWeight: 800, letterSpacing: 1 }}>길이</div>
        <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
          {['짧게', '보통', '길게'].map((l, i) => (
            <div key={l} style={{
              flex: 1, padding: '5px 8px', borderRadius: 'var(--radius)',
              background: i === 1 ? 'var(--primary)' : 'var(--surface)',
              color: i === 1 ? 'var(--primary-fg)' : 'var(--ink2)',
              border: i === 1 ? 'none' : '1px solid var(--border)',
              textAlign: 'center', fontSize: 10, fontWeight: 700,
            }}>{l}</div>
          ))}
        </div>

        <div style={{ marginTop: 14, padding: 10, borderRadius: 'var(--radius)', background: 'var(--surface2)' }}>
          <div style={{ fontSize: 9, color: 'var(--ink3)', fontWeight: 800, letterSpacing: 1 }}>예시 주제</div>
          <div style={{ marginTop: 2, fontSize: 11, fontWeight: 700, fontFamily: '"Hiragino Sans"' }}>東京のラーメン店巡り</div>
          <div style={{ fontSize: 9, color: 'var(--ink2)' }}>도쿄 라멘 가게 여행</div>
        </div>

        <div style={{ marginTop: 14 }}>
          <BigButton variant="primary" icon="✨">AI로 생성하기</BigButton>
        </div>
      </div>
    </div>
  );
}

// ─── SONG DETAIL ───
function SongDetailScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        padding: '40px 16px 14px',
        background: 'linear-gradient(180deg, #FFD9E2 0%, var(--bg) 100%)',
      }}>
        <div style={{ width: 20, height: 20, borderRadius: 10, background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, marginBottom: 12 }}>‹</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 70, height: 70, borderRadius: 14,
            background: 'linear-gradient(135deg, #FFD9E2, #FFB6CE)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30,
          }}>🌸</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, fontFamily: '"Hiragino Sans"' }}>さくらさくら</div>
            <div style={{ fontSize: 10, color: 'var(--ink2)' }}>벚꽃 벚꽃 · 동요</div>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '12px 16px 16px' }}>
        {/* lyrics with karaoke highlight */}
        <div style={{ fontSize: 9, color: 'var(--ink3)', fontWeight: 800, letterSpacing: 1 }}>가사</div>
        <div style={{ marginTop: 8, lineHeight: 2.1, fontSize: 14, fontFamily: '"Hiragino Sans"' }}>
          <div style={{
            background: 'var(--primary)', color: 'var(--primary-fg)',
            padding: '2px 6px', borderRadius: 4, display: 'inline-block',
          }}>さくら さくら</div>
          <div style={{ color: 'var(--ink2)', fontSize: 9 }}>사쿠라 사쿠라</div>
          <div style={{ marginTop: 6 }}>のやま も さと も</div>
          <div style={{ color: 'var(--ink2)', fontSize: 9 }}>노야마 모 사토 모</div>
          <div style={{ marginTop: 6 }}>みわたす かぎり</div>
          <div style={{ color: 'var(--ink2)', fontSize: 9 }}>미와타스 카기리</div>
        </div>
      </div>
      {/* Player bar */}
      <div style={{
        padding: '10px 14px 14px', borderTop: '1px solid var(--border)',
        background: 'var(--surface)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <span style={{ fontSize: 8, color: 'var(--ink3)' }}>0:18</span>
          <div style={{ flex: 1, height: 3, borderRadius: 2, background: 'var(--surface2)', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, width: '38%', background: 'var(--primary)', borderRadius: 2 }}/>
          </div>
          <span style={{ fontSize: 8, color: 'var(--ink3)' }}>0:48</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
          <span style={{ fontSize: 18, color: 'var(--ink2)' }}>⏮</span>
          <div style={{
            width: 44, height: 44, borderRadius: 22,
            background: 'var(--primary)', color: 'var(--primary-fg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
            boxShadow: 'var(--shadow)',
          }}>▶</div>
          <span style={{ fontSize: 18, color: 'var(--ink2)' }}>⏭</span>
        </div>
      </div>
    </div>
  );
}

// ─── MOCK TEST (in progress) ───
function MockTestInProgressScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, background: 'var(--sakura-100)' }}>
        <div style={{ width: 20, height: 20, borderRadius: 10, background: 'var(--surface)', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</div>
        <div style={{
          padding: '3px 8px', borderRadius: 999,
          background: 'var(--primary)', color: 'var(--primary-fg)',
          fontSize: 9, fontWeight: 800,
        }}>N5 · 12/60</div>
        <div style={{ flex: 1, height: 3, borderRadius: 2, background: 'var(--surface2)', overflow: 'hidden' }}>
          <div style={{ width: '20%', height: '100%', background: 'var(--primary)' }}/>
        </div>
        <div style={{
          padding: '3px 8px', borderRadius: 999,
          background: 'var(--surface)', border: '1px solid var(--border)',
          fontSize: 9, fontWeight: 800,
        }}>⏱ 41:22</div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '14px 14px 16px' }}>
        <div style={{ fontSize: 9, color: 'var(--ink3)', fontWeight: 800, letterSpacing: 2 }}>문제 12 · 어휘</div>
        <div style={{
          marginTop: 8, padding: 12, borderRadius: 'var(--radius-lg)',
          background: 'var(--surface)', border: '1px solid var(--border)',
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.6 }}>
            다음 단어의 뜻을 고르세요.
          </div>
          <div style={{
            marginTop: 8, fontSize: 28, fontWeight: 800, letterSpacing: -1,
            fontFamily: '"Hiragino Sans"', textAlign: 'center',
          }}>努力する</div>
          <div style={{ fontSize: 10, color: 'var(--ink2)', textAlign: 'center' }}>どりょくする</div>
        </div>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            'A. 일을 그만두다',
            'B. 노력하다',
            'C. 도전하다',
            'D. 학습하다',
          ].map((o, i) => (
            <div key={i} style={{
              padding: '10px 12px', borderRadius: 'var(--radius)',
              background: i === 1 ? 'var(--sakura-100)' : 'var(--surface)',
              border: `1px solid ${i === 1 ? 'var(--primary)' : 'var(--border)'}`,
              fontSize: 11, fontWeight: 700,
              color: i === 1 ? 'var(--primary)' : 'var(--ink)',
            }}>{o}</div>
          ))}
        </div>
        <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
          <BigButton variant="outline" size="sm">‹ 이전</BigButton>
          <BigButton variant="primary" size="sm">다음 ›</BigButton>
        </div>
      </div>
    </div>
  );
}

// ─── DIALOGUE LIST ───
function DialogueScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="회화 시뮬레이션" sub="역할극"/>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 14px 16px' }}>
        {[
          { ic: '☕', t: '카페에서 주문하기', sub: '캐주얼 · N5', l: '5분' },
          { ic: '🚉', t: '역에서 길 묻기', sub: '캐주얼 · N5', l: '6분' },
          { ic: '🏥', t: '병원 접수', sub: '존댓말 · N4', l: '8분' },
          { ic: '🏢', t: '회사 인터뷰', sub: '경어 · N3', l: '12분' },
        ].map((d, i) => (
          <PCard key={i} padding={12} style={{ marginTop: i ? 8 : 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'var(--sakura-100)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18,
              }}>{d.ic}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 800 }}>{d.t}</div>
                <div style={{ fontSize: 9, color: 'var(--ink2)', marginTop: 2 }}>{d.sub}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  display: 'inline-block', padding: '3px 8px', borderRadius: 999,
                  background: 'var(--surface2)', fontSize: 8, fontWeight: 700, color: 'var(--ink2)',
                }}>{d.l}</div>
              </div>
            </div>
          </PCard>
        ))}
      </div>
    </div>
  );
}

// ─── DIALOGUE DETAIL (role-play) ───
function DialogueDetailScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, background: 'var(--sakura-100)' }}>
        <div style={{ width: 20, height: 20, borderRadius: 10, background: 'var(--surface)', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800 }}>카페에서 주문하기</div>
          <div style={{ fontSize: 9, color: 'var(--ink2)' }}>3 / 8</div>
        </div>
        <div style={{ flex: 1 }}/>
        <div style={{ fontSize: 11, color: 'var(--ink2)' }}>⋯</div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '12px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* NPC */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--sakura-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>👩</div>
          <div>
            <div style={{ fontSize: 8, color: 'var(--ink2)', fontWeight: 800, letterSpacing: 1 }}>STAFF</div>
            <div style={{ marginTop: 2, maxWidth: 180, padding: '7px 10px', borderRadius: 14, background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 12, fontFamily: '"Hiragino Sans"', fontWeight: 700 }}>いらっしゃいませ。<br/>ご注文は？</div>
              <div style={{ fontSize: 9, color: 'var(--ink2)', marginTop: 4 }}>어서 오세요. 주문하시겠어요?</div>
            </div>
          </div>
        </div>

        {/* User reply suggestions */}
        <div style={{
          marginTop: 6, padding: 10, borderRadius: 'var(--radius)',
          background: 'var(--sakura-100)', fontSize: 9, color: 'var(--primary)', fontWeight: 800, letterSpacing: 1,
        }}>당신의 선택</div>

        {[
          { jp: 'コーヒー、お願いします', ko: '커피 주세요', good: true },
          { jp: 'お水ください', ko: '물 주세요' },
          { jp: '今は大丈夫です', ko: '괜찮습니다 (자리만)' },
        ].map((o, i) => (
          <div key={i} style={{
            padding: '8px 10px', borderRadius: 'var(--radius)',
            background: 'var(--surface)', border: `1px solid ${o.good ? 'var(--primary)' : 'var(--border)'}`,
            display: 'flex', alignItems: 'baseline', gap: 8,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, fontFamily: '"Hiragino Sans"' }}>{o.jp}</div>
              <div style={{ fontSize: 9, color: 'var(--ink2)' }}>{o.ko}</div>
            </div>
            {o.good && <span style={{ fontSize: 8, color: 'var(--primary)', fontWeight: 800 }}>+10 XP</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ACCOUNT DELETE ───
function AccountDeleteScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="계정 탈퇴"/>
      <div style={{ flex: 1, overflow: 'auto', padding: '12px 14px 16px' }}>
        <div style={{
          width: 60, height: 60, borderRadius: '50%', background: '#FFE5EA',
          margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28,
        }}>⚠️</div>
        <div style={{
          marginTop: 14, fontSize: 18, fontWeight: 800,
          textAlign: 'center', letterSpacing: -0.4, fontFamily: 'var(--font-display)',
        }}>정말 떠나시겠어요?</div>
        <div style={{ marginTop: 8, fontSize: 11, color: 'var(--ink2)', textAlign: 'center', lineHeight: 1.6 }}>
          탈퇴하시면 학습 기록과 배지가<br/>모두 삭제되고 복구할 수 없어요.
        </div>

        <div style={{
          marginTop: 16, padding: 12, borderRadius: 'var(--radius)',
          background: 'var(--surface2)',
        }}>
          <div style={{ fontSize: 9, color: 'var(--ink3)', fontWeight: 800, letterSpacing: 1 }}>잃게 되는 것들</div>
          <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4, fontSize: 10, color: 'var(--ink)' }}>
            <div>· 432 XP · Lv.1 입문자</div>
            <div>· 연속 학습 7일</div>
            <div>· 획득한 4개의 배지</div>
            <div>· 저장한 단어 12개</div>
          </div>
        </div>

        <div style={{ marginTop: 14, fontSize: 9, color: 'var(--ink3)', fontWeight: 800, letterSpacing: 1 }}>비밀번호 확인</div>
        <PCard padding={10} style={{ marginTop: 4 }}>
          <div style={{ fontSize: 11, color: 'var(--ink3)' }}>••••••••</div>
        </PCard>

        <div style={{ marginTop: 16 }}>
          <div style={{
            background: '#E53935', color: '#fff',
            padding: '12px 14px', borderRadius: 'var(--radius-lg)',
            fontSize: 12, fontWeight: 800, textAlign: 'center',
          }}>탈퇴하기</div>
        </div>
        <div style={{ marginTop: 8 }}>
          <BigButton variant="outline" size="sm">취소하고 돌아가기</BigButton>
        </div>
      </div>
    </div>
  );
}

// ─── TERMS / PRIVACY (legal) ───
function makeLegalScreen(title, intro, sections) {
  return function LegalScreen() {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <PageHeader title={title}/>
        <div style={{ flex: 1, overflow: 'auto', padding: '12px 16px 16px' }}>
          <div style={{ fontSize: 9, color: 'var(--ink3)' }}>최종 업데이트 · 2026-05-15</div>
          <div style={{ marginTop: 10, fontSize: 11, color: 'var(--ink2)', lineHeight: 1.6 }}>{intro}</div>
          {sections.map((sec, i) => (
            <div key={i} style={{ marginTop: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 800, fontFamily: 'var(--font-display)' }}>{sec.h}</div>
              <div style={{ marginTop: 4, fontSize: 10, color: 'var(--ink2)', lineHeight: 1.7 }}>{sec.b}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };
}

const TermsScreen = makeLegalScreen('이용약관',
  '본 약관은 니혼고 앱(이하 "서비스")의 이용에 관한 권리와 의무를 규정합니다.',
  [
    { h: '제1조 · 목적', b: '본 약관은 회사와 회원 간 서비스 이용에 관한 사항을 규정함을 목적으로 합니다.' },
    { h: '제2조 · 용어의 정의', b: '"회원"이란 본 약관에 동의하고 서비스를 이용하는 자를 말합니다. "콘텐츠"란 단어, 한자, 문장 등 학습 자료를 말합니다.' },
    { h: '제3조 · 서비스 제공', b: '회사는 24시간 서비스 제공을 원칙으로 하나, 점검 등 부득이한 사유로 일시 중단될 수 있습니다.' },
    { h: '제4조 · 회원의 의무', b: '회원은 타인의 정보를 도용하거나 서비스를 부정 사용해서는 안 됩니다.' },
  ]
);

const PrivacyScreen = makeLegalScreen('개인정보처리방침',
  '니혼고 앱은 사용자의 개인정보를 소중히 다루며, 다음과 같이 처리합니다.',
  [
    { h: '1. 수집하는 정보', b: '이메일, 닉네임, 학습 기록, 디바이스 정보 (기기 종류, OS 버전).' },
    { h: '2. 수집 목적', b: '서비스 제공, 학습 통계 산출, 맞춤형 추천, 알림 전송.' },
    { h: '3. 보유 기간', b: '회원 탈퇴 시까지. 단, 관련 법령에 따라 일정 기간 보관될 수 있습니다.' },
    { h: '4. 제3자 제공', b: 'AI 서비스 제공을 위해 Google(Gemini)에 일부 텍스트가 전달될 수 있습니다.' },
    { h: '5. 사용자 권리', b: '언제든지 정보 열람, 수정, 삭제, 처리 정지를 요청할 수 있습니다.' },
  ]
);

Object.assign(window, {
  NetworkErrorScreen, ServerErrorScreen, PermissionErrorScreen,
  MaintenanceScreen, UpdateScreen, NotFoundScreen,
  AIReadingScreen, SongDetailScreen, MockTestInProgressScreen,
  DialogueScreen, DialogueDetailScreen,
  AccountDeleteScreen, TermsScreen, PrivacyScreen,
});
