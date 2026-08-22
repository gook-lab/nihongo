// 6 home layout variants (theme-agnostic — uses current --primary etc.)

// 1. Default — mascot hero + cards
function HomeDefault() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflow: 'auto', padding: '10px 14px 70px' }}>
        {/* Hero mascot card */}
        <div style={{
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, var(--sakura-100), var(--surface))',
          padding: 12, display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: 'var(--shadow-card)',
        }}>
          <Bubble small>오늘도 함께 공부해요!</Bubble>
          <div style={{ flex: 1 }}/>
          <Mascot id="kotaro" size={56} bobbing/>
        </div>
        <div style={{ marginTop: 6, fontSize: 11, color: 'var(--ink2)' }}>
          안녕하세요, <b style={{ color: 'var(--ink)' }}>학습자</b> 님 · Lv.1
        </div>

        {/* Calendar */}
        <PCard padding={10} style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: 12 }}>🔥</span>
            <span style={{ fontSize: 11, fontWeight: 800 }}>학습 캘린더</span>
            <div style={{ flex: 1 }}/>
            <span style={{ fontSize: 9, color: 'var(--ink2)' }}>연속 <b style={{ color: 'var(--primary)' }}>7일</b></span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3 }}>
            {['일','월','화','수','목','금','토'].map((d, i) => (
              <div key={d} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 8, color: 'var(--ink3)', fontWeight: 700 }}>{d}</div>
                <div style={{
                  margin: '3px auto 0', width: 20, height: 20, borderRadius: '50%',
                  background: i < 4 ? 'var(--primary)' : 'var(--surface2)',
                  color: i < 4 ? 'var(--primary-fg)' : 'var(--ink3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, fontWeight: 800,
                }}>{i + 1}</div>
              </div>
            ))}
          </div>
        </PCard>

        {/* XP */}
        <PCard padding={10} style={{ marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <span style={{ fontSize: 12 }}>⚡</span>
            <span style={{ fontSize: 11, fontWeight: 800 }}>경험치</span>
          </div>
          <div style={{ display: 'flex', fontSize: 9, color: 'var(--ink2)', marginBottom: 4 }}>
            <span>입문자</span><div style={{ flex: 1 }}/><span>초보자</span>
          </div>
          <ProgressBar pct={0.32}/>
          <div style={{ fontSize: 9, color: 'var(--ink2)', textAlign: 'center', marginTop: 4 }}>
            다음 레벨까지 <b style={{ color: 'var(--ink)' }}>68 XP</b>
          </div>
        </PCard>

        {/* CTA */}
        <div style={{ marginTop: 10 }}>
          <BigButton variant="primary" icon="📖">오늘의 학습 시작하기</BigButton>
        </div>

        {/* Content grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginTop: 8 }}>
          {[
            { ic: '✨', l: '한자', s: 'N5~N3' },
            { ic: '📚', l: '짧은글', s: '독해' },
            { ic: '🎵', l: '동요', s: '노래' },
            { ic: '✏️', l: 'AI작문', s: '첨삭' },
            { ic: '🎓', l: '모의', s: 'JLPT' },
            { ic: '💬', l: 'AI회화', s: '튜터' },
          ].map((c, i) => (
            <div key={i} style={{
              background: 'var(--sakura-100)',
              borderRadius: 'var(--radius)',
              padding: 8, display: 'flex', flexDirection: 'column', gap: 4,
            }}>
              <div style={{ width: 22, height: 22, borderRadius: 11, background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>{c.ic}</div>
              <div style={{ fontSize: 9, fontWeight: 800 }}>{c.l}</div>
              <div style={{ fontSize: 7, color: 'var(--ink2)' }}>{c.s}</div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav active="home"/>
    </div>
  );
}

// 2. Editorial — magazine style, big serif
function HomeEditorial() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflow: 'auto', padding: '14px 16px 70px' }}>
        <div style={{ fontSize: 9, letterSpacing: 4, color: 'var(--ink2)', fontWeight: 800 }}>VOLUME 7 · OCT</div>
        <div style={{
          marginTop: 4, fontSize: 36, fontWeight: 400, letterSpacing: -2,
          lineHeight: 0.95, fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
        }}>매일의<br/>일본어</div>
        <div style={{ marginTop: 6, fontSize: 10, color: 'var(--ink2)', borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
          오늘 · 50개 단어 · 30분
        </div>

        {/* Feature article */}
        <div style={{ marginTop: 14 }}>
          <div style={{
            background: 'var(--surface2)',
            height: 100, borderRadius: 'var(--radius)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            <Mascot id="kotaro" size={70}/>
            <div style={{ position: 'absolute', top: 8, left: 10, fontSize: 8, letterSpacing: 2, color: 'var(--primary)', fontWeight: 800 }}>오늘의 학습</div>
          </div>
          <div style={{
            marginTop: 8, fontSize: 18, fontWeight: 600, letterSpacing: -0.4,
            lineHeight: 1.15, fontFamily: 'var(--font-display)',
          }}>努力 — 노력이 만드는<br/>작은 기적</div>
          <div style={{ marginTop: 4, fontSize: 10, color: 'var(--ink2)', lineHeight: 1.5 }}>
            오늘 함께 학습할 20단어. 코타로와 함께 가볍게 시작해요.
          </div>
          <div style={{ marginTop: 10 }}>
            <BigButton variant="primary" size="sm">READ MORE →</BigButton>
          </div>
        </div>

        <div style={{ marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 10 }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: 'var(--ink2)', fontWeight: 800 }}>IN THIS ISSUE</div>
          {[
            { n: '01', l: '회화 — 식당에서', s: '14 표현' },
            { n: '02', l: '한자 — N5 입문', s: '40 자' },
            { n: '03', l: '독해 — 짧은 글', s: '10 편' },
          ].map(a => (
            <div key={a.n} style={{
              padding: '8px 0', borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'baseline', gap: 8,
            }}>
              <span style={{ fontSize: 14, fontFamily: 'var(--font-display)', fontWeight: 400, fontStyle: 'italic', color: 'var(--primary)' }}>{a.n}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-display)' }}>{a.l}</div>
                <div style={{ fontSize: 9, color: 'var(--ink2)' }}>{a.s}</div>
              </div>
              <span style={{ fontSize: 12, color: 'var(--ink3)' }}>›</span>
            </div>
          ))}
        </div>
      </div>
      <BottomNav active="home"/>
    </div>
  );
}

// 3. Mono — clean, monochrome, neutral with small primary accent
function HomeMono() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--surface2)' }}>
      <div style={{ flex: 1, overflow: 'auto', padding: '12px 14px 70px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 12, background: 'var(--surface)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid var(--border)',
          }}><Mascot id="kotaro" size={26}/></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 800 }}>안녕, 학습자</div>
            <div style={{ fontSize: 9, color: 'var(--ink2)' }}>오늘 5번째 학습 · 32 XP</div>
          </div>
          <div style={{ fontSize: 9, padding: '3px 8px', borderRadius: 999, background: 'var(--surface)', border: '1px solid var(--border)', fontWeight: 800 }}>Lv.1</div>
        </div>

        {/* Big stat blocks */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
          <PCard padding={10} style={{ background: 'var(--surface)' }}>
            <div style={{ fontSize: 8, color: 'var(--ink3)', fontWeight: 800, letterSpacing: 1 }}>STREAK</div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -1, marginTop: 2 }}>7<span style={{ fontSize: 11, color: 'var(--ink2)' }}>일</span></div>
            <div style={{ fontSize: 9, color: 'var(--ink2)' }}>연속 학습 중</div>
          </PCard>
          <PCard padding={10} style={{ background: 'var(--surface)' }}>
            <div style={{ fontSize: 8, color: 'var(--ink3)', fontWeight: 800, letterSpacing: 1 }}>NEXT</div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -1, marginTop: 2 }}>68<span style={{ fontSize: 11, color: 'var(--ink2)' }}>XP</span></div>
            <div style={{ fontSize: 9, color: 'var(--ink2)' }}>다음 레벨까지</div>
          </PCard>
        </div>

        {/* big CTA */}
        <div style={{ marginTop: 10 }}>
          <BigButton variant="primary">오늘의 학습 ›</BigButton>
        </div>

        {/* Card list */}
        <div style={{ fontSize: 8, color: 'var(--ink3)', fontWeight: 800, letterSpacing: 1, marginTop: 14 }}>QUICK START</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>
          {[
            { l: '오답노트 복습', s: '12개 단어 대기' },
            { l: '회화 — 식당에서', s: '14개 표현' },
            { l: '한자 카드', s: 'N5~N3 · 240자' },
          ].map((r, i) => (
            <PCard key={i} padding={10} style={{ background: 'var(--surface)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--surface2)' }}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 800 }}>{r.l}</div>
                <div style={{ fontSize: 9, color: 'var(--ink2)' }}>{r.s}</div>
              </div>
              <span style={{ color: 'var(--ink3)', fontSize: 12 }}>›</span>
            </PCard>
          ))}
        </div>
      </div>
      <BottomNav active="home"/>
    </div>
  );
}

// 4. iOS — grouped list with large title
function HomeIos() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--surface2)' }}>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 14px 70px' }}>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -1, fontFamily: 'var(--font-display)' }}>오늘</div>

        {/* Top hero */}
        <PCard padding={12} style={{ marginTop: 10, background: 'var(--surface)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Mascot id="kotaro" size={50} bobbing/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, color: 'var(--ink2)', fontWeight: 800, letterSpacing: 1 }}>STREAK 7일 🔥</div>
            <div style={{ fontSize: 13, fontWeight: 800, marginTop: 2 }}>다음 학습 시작</div>
            <div style={{ marginTop: 5 }}><ProgressBar pct={0.32}/></div>
          </div>
        </PCard>

        {/* Section header */}
        <div style={{ fontSize: 9, color: 'var(--ink2)', fontWeight: 700, letterSpacing: 1, marginTop: 14, padding: '0 4px', textTransform: 'uppercase' }}>학습</div>
        <PCard padding={0} style={{ marginTop: 6, overflow: 'hidden' }}>
          {[
            { ic: '📖', l: '오늘의 학습', s: '20단어 · 5분' },
            { ic: '📋', l: '오답 노트', s: '12개 대기' },
            { ic: '✨', l: '한자 카드', s: 'N5~N3' },
            { ic: '💬', l: '회화 표현', s: '14 카테고리' },
          ].map((r, i, arr) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px',
              borderBottom: i < arr.length - 1 ? '0.5px solid var(--border)' : 'none',
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: 6,
                background: 'var(--sakura-100)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10,
              }}>{r.ic}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11 }}>{r.l}</div>
              </div>
              <span style={{ fontSize: 9, color: 'var(--ink2)' }}>{r.s}</span>
              <span style={{ color: 'var(--ink3)', fontSize: 10 }}>›</span>
            </div>
          ))}
        </PCard>

        <div style={{ fontSize: 9, color: 'var(--ink2)', fontWeight: 700, letterSpacing: 1, marginTop: 14, padding: '0 4px', textTransform: 'uppercase' }}>리워드</div>
        <PCard padding={0} style={{ marginTop: 6, overflow: 'hidden' }}>
          {[
            { ic: '🏆', l: '내 배지', s: '4 / 11' },
            { ic: '⚡', l: '경험치', s: '32 XP · Lv.1' },
          ].map((r, i, arr) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px',
              borderBottom: i < arr.length - 1 ? '0.5px solid var(--border)' : 'none',
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: 6,
                background: 'var(--sakura-100)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10,
              }}>{r.ic}</div>
              <div style={{ flex: 1, fontSize: 11 }}>{r.l}</div>
              <span style={{ fontSize: 9, color: 'var(--ink2)' }}>{r.s}</span>
              <span style={{ color: 'var(--ink3)', fontSize: 10 }}>›</span>
            </div>
          ))}
        </PCard>
      </div>
      <BottomNav active="home"/>
    </div>
  );
}

// 5. Mascot — large mascot focus + game stats
function HomeMascot() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflow: 'auto', padding: '12px 14px 70px',
        background: 'linear-gradient(180deg, var(--sakura-100) 0%, var(--bg) 60%)',
      }}>
        {/* User strip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%', background: 'var(--surface)',
            border: `2px solid var(--primary)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
          }}>🌸</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700 }}>학습자 · Lv.1</div>
          </div>
          <div style={{
            display: 'flex', gap: 4, padding: '3px 8px', borderRadius: 999,
            background: 'var(--surface)', border: '1px solid var(--border)',
            fontSize: 9, fontWeight: 800,
          }}>⚡ 32</div>
        </div>

        {/* Hero mascot stage */}
        <div style={{
          marginTop: 10, height: 200, borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, var(--sakura-200), var(--surface) 70%)',
          position: 'relative', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {/* sparkles */}
          {[{x:15,y:25,s:0},{x:80,y:30,s:0.5},{x:25,y:75,s:0.8}].map((p,i) => (
            <span key={i} style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, fontSize: 14, opacity: 0.7 }}>✨</span>
          ))}
          <Mascot id="kotaro" size={130} bobbing/>
          {/* speech bubble */}
          <div style={{ position: 'absolute', top: 16, left: 12 }}>
            <Bubble>오늘도 함께!</Bubble>
          </div>
        </div>

        {/* Game stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginTop: 12 }}>
          {[
            { ic: '🔥', n: '7', l: 'STREAK' },
            { ic: '⚡', n: '32', l: 'XP' },
            { ic: '🏆', n: '4', l: 'BADGES' },
          ].map((s, i) => (
            <div key={i} style={{
              background: 'var(--surface)', borderRadius: 'var(--radius)',
              padding: 8, textAlign: 'center', border: '1px solid var(--border)',
            }}>
              <div style={{ fontSize: 14 }}>{s.ic}</div>
              <div style={{ fontSize: 14, fontWeight: 800, marginTop: 2 }}>{s.n}</div>
              <div style={{ fontSize: 8, color: 'var(--ink3)', fontWeight: 800, letterSpacing: 1 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Big CTA */}
        <div style={{ marginTop: 10 }}>
          <BigButton variant="primary" icon="🎯">오늘의 미션 시작</BigButton>
        </div>

        <div style={{
          marginTop: 8, padding: 10, borderRadius: 'var(--radius)',
          background: 'var(--surface)', border: '1px dashed var(--primary)',
          fontSize: 10, color: 'var(--ink2)', textAlign: 'center',
        }}>🎁 7일 연속! 보상 받기</div>
      </div>
      <BottomNav active="home"/>
    </div>
  );
}

// 6. Ink — minimal, big CTA, monochrome
function HomeInk() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 16px 70px' }}>
        <div style={{ fontSize: 9, letterSpacing: 4, color: 'var(--ink2)', fontWeight: 800 }}>NIHONGO · DAY 7</div>
        <div style={{
          marginTop: 4, fontSize: 32, fontWeight: 800, letterSpacing: -1.5,
          lineHeight: 1.05, fontFamily: 'var(--font-display)',
        }}>오늘의<br/>학습</div>

        <div style={{
          marginTop: 16, borderTop: '1px solid var(--ink)', paddingTop: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: -2, lineHeight: 1 }}>20</div>
            <div style={{ fontSize: 11, color: 'var(--ink2)', lineHeight: 1.4 }}>
              단어 · 5분<br/>+85 XP 예상
            </div>
          </div>
        </div>

        <div style={{
          marginTop: 16, padding: '10px 12px',
          border: '1px solid var(--ink)', borderRadius: 'var(--radius)',
        }}>
          <div style={{ fontSize: 9, color: 'var(--ink2)', fontWeight: 800, letterSpacing: 1 }}>오늘의 단어</div>
          <div style={{ marginTop: 6, fontSize: 30, fontWeight: 800, letterSpacing: -1, fontFamily: '"Hiragino Sans", serif' }}>努力</div>
          <div style={{ fontSize: 10, color: 'var(--ink2)' }}>どりょく · 노력</div>
        </div>

        <div style={{ marginTop: 20 }}>
          <BigButton variant="primary">학습 시작 →</BigButton>
        </div>

        <div style={{
          marginTop: 24, fontSize: 9, color: 'var(--ink2)', letterSpacing: 1,
          textTransform: 'uppercase', fontWeight: 800,
        }}>Progress</div>
        <div style={{
          marginTop: 8, display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4,
        }}>
          {[1,1,1,1,1,1,1,1,0,0,0,0,0,0].map((d, i) => (
            <div key={i} style={{
              aspectRatio: '1/1',
              background: d ? 'var(--ink)' : 'var(--surface2)',
              borderRadius: 2,
            }}/>
          ))}
        </div>
        <div style={{ marginTop: 4, fontSize: 9, color: 'var(--ink2)' }}>2주간 · 7/14 학습일</div>

        <div style={{
          marginTop: 20, padding: 10, border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <Mascot id="yuki" size={32}/>
          <div style={{ flex: 1, fontSize: 10, color: 'var(--ink2)' }}>
            <b style={{ color: 'var(--ink)' }}>유키</b>가 함께 학습 중
          </div>
        </div>
      </div>
      <BottomNav active="home"/>
    </div>
  );
}

Object.assign(window, { HomeDefault, HomeEditorial, HomeMono, HomeIos, HomeMascot, HomeInk });
