// Settings + appearance + badge collection screens

function SettingsScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        padding: '10px 16px 14px',
        background: 'linear-gradient(180deg, var(--sakura-100), transparent)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{ width: 20, height: 20, borderRadius: 10, background: 'var(--sakura-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>⚙</div>
        <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: -0.2, fontFamily: 'var(--font-display)' }}>설정</div>
        <span style={{ fontSize: 10, color: 'var(--ink2)' }}>앱 환경 설정</span>
      </div>

      <div style={{ padding: '0 16px 12px', flex: 1, overflow: 'auto' }}>
        {/* User card */}
        <PCard padding={10} style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'var(--sakura-100)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid var(--primary)', fontSize: 14,
          }}>🌸</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 800 }}>데모 사용자</div>
            <div style={{ fontSize: 10, color: 'var(--ink2)' }}>demo@test.com</div>
          </div>
          <div style={{ color: 'var(--ink3)', fontSize: 14 }}>›</div>
        </PCard>

        {/* Section: 외관 (앱 모양) */}
        <div style={{ fontSize: 9, color: 'var(--ink3)', fontWeight: 800, letterSpacing: 1, marginTop: 16, padding: '0 4px' }}>외관</div>
        <PCard padding={0} style={{ marginTop: 6, overflow: 'hidden' }}>
          {[
            { ic: '🎨', l: '테마 & 마스코트', r: '에디토리얼' },
            { ic: '🏠', l: '홈 레이아웃', r: '기본' },
            { ic: '🌙', l: '다크 모드', toggle: false },
          ].map((row, i, arr) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px',
              borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: 6,
                background: 'var(--sakura-100)', color: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11,
              }}>{row.ic}</div>
              <div style={{ flex: 1, fontSize: 11, fontWeight: 600 }}>{row.l}</div>
              {row.toggle !== undefined ? (
                <div style={{
                  width: 28, height: 16, borderRadius: 8,
                  background: row.toggle ? 'var(--primary)' : 'var(--surface2)',
                  display: 'flex', alignItems: 'center',
                  padding: 2,
                }}>
                  <div style={{ width: 12, height: 12, borderRadius: 6, background: '#fff', marginLeft: row.toggle ? 12 : 0 }}/>
                </div>
              ) : (
                <>
                  <span style={{ fontSize: 9, color: 'var(--ink2)' }}>{row.r}</span>
                  <span style={{ color: 'var(--ink3)', fontSize: 10 }}>›</span>
                </>
              )}
            </div>
          ))}
        </PCard>

        {/* Section: 학습 */}
        <div style={{ fontSize: 9, color: 'var(--ink3)', fontWeight: 800, letterSpacing: 1, marginTop: 12, padding: '0 4px' }}>학습</div>
        <PCard padding={0} style={{ marginTop: 6, overflow: 'hidden' }}>
          {[
            { ic: '🔔', l: '알림 설정', r: '20:00' },
            { ic: '🏆', l: '내 배지', r: '4 / 11' },
            { ic: '🔊', l: '음성 엔진', r: '기본' },
          ].map((row, i, arr) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px',
              borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: 6,
                background: 'var(--sakura-100)', color: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11,
              }}>{row.ic}</div>
              <div style={{ flex: 1, fontSize: 11, fontWeight: 600 }}>{row.l}</div>
              <span style={{ fontSize: 9, color: 'var(--ink2)' }}>{row.r}</span>
              <span style={{ color: 'var(--ink3)', fontSize: 10 }}>›</span>
            </div>
          ))}
        </PCard>
      </div>

      <BottomNav active="set"/>
    </div>
  );
}

function AppearanceScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="외관 설정"/>

      <div style={{ padding: '0 16px 14px', flex: 1, overflow: 'auto' }}>
        <div style={{ fontSize: 9, color: 'var(--ink3)', fontWeight: 800, letterSpacing: 1, marginTop: 8, padding: '0 4px' }}>마스코트</div>
        <PCard padding={10} style={{ marginTop: 6 }}>
          <div style={{ fontSize: 10, color: 'var(--ink2)', marginBottom: 8 }}>학습 친구를 선택하세요</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
            {[
              { id: 'kotaro', n: '코타로', active: true },
              { id: 'yuki', n: '유키' },
              { id: 'sora', n: '소라' },
            ].map(m => (
              <div key={m.id} style={{
                padding: 6, borderRadius: 'var(--radius)',
                background: m.active ? 'var(--sakura-100)' : 'var(--surface)',
                border: `1.5px solid ${m.active ? 'var(--primary)' : 'var(--border)'}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                position: 'relative',
              }}>
                {m.active && <div style={{ position: 'absolute', top: -5, right: -5, width: 14, height: 14, borderRadius: 7, background: 'var(--primary)', color: 'var(--primary-fg)', fontSize: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</div>}
                <Mascot id={m.id} size={32}/>
                <div style={{ fontSize: 9, fontWeight: 700 }}>{m.n}</div>
              </div>
            ))}
          </div>
        </PCard>

        <div style={{ fontSize: 9, color: 'var(--ink3)', fontWeight: 800, letterSpacing: 1, marginTop: 14, padding: '0 4px' }}>테마</div>
        <PCard padding={10} style={{ marginTop: 6 }}>
          {[
            { id: 'default', n: '기본', sub: 'Airbnb Coral', accent: '#FF5A5F', active: true },
            { id: 'editorial', n: '에디토리얼', sub: '매거진 세리프', accent: '#E83E7A' },
            { id: 'ink', n: '잉크', sub: '미니멀 모노톤', accent: '#0E0E10' },
          ].map((t, i, arr) => (
            <div key={t.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 0',
              borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: t.accent,
                boxShadow: t.active ? `0 0 0 2px var(--surface), 0 0 0 4px var(--primary)` : 'none',
              }}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 800 }}>{t.n}</div>
                <div style={{ fontSize: 9, color: 'var(--ink2)' }}>{t.sub}</div>
              </div>
              {t.active && <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--primary)' }}>적용중</div>}
            </div>
          ))}
        </PCard>

        <div style={{ fontSize: 9, color: 'var(--ink3)', fontWeight: 800, letterSpacing: 1, marginTop: 14, padding: '0 4px' }}>홈 레이아웃</div>
        <PCard padding={10} style={{ marginTop: 6 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
            {['기본', '에디토', '모노', 'iOS', '마스코트', '잉크'].map((n, i) => (
              <div key={i} style={{
                padding: 6, borderRadius: 'var(--radius)',
                background: i === 0 ? 'var(--sakura-100)' : 'var(--surface2)',
                border: `1px solid ${i === 0 ? 'var(--primary)' : 'var(--border)'}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              }}>
                <div style={{ width: '100%', height: 32, background: 'var(--surface)', borderRadius: 4, border: '1px solid var(--border)' }}/>
                <div style={{ fontSize: 9, fontWeight: 700 }}>{n}</div>
              </div>
            ))}
          </div>
        </PCard>
      </div>
    </div>
  );
}

function BadgeCollectionScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="내 배지" sub="4 / 11"/>
      <div style={{ padding: '6px 16px 14px', flex: 1, overflow: 'auto' }}>
        <PCard padding={12} style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, #FF8FB1 100%)',
          color: 'var(--primary-fg)', border: 'none',
        }}>
          <div style={{ fontSize: 9, opacity: 0.85, fontWeight: 800, letterSpacing: 1 }}>CURRENT LV.1</div>
          <div style={{ fontSize: 16, fontWeight: 800, marginTop: 2, fontFamily: 'var(--font-display)' }}>입문자의 발걸음</div>
          <div style={{ marginTop: 8, height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.25)', overflow: 'hidden' }}>
            <div style={{ width: '32%', height: '100%', background: '#fff' }}/>
          </div>
          <div style={{ fontSize: 9, opacity: 0.85, marginTop: 4 }}>32 / 100 XP · Lv.2까지 7일</div>
        </PCard>

        <div style={{ fontSize: 9, color: 'var(--ink3)', fontWeight: 800, letterSpacing: 1, marginTop: 14 }}>연속 학습</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginTop: 6 }}>
          {[
            { d: '3일', got: true, c: '#F4B36A' },
            { d: '7일', got: true, c: '#FF8A4D' },
            { d: '30일', prog: true, c: '#E84992' },
            { d: '90일', c: '#7A4DD8' },
            { d: '365일', c: 'rainbow' },
          ].map((b, i) => (
            <div key={i} style={{
              padding: 8, borderRadius: 'var(--radius)',
              background: b.got ? 'var(--surface)' : 'var(--surface2)',
              border: '1px solid var(--border)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              filter: !b.got && !b.prog ? 'grayscale(0.6) opacity(0.6)' : 'none',
              position: 'relative',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 18,
                background: b.c === 'rainbow' ? 'conic-gradient(#FFD400, #FF8A4D, #E84992, #7A4DD8, #FFD400)' : b.c,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 11, fontWeight: 800,
              }}>🔥</div>
              <div style={{ fontSize: 9, fontWeight: 800 }}>{b.d}</div>
              {!b.got && !b.prog && <div style={{ position: 'absolute', top: 4, right: 4, fontSize: 8 }}>🔒</div>}
            </div>
          ))}
        </div>

        <div style={{ fontSize: 9, color: 'var(--ink3)', fontWeight: 800, letterSpacing: 1, marginTop: 14 }}>이정표</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginTop: 6 }}>
          {[
            { l: '첫 발걸음', got: true, e: '👣' },
            { l: '100단어', got: true, e: '📖' },
            { l: '완벽', got: true, e: '⭐' },
            { l: 'XP 1000', e: '⚡' },
            { l: '한자 80', e: '字' },
            { l: '무결점', e: '🎯' },
          ].map((m, i) => (
            <div key={i} style={{
              padding: 8, borderRadius: 'var(--radius)',
              background: m.got ? 'var(--surface)' : 'var(--surface2)',
              border: '1px solid var(--border)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              filter: !m.got ? 'grayscale(0.6) opacity(0.7)' : 'none',
              position: 'relative',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 18,
                background: m.got ? 'var(--sakura-100)' : 'var(--surface2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--primary)', fontSize: 14, fontFamily: '"Hiragino Sans"',
                fontWeight: 800,
              }}>{m.e}</div>
              <div style={{ fontSize: 9, fontWeight: 700, textAlign: 'center', lineHeight: 1.2 }}>{m.l}</div>
              {!m.got && <div style={{ position: 'absolute', top: 4, right: 4, fontSize: 8 }}>🔒</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SettingsScreen, AppearanceScreen, BadgeCollectionScreen });
