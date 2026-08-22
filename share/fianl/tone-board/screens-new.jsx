// Latest additions to nihongo-app: grammar, handwriting practice, learning prep, modals, widgets

// ─── GRAMMAR ───
function GrammarScreen() {
  const items = [
    { c: '조사', jp: 'は', sub: '주제 표시', lv: 'N5' },
    { c: '조사', jp: 'を', sub: '목적어 표시', lv: 'N5' },
    { c: '동사', jp: '〜ている', sub: '진행/상태', lv: 'N5' },
    { c: '형용사', jp: '〜くて', sub: 'い-형 연결', lv: 'N5' },
    { c: '동사', jp: '〜てしまう', sub: '완료/유감', lv: 'N4' },
  ];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="문법" sub="N5~N3 핵심"/>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 14px 70px' }}>
        <div style={{ fontSize: 8, color: 'var(--ink3)', fontWeight: 800, letterSpacing: 1, marginBottom: 4 }}>카테고리</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {[
            { l: '전체', a: true },
            { l: '조사' },
            { l: '동사' },
            { l: '형용사' },
            { l: '표현' },
          ].map((c, i) => (
            <div key={i} style={{
              padding: '4px 10px', borderRadius: 999,
              background: c.a ? 'var(--primary)' : 'var(--surface)',
              color: c.a ? 'var(--primary-fg)' : 'var(--ink2)',
              border: c.a ? 'none' : '1px solid var(--border)',
              fontSize: 10, fontWeight: 700,
            }}>{c.l}</div>
          ))}
        </div>
        <div style={{ fontSize: 8, color: 'var(--ink3)', fontWeight: 800, letterSpacing: 1, marginTop: 10, marginBottom: 4 }}>레벨</div>
        <div style={{ display: 'flex', gap: 4 }}>
          {['전체', 'N5', 'N4', 'N3'].map((l, i) => (
            <div key={l} style={{
              flex: 1, padding: '5px 8px', borderRadius: 'var(--radius)',
              background: i === 0 ? 'var(--primary)' : 'var(--surface)',
              color: i === 0 ? 'var(--primary-fg)' : 'var(--ink2)',
              border: i === 0 ? 'none' : '1px solid var(--border)',
              textAlign: 'center', fontSize: 10, fontWeight: 800,
            }}>{l}</div>
          ))}
        </div>
        <div style={{ fontSize: 9, color: 'var(--ink3)', marginTop: 10 }}>총 {items.length}개</div>
        <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {items.map((g, i) => (
            <PCard key={i} padding={10}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <div style={{ fontSize: 16, fontWeight: 800, fontFamily: '"Hiragino Sans"' }}>{g.jp}</div>
                    <div style={{ fontSize: 9, color: 'var(--ink2)' }}>· {g.sub}</div>
                  </div>
                  <div style={{ marginTop: 4, display: 'flex', gap: 6 }}>
                    <span style={{ padding: '2px 6px', borderRadius: 999, background: 'var(--sakura-100)', color: 'var(--primary)', fontSize: 8, fontWeight: 800 }}>{g.c}</span>
                    <span style={{ padding: '2px 6px', borderRadius: 999, background: 'var(--surface2)', color: 'var(--ink2)', fontSize: 8, fontWeight: 800 }}>{g.lv}</span>
                  </div>
                </div>
                <div style={{ width: 18, height: 18, borderRadius: 9, background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8 }}>›</div>
              </div>
            </PCard>
          ))}
        </div>
      </div>
      <BottomNav/>
    </div>
  );
}

// ─── HANDWRITING PRACTICE (KANJI) ───
function KanjiPracticeScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="한자 손글씨"/>
      <div style={{ flex: 1, padding: '8px 14px 16px', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 8,
        }}>
          <div style={{ fontSize: 10, color: 'var(--ink2)', fontWeight: 800 }}>1 / 80 · N5</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {[1,0,0].map((d, i) => (
              <div key={i} style={{ width: 12, height: 4, borderRadius: 2, background: d ? 'var(--primary)' : 'var(--surface2)' }}/>
            ))}
          </div>
        </div>

        {/* Toolbar (FigJam style) */}
        <PCard padding={8} style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {/* pen sizes */}
            <div style={{ display: 'flex', gap: 3 }}>
              {[5, 9, 14].map((s, i) => (
                <div key={i} style={{
                  width: 20, height: 20, borderRadius: 5,
                  background: i === 1 ? 'var(--sakura-100)' : 'var(--surface)',
                  border: `1px solid ${i === 1 ? 'var(--primary)' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{ width: s/2, height: s/2, borderRadius: '50%', background: 'var(--ink)' }}/>
                </div>
              ))}
            </div>
            <div style={{ width: 1, height: 18, background: 'var(--border)' }}/>
            {/* colors */}
            <div style={{ display: 'flex', gap: 3 }}>
              {['#1A1A1A', '#FF5A5F', '#3B82F6', '#10B981', '#8B5CF6'].map((c, i) => (
                <div key={i} style={{
                  width: 14, height: 14, borderRadius: '50%', background: c,
                  border: i === 0 ? '2px solid var(--primary)' : 'none',
                }}/>
              ))}
            </div>
            <div style={{ flex: 1 }}/>
            <div style={{ display: 'flex', gap: 3 }}>
              {['🧽', '↶', '🗑'].map((ic, i) => (
                <div key={i} style={{ width: 22, height: 22, borderRadius: 5, background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>{ic}</div>
              ))}
            </div>
          </div>
        </PCard>

        {/* Canvas */}
        <div style={{
          aspectRatio: '1/1', position: 'relative',
          background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
          border: '1.5px dashed var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}>
          {/* template — faint kanji */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 130, fontWeight: 700, color: 'var(--ink3)',
            opacity: 0.18, fontFamily: '"Hiragino Sans", "Noto Sans JP", serif',
          }}>学</div>
          {/* gridlines */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.4 }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'var(--border)' }}/>
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'var(--border)' }}/>
          </div>
          {/* user strokes */}
          <svg style={{ position: 'absolute', inset: 0 }} viewBox="0 0 200 200">
            <path d="M50 60 L150 60" stroke="#1A1A1A" strokeWidth="6" strokeLinecap="round" fill="none"/>
            <path d="M50 80 Q100 95 150 80" stroke="#1A1A1A" strokeWidth="6" strokeLinecap="round" fill="none"/>
            <path d="M80 90 L80 150" stroke="#1A1A1A" strokeWidth="6" strokeLinecap="round" fill="none"/>
            <path d="M120 90 L120 150" stroke="#1A1A1A" strokeWidth="6" strokeLinecap="round" fill="none"/>
          </svg>
        </div>

        {/* Meta */}
        <div style={{ marginTop: 10, padding: 10, borderRadius: 'var(--radius)', background: 'var(--surface2)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: '"Hiragino Sans"' }}>学</div>
            <div style={{ fontSize: 10, color: 'var(--ink2)' }}>がく · 배울</div>
            <div style={{ flex: 1 }}/>
            <div style={{ fontSize: 8, color: 'var(--primary)', fontWeight: 800 }}>N5</div>
          </div>
        </div>

        <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
          <BigButton variant="outline" size="sm" icon="👁">획순</BigButton>
          <BigButton variant="primary" size="sm" icon="✓">채점</BigButton>
        </div>
      </div>
    </div>
  );
}

// ─── KANJI PRACTICE — RESULT (score) ───
function KanjiPracticeResultScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="채점 결과"/>
      <div style={{ flex: 1, padding: '8px 14px 16px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <div style={{ fontSize: 11, color: 'var(--ink2)', fontWeight: 800, letterSpacing: 1 }}>SCORE</div>
          <div style={{ fontSize: 60, fontWeight: 900, color: '#2EBD6B', letterSpacing: -2, lineHeight: 1 }}>92</div>
          <div style={{ fontSize: 11, color: 'var(--ink2)', marginTop: 2 }}>훌륭해요!</div>
        </div>

        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          {/* Drawing */}
          <PCard padding={8} style={{ flex: 1 }}>
            <div style={{ fontSize: 9, color: 'var(--ink3)', fontWeight: 800, letterSpacing: 1, marginBottom: 4 }}>내 글씨</div>
            <div style={{ aspectRatio: '1/1', background: 'var(--surface2)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 100 100" width="80%" height="80%">
                <path d="M25 30 L75 30 M25 40 Q50 48 75 40 M40 45 L40 75 M60 45 L60 75" stroke="#1A1A1A" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
          </PCard>
          {/* Target */}
          <PCard padding={8} style={{ flex: 1 }}>
            <div style={{ fontSize: 9, color: 'var(--ink3)', fontWeight: 800, letterSpacing: 1, marginBottom: 4 }}>표준</div>
            <div style={{ aspectRatio: '1/1', background: 'var(--surface2)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56, fontWeight: 700, fontFamily: '"Hiragino Sans"' }}>学</div>
          </PCard>
        </div>

        <div style={{ marginTop: 10 }}>
          <PCard padding={10}>
            <div style={{ fontSize: 9, color: 'var(--ink3)', fontWeight: 800, letterSpacing: 1, marginBottom: 6 }}>상세 점수</div>
            {[
              { l: '형태 일치도', v: 90 },
              { l: '필압 균형', v: 95 },
              { l: '획 순서', v: 88 },
            ].map((s, i) => (
              <div key={i} style={{ marginTop: i ? 6 : 0 }}>
                <div style={{ display: 'flex', fontSize: 10, marginBottom: 2 }}>
                  <span style={{ color: 'var(--ink2)' }}>{s.l}</span>
                  <div style={{ flex: 1 }}/>
                  <span style={{ fontWeight: 800 }}>{s.v}</span>
                </div>
                <ProgressBar pct={s.v / 100} height={4}/>
              </div>
            ))}
          </PCard>
        </div>

        <div style={{ flex: 1 }}/>
        <div style={{ display: 'flex', gap: 6 }}>
          <BigButton variant="outline" size="sm">다시 쓰기</BigButton>
          <BigButton variant="primary" size="sm">다음 한자 →</BigButton>
        </div>
      </div>
    </div>
  );
}

// ─── KANA PRACTICE ───
function KanaPracticeScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="카나 손글씨"/>
      <div style={{ flex: 1, padding: '8px 14px 16px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
          {['히라가나', '가타카나'].map((t, i) => (
            <div key={t} style={{
              flex: 1, padding: '5px 10px', borderRadius: 'var(--radius)',
              background: i === 0 ? 'var(--primary)' : 'var(--surface2)',
              color: i === 0 ? 'var(--primary-fg)' : 'var(--ink2)',
              textAlign: 'center', fontSize: 10, fontWeight: 800,
            }}>{t}</div>
          ))}
        </div>
        <div style={{ fontSize: 10, color: 'var(--ink2)', textAlign: 'center', fontWeight: 800 }}>5 / 46</div>

        <div style={{
          marginTop: 12, aspectRatio: '1/1', position: 'relative',
          background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
          border: '1.5px dashed var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 130, color: 'var(--ink3)', opacity: 0.2,
            fontFamily: '"Hiragino Sans"', fontWeight: 700,
          }}>あ</div>
          <svg style={{ position: 'absolute', inset: 0 }} viewBox="0 0 200 200">
            <path d="M50 60 L150 60" stroke="#FF5A5F" strokeWidth="7" strokeLinecap="round" fill="none"/>
            <path d="M100 50 L100 140" stroke="#FF5A5F" strokeWidth="7" strokeLinecap="round" fill="none"/>
            <path d="M70 100 Q120 110 130 160" stroke="#FF5A5F" strokeWidth="7" strokeLinecap="round" fill="none"/>
          </svg>
        </div>

        <div style={{ marginTop: 10, textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800, fontFamily: '"Hiragino Sans"' }}>あ</div>
          <div style={{ fontSize: 10, color: 'var(--ink2)', marginTop: 2 }}>a · 아</div>
        </div>
        <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
          <BigButton variant="outline" size="sm">건너뛰기</BigButton>
          <BigButton variant="primary" size="sm">채점</BigButton>
        </div>
      </div>
    </div>
  );
}

// ─── LEARNING PREP (Step 0) ───
function LearningPrepScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px 14px 6px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 24, height: 24, borderRadius: 12, background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>‹</div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 8, color: 'var(--primary)', fontWeight: 800, letterSpacing: 2 }}>STEP 0 · 준비</div>
          <div style={{ fontSize: 11, fontWeight: 800, marginTop: 2 }}>학습 유형 선택</div>
        </div>
        <div style={{ width: 24 }}/>
      </div>
      <div style={{ flex: 1, padding: '8px 14px', overflow: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 0' }}>
          <Mascot id="kotaro" size={50} bobbing/>
          <div style={{ fontSize: 12, fontWeight: 800, marginTop: 6, textAlign: 'center' }}>오늘은 어떤 식으로 학습할까요?</div>
          <div style={{ fontSize: 9, color: 'var(--ink2)', marginTop: 2, textAlign: 'center' }}>총 20문제 · 켜둔 유형이 골고루 섞여요</div>
        </div>

        <PCard padding={0} style={{ marginTop: 12, overflow: 'hidden' }}>
          {[
            { ic: '📖', l: '독해', d: '일본어 보고 뜻 입력', a: true },
            { ic: '✍️', l: '작문', d: '한국어 보고 일본어 쓰기', a: true },
            { ic: '🎧', l: '청해', d: 'TTS 듣고 뜻 입력', a: false },
          ].map((t, i, arr) => (
            <div key={i} style={{
              padding: 10, display: 'flex', alignItems: 'center', gap: 10,
              borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
              background: t.a ? 'var(--sakura-100)' : 'var(--surface)',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 'var(--radius)',
                background: t.a ? 'var(--primary)' : 'var(--surface2)',
                color: t.a ? 'var(--primary-fg)' : 'var(--ink2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
              }}>{t.ic}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 800 }}>{t.l}</div>
                <div style={{ fontSize: 9, color: 'var(--ink2)' }}>{t.d}</div>
              </div>
              <div style={{
                width: 28, height: 16, borderRadius: 8,
                background: t.a ? 'var(--primary)' : 'var(--surface2)',
                display: 'flex', alignItems: 'center', padding: 2,
              }}>
                <div style={{ width: 12, height: 12, borderRadius: 6, background: '#fff', marginLeft: t.a ? 12 : 0 }}/>
              </div>
            </div>
          ))}
        </PCard>

        <div style={{ marginTop: 12 }}>
          <PCard padding={10} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14 }}>🖌</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 800 }}>작문에 손글씨 캔버스</div>
              <div style={{ fontSize: 9, color: 'var(--ink2)' }}>키보드 대신 손으로 쓰기</div>
            </div>
            <div style={{ width: 28, height: 16, borderRadius: 8, background: 'var(--primary)', padding: 2 }}>
              <div style={{ width: 12, height: 12, borderRadius: 6, background: '#fff', marginLeft: 12 }}/>
            </div>
          </PCard>
        </div>
      </div>
      <div style={{ padding: '0 14px 16px' }}>
        <BigButton variant="primary" icon="▶">학습 시작</BigButton>
      </div>
    </div>
  );
}

// ─── LEARNING WITH CANVAS (reverse / writing) ───
function LearningCanvasScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 8,
        background: 'var(--sakura-100)',
      }}>
        <div style={{ width: 20, height: 20, borderRadius: 10, background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>‹</div>
        <div style={{
          padding: '3px 8px', borderRadius: 999,
          background: 'var(--primary)', color: 'var(--primary-fg)',
          fontSize: 9, fontWeight: 800,
        }}>✍️ 작문 · 8/20</div>
        <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--surface2)', overflow: 'hidden' }}>
          <div style={{ width: '40%', height: '100%', background: 'var(--primary)' }}/>
        </div>
      </div>
      <div style={{ flex: 1, padding: '12px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontSize: 9, color: 'var(--ink3)', fontWeight: 800, letterSpacing: 1 }}>다음을 일본어로</div>
        <div style={{
          marginTop: 4, fontSize: 24, fontWeight: 800, color: 'var(--primary)',
          letterSpacing: -0.4,
        }}>약속</div>
        <div style={{ fontSize: 9, color: 'var(--ink2)' }}>yakusoku</div>

        {/* Canvas */}
        <div style={{
          marginTop: 14, width: '100%', aspectRatio: '1/1',
          background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
          border: '1.5px solid var(--border)',
          position: 'relative', overflow: 'hidden',
        }}>
          <svg style={{ position: 'absolute', inset: 0 }} viewBox="0 0 200 200">
            <path d="M40 60 L70 60 M55 50 L55 90 M55 90 L80 90 L80 110 L40 110" stroke="#1A1A1A" strokeWidth="5" strokeLinecap="round" fill="none"/>
            <path d="M120 70 L120 110 M105 80 L135 80 M105 100 L135 100" stroke="#1A1A1A" strokeWidth="5" strokeLinecap="round" fill="none"/>
          </svg>
          {/* small toolbar bottom-right */}
          <div style={{ position: 'absolute', bottom: 6, right: 6, display: 'flex', gap: 4 }}>
            <div style={{ width: 22, height: 22, borderRadius: 5, background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>🧽</div>
            <div style={{ width: 22, height: 22, borderRadius: 5, background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>↶</div>
            <div style={{ width: 22, height: 22, borderRadius: 5, background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>🗑</div>
          </div>
        </div>
      </div>
      <div style={{ padding: '0 14px 16px', display: 'flex', gap: 6 }}>
        <BigButton variant="outline" size="sm">💡 힌트</BigButton>
        <BigButton variant="primary" size="sm">확인</BigButton>
      </div>
    </div>
  );
}

// ─── QUICK DICT SEARCH (⌘K overlay) ───
function QuickDictSearchScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.4)' }}>
      <div style={{ height: 40 }}/>
      <div style={{
        background: 'var(--surface)', borderRadius: 'var(--radius-xl)',
        margin: '0 14px', boxShadow: '0 30px 80px rgba(0,0,0,0.3)', overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 12, borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontSize: 14, color: 'var(--ink3)' }}>🔍</span>
          <div style={{ flex: 1, fontSize: 13, fontWeight: 700 }}>べん</div>
          <div style={{ display: 'flex', gap: 4 }}>
            <span style={{ padding: '2px 6px', borderRadius: 4, background: 'var(--surface2)', fontSize: 8, fontWeight: 800, color: 'var(--ink2)', fontFamily: 'ui-monospace, monospace' }}>⌘K</span>
            <span style={{ padding: '2px 6px', borderRadius: 4, background: 'var(--surface2)', fontSize: 8, fontWeight: 800, color: 'var(--ink2)' }}>ESC</span>
          </div>
        </div>
        <div>
          {[
            { jp: '勉強', read: 'べんきょう', ko: '공부', lv: 'N5' },
            { jp: '便利', read: 'べんり', ko: '편리한', lv: 'N5' },
            { jp: '弁護士', read: 'べんごし', ko: '변호사', lv: 'N3' },
          ].map((w, i) => (
            <div key={i} style={{
              padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10,
              borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
              background: i === 0 ? 'var(--sakura-100)' : 'transparent',
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, fontFamily: '"Hiragino Sans"' }}>{w.jp}</div>
                <div style={{ fontSize: 8, color: 'var(--ink2)' }}>{w.read}</div>
              </div>
              <div style={{ flex: 1, fontSize: 11 }}>{w.ko}</div>
              <span style={{ padding: '2px 6px', borderRadius: 999, background: 'var(--surface2)', fontSize: 8, fontWeight: 800, color: 'var(--primary)' }}>{w.lv}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: '8px 12px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--ink3)', fontWeight: 700 }}>
          <span>↑↓ 이동</span>
          <span>↵ 사전에서 보기</span>
        </div>
      </div>
    </div>
  );
}

// ─── HOME WITH WIDGETS (today words + goal + quiz types) ───
function HomeWithWidgetsScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflow: 'auto', padding: '10px 14px 70px' }}>
        {/* Mascot hero */}
        <PCard padding={10} style={{
          background: 'linear-gradient(135deg, var(--sakura-100), var(--surface))',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Bubble small>오늘도 함께!</Bubble>
          <div style={{ flex: 1 }}/>
          <Mascot id="kotaro" size={46} bobbing/>
        </PCard>

        {/* Goal widget */}
        <PCard padding={10} style={{ marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: 12 }}>🎯</span>
            <span style={{ fontSize: 11, fontWeight: 800 }}>학습 목표</span>
          </div>
          {[
            { l: '오늘 학습', v: '2', g: '3 세션', pct: 0.66 },
            { l: '이번 주', v: '8', g: '14 세션', pct: 0.57 },
          ].map((r, i) => (
            <div key={i} style={{ marginTop: i ? 6 : 0 }}>
              <div style={{ display: 'flex', fontSize: 9, marginBottom: 2 }}>
                <span style={{ color: 'var(--ink2)' }}>{r.l}</span>
                <div style={{ flex: 1 }}/>
                <span style={{ fontWeight: 800 }}>{r.v} / {r.g}</span>
              </div>
              <ProgressBar pct={r.pct} height={4}/>
            </div>
          ))}
        </PCard>

        {/* Today words */}
        <PCard padding={10} style={{ marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <span style={{ fontSize: 12 }}>✨</span>
            <span style={{ fontSize: 11, fontWeight: 800 }}>오늘의 단어</span>
            <div style={{ flex: 1 }}/>
            <span style={{ fontSize: 9, color: 'var(--ink2)' }}>5개</span>
          </div>
          {[
            { jp: '勉強', r: 'べんきょう', k: '공부' },
            { jp: '時間', r: 'じかん', k: '시간' },
            { jp: '約束', r: 'やくそく', k: '약속' },
          ].map((w, i) => (
            <div key={i} style={{
              padding: '6px 0', display: 'flex', alignItems: 'center', gap: 8,
              borderTop: i ? '1px solid var(--border)' : 'none',
            }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, fontFamily: '"Hiragino Sans"' }}>{w.jp}</div>
                <div style={{ fontSize: 8, color: 'var(--ink2)' }}>{w.r}</div>
              </div>
              <div style={{ flex: 1, fontSize: 10, color: 'var(--ink)' }}>{w.k}</div>
              <span style={{ fontSize: 10 }}>🔊</span>
            </div>
          ))}
        </PCard>

        {/* Quiz type quick pick */}
        <div style={{ marginTop: 10, padding: 10, borderRadius: 'var(--radius)', background: 'var(--surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 8, color: 'var(--ink3)', fontWeight: 800, letterSpacing: 1, marginRight: 4 }}>유형</span>
            {[
              { ic: '📖', l: '독해', a: true },
              { ic: '✍️', l: '작문', a: true },
              { ic: '🎧', l: '청해', a: false },
            ].map((c, i) => (
              <div key={i} style={{
                padding: '4px 8px', borderRadius: 999,
                background: c.a ? 'var(--primary)' : 'var(--surface)',
                color: c.a ? 'var(--primary-fg)' : 'var(--ink2)',
                border: `1.5px solid ${c.a ? 'var(--primary)' : 'var(--border)'}`,
                fontSize: 9, fontWeight: 700, display: 'flex', gap: 2, alignItems: 'center',
              }}>{c.ic} {c.l}</div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 10 }}>
          <BigButton variant="primary" icon="▶">오늘의 학습 시작</BigButton>
        </div>
      </div>
      <BottomNav active="home"/>
    </div>
  );
}

// ─── DICTIONARY WITH FLIP CARD (expanded view) ───
function DictionaryFlipScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="사전" sub="단어 카드"/>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 14px 70px' }}>
        <PCard padding={14} style={{
          background: 'linear-gradient(135deg, var(--surface), var(--sakura-100))',
          minHeight: 120, position: 'relative',
        }}>
          <div style={{ position: 'absolute', top: 8, right: 8 }}>
            <span style={{ fontSize: 16, color: 'var(--primary)' }}>★</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 28, height: 28, borderRadius: 14, background: 'var(--primary)', color: 'var(--primary-fg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>🔊</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5, fontFamily: '"Hiragino Sans"' }}>勉強</div>
              <div style={{ fontSize: 10, color: 'var(--ink2)' }}>べんきょう · benkyou</div>
            </div>
          </div>
          <div style={{ marginTop: 8, padding: '3px 8px', borderRadius: 999, background: 'var(--primary)', color: 'var(--primary-fg)', display: 'inline-block', fontSize: 8, fontWeight: 800 }}>N5 · 동사</div>
          <div style={{
            marginTop: 8, fontSize: 9, color: 'var(--ink2)', textAlign: 'center',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
          }}>
            <span style={{ fontSize: 11 }}>↻</span>
            <span>탭하면 뜻 + 예문</span>
          </div>
        </PCard>

        {/* Flipped card (back side) */}
        <PCard padding={14} style={{ marginTop: 8, background: 'var(--surface)' }}>
          <div style={{ fontSize: 8, color: 'var(--ink3)', fontWeight: 800, letterSpacing: 1 }}>뒷면 · 뜻 + 예문</div>
          <div style={{ marginTop: 4, fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>공부</div>
          <div style={{ marginTop: 8, padding: 8, borderRadius: 'var(--radius)', background: 'var(--surface2)' }}>
            <div style={{ fontSize: 11, fontFamily: '"Hiragino Sans"', fontWeight: 700 }}>毎日勉強します。</div>
            <div style={{ fontSize: 8, color: 'var(--ink2)' }}>まいにち べんきょうします</div>
            <div style={{ fontSize: 9, color: 'var(--ink2)', marginTop: 2 }}>매일 공부합니다.</div>
          </div>
        </PCard>
      </div>
      <BottomNav active="dict"/>
    </div>
  );
}

// ─── MASCOT INTRO TOUR (3 slides — show middle slide) ───
function MascotIntroTourScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.45)' }}>
      <div style={{ flex: 1 }}/>
      <div style={{
        margin: '0 14px 30px', background: 'var(--surface)', borderRadius: 'var(--radius-xl)',
        padding: 20, boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
      }}>
        {/* dots */}
        <div style={{ display: 'flex', gap: 6 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: i === 1 ? 18 : 6, height: 6, borderRadius: 3,
              background: i <= 1 ? 'var(--primary)' : 'var(--surface2)',
            }}/>
          ))}
        </div>

        <Mascot id="kotaro" size={70} bobbing/>

        <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.4, textAlign: 'center', fontFamily: 'var(--font-display)' }}>
          이런 기능이 있어요
        </div>
        <div style={{ fontSize: 10, color: 'var(--ink2)', textAlign: 'center', lineHeight: 1.5, maxWidth: 220 }}>
          단어 학습부터 AI 튜터까지,<br/>일본어 학습에 필요한 도구가 모두 있어요.
        </div>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
          {[
            { ic: '📖', l: '단어 + 문법 + 한자' },
            { ic: '💬', l: '회화 표현 280+' },
            { ic: '✨', l: 'AI 튜터 · 작문 첨삭' },
          ].map((h, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px',
              borderRadius: 'var(--radius)', background: 'var(--sakura-100)',
              fontSize: 10, fontWeight: 700,
            }}>
              <span>{h.ic}</span>{h.l}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 4, width: '100%' }}>
          <BigButton variant="primary" size="sm">다음 →</BigButton>
        </div>
      </div>
    </div>
  );
}

// ─── FIRST SESSION MODAL ───
function FirstSessionModalScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.5)' }}>
      <div style={{ flex: 1 }}/>
      <div style={{
        margin: '0 14px 30px', borderRadius: 'var(--radius-xl)', overflow: 'hidden',
        boxShadow: '0 30px 80px rgba(0,0,0,0.3)', background: 'var(--surface)',
      }}>
        {/* gradient hero */}
        <div style={{
          padding: '22px 18px 18px', textAlign: 'center', color: '#fff',
          background: 'linear-gradient(135deg, var(--primary), #FF8FB1)',
          position: 'relative', overflow: 'hidden',
        }}>
          {['✨','✨','✨','✨','✨'].map((s, i) => (
            <span key={i} style={{
              position: 'absolute', fontSize: 10 + (i * 2),
              top: `${15 + (i*15)%40}%`, left: `${(i*18+8)%85}%`,
              opacity: 0.8,
            }}>{s}</span>
          ))}
          <div style={{ fontSize: 9, letterSpacing: 3, fontWeight: 800, opacity: 0.9 }}>FIRST SESSION</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4, letterSpacing: -0.5, fontFamily: 'var(--font-display)' }}>축하해요! 🎉</div>
          <div style={{ fontSize: 11, marginTop: 6, opacity: 0.9, lineHeight: 1.5 }}>
            첫 학습 세션을 완주했어요.<br/>
            오늘의 첫걸음이에요.
          </div>
        </div>
        <div style={{ padding: 14 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <PCard padding={8} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: 8, color: 'var(--ink3)', fontWeight: 800, letterSpacing: 1 }}>SCORE</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary)', marginTop: 2 }}>16/20</div>
            </PCard>
            <PCard padding={8} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: 8, color: 'var(--ink3)', fontWeight: 800, letterSpacing: 1 }}>XP</div>
              <div style={{ fontSize: 20, fontWeight: 800, marginTop: 2 }}>+85</div>
            </PCard>
          </div>
          <div style={{ marginTop: 10 }}>
            <BigButton variant="primary" size="sm">계속하기</BigButton>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── LEVEL UP MODAL ───
function LevelUpModalScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.5)' }}>
      <div style={{ flex: 1 }}/>
      <div style={{
        margin: '0 14px 30px', borderRadius: 'var(--radius-xl)', overflow: 'hidden',
        background: 'var(--surface)', padding: 20, textAlign: 'center',
        boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
      }}>
        {/* sparkle particles */}
        <div style={{ position: 'relative', height: 8 }}>
          {['⭐','✨','⭐','✨','⭐'].map((s, i) => (
            <span key={i} style={{
              position: 'absolute', fontSize: 13,
              top: -4, left: `${(i*22+4)}%`,
            }}>{s}</span>
          ))}
        </div>
        <div style={{ fontSize: 9, letterSpacing: 3, color: 'var(--primary)', fontWeight: 800 }}>LEVEL UP</div>
        <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4, letterSpacing: -0.5, fontFamily: 'var(--font-display)' }}>Lv.2 초보자!</div>

        {/* badge circle */}
        <div style={{
          margin: '14px auto 8px',
          width: 100, height: 100, borderRadius: '50%',
          background: 'conic-gradient(var(--primary), #FFB6CE, var(--primary))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 24px rgba(255,90,95,0.4)',
        }}>
          <div style={{
            width: 86, height: 86, borderRadius: '50%', background: 'var(--surface)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--primary)', lineHeight: 1, letterSpacing: -1 }}>Lv.2</div>
            <div style={{ fontSize: 9, color: 'var(--ink2)', marginTop: 2, fontWeight: 700 }}>초보자</div>
          </div>
        </div>

        {/* new mascot unlocked */}
        <div style={{
          marginTop: 8, padding: 10, borderRadius: 'var(--radius)',
          background: 'var(--sakura-100)', border: '1px solid var(--primary)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Mascot id="yuki" size={36}/>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontSize: 9, color: 'var(--primary)', fontWeight: 800, letterSpacing: 1 }}>NEW MASCOT</div>
            <div style={{ fontSize: 11, fontWeight: 800 }}>유키가 해금되었어요</div>
          </div>
          <span style={{ fontSize: 14 }}>🎉</span>
        </div>

        <div style={{ marginTop: 10 }}>
          <BigButton variant="primary" size="sm">계속하기</BigButton>
        </div>
      </div>
    </div>
  );
}

// ─── STREAK REWARD MODAL ───
function StreakRewardModalScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.5)' }}>
      <div style={{ flex: 1 }}/>
      <div style={{
        margin: '0 14px 30px', borderRadius: 'var(--radius-xl)', overflow: 'hidden',
        background: 'var(--surface)', padding: 20, textAlign: 'center',
        boxShadow: '0 30px 80px rgba(0,0,0,0.3)', position: 'relative',
      }}>
        {/* particles */}
        {['🔥','🔥','🔥','🔥','🔥','🔥'].map((s, i) => (
          <span key={i} style={{
            position: 'absolute', fontSize: 12,
            top: `${10 + (i*9)%40}%`, left: `${(i*15+5)%90}%`,
            opacity: 0.6,
          }}>{s}</span>
        ))}
        <div style={{
          margin: '0 auto',
          width: 72, height: 72, borderRadius: '50%',
          background: 'linear-gradient(135deg, #FFD400, #FF3366)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 34, boxShadow: '0 6px 24px rgba(255,138,77,0.4)',
        }}>🔥</div>
        <div style={{ fontSize: 9, letterSpacing: 3, color: '#FF8A4D', fontWeight: 800, marginTop: 10 }}>STREAK</div>
        <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4, fontFamily: 'var(--font-display)' }}>7일 연속!</div>
        <div style={{ fontSize: 11, color: 'var(--ink2)', marginTop: 6, lineHeight: 1.5 }}>
          <b style={{ color: 'var(--ink)' }}>한 주의 빛</b> 뱃지를 획득했어요
        </div>

        <div style={{
          marginTop: 12, padding: 10, borderRadius: 'var(--radius)',
          background: 'var(--sakura-100)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 16 }}>⚡</span>
          <div style={{ fontSize: 11, fontWeight: 800 }}>+50 XP 보너스</div>
        </div>

        <div style={{ marginTop: 10 }}>
          <BigButton variant="primary" size="sm">받기</BigButton>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  GrammarScreen, KanjiPracticeScreen, KanjiPracticeResultScreen, KanaPracticeScreen,
  LearningPrepScreen, LearningCanvasScreen,
  QuickDictSearchScreen, HomeWithWidgetsScreen, DictionaryFlipScreen,
  MascotIntroTourScreen, FirstSessionModalScreen, LevelUpModalScreen, StreakRewardModalScreen,
});


// ─── FLASHCARD VIEW (swipe + flip) ───
function FlashcardScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="플래시카드" sub="사전 모드"/>
      <div style={{ flex: 1, padding: '8px 14px 70px', display: 'flex', flexDirection: 'column' }}>
        {/* progress strip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 12,
            background: 'var(--surface)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11,
          }}>‹</div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 9, color: 'var(--ink3)', fontWeight: 800, letterSpacing: 1, fontFamily: 'ui-monospace, monospace' }}>3 / 50</span>
            <div style={{ display: 'flex', gap: 3 }}>
              {[0,1,2,3,4,5,6].map(i => (
                <div key={i} style={{
                  width: i === 2 ? 12 : 4, height: 4, borderRadius: 2,
                  background: i === 2 ? 'var(--primary)' : 'var(--border)',
                }}/>
              ))}
            </div>
          </div>
          <div style={{
            width: 24, height: 24, borderRadius: 12,
            background: 'var(--surface)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11,
          }}>›</div>
        </div>

        {/* Big card */}
        <PCard padding={0} style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          padding: 22, position: 'relative', justifyContent: 'center',
          background: 'linear-gradient(180deg, var(--surface), var(--sakura-100))',
        }}>
          {/* favorite */}
          <div style={{
            position: 'absolute', top: 12, right: 12,
            width: 28, height: 28, borderRadius: 14,
            background: 'var(--primary)', color: 'var(--primary-fg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
          }}>★</div>
          {/* TTS top-left */}
          <div style={{
            position: 'absolute', top: 12, left: 12,
            width: 28, height: 28, borderRadius: 14,
            background: 'var(--surface)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
          }}>🔊</div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 48, fontWeight: 800, letterSpacing: -1.5,
              fontFamily: '"Hiragino Sans", "Noto Sans JP", serif',
            }}>勉強</div>
            <div style={{ fontSize: 13, color: 'var(--ink2)', marginTop: 6, fontFamily: '"Hiragino Sans"' }}>べんきょう</div>
            <div style={{ fontSize: 10, color: 'var(--ink3)', fontFamily: 'ui-monospace, monospace' }}>benkyou</div>
            <div style={{ marginTop: 14, display: 'inline-block', padding: '3px 10px', borderRadius: 999, background: 'var(--primary)', color: 'var(--primary-fg)', fontSize: 9, fontWeight: 800, letterSpacing: 0.5 }}>N5</div>
          </div>

          <div style={{
            position: 'absolute', bottom: 14, left: 0, right: 0,
            textAlign: 'center', fontSize: 9, color: 'var(--ink3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
          }}>
            <span style={{ fontSize: 11 }}>↻</span>
            <span>탭 = 뒤집기 · ← → 스와이프</span>
          </div>
        </PCard>

        {/* swipe hint chevrons */}
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', fontSize: 11, color: 'var(--ink3)' }}>
          <span>← 이전</span>
          <span>다음 →</span>
        </div>
      </div>
      <BottomNav active="dict"/>
    </div>
  );
}

// ─── LEARNING TREND CHART (in stats) ───
function LearningTrendChartScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="통계" sub="7일 트렌드"/>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 14px 70px' }}>
        <PCard padding={12}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <span style={{ fontSize: 12 }}>📈</span>
            <span style={{ fontSize: 11, fontWeight: 800 }}>최근 7일 트렌드</span>
            <div style={{ flex: 1 }}/>
            <div style={{ display: 'flex', gap: 2, padding: 2, borderRadius: 999, background: 'var(--surface2)' }}>
              {[
                { l: '학습량', a: true },
                { l: '정답률' },
                { l: 'XP' },
              ].map((m, i) => (
                <div key={i} style={{
                  padding: '3px 8px', borderRadius: 999,
                  background: m.a ? 'var(--primary)' : 'transparent',
                  color: m.a ? 'var(--primary-fg)' : 'var(--ink2)',
                  fontSize: 8, fontWeight: 800,
                }}>{m.l}</div>
              ))}
            </div>
          </div>

          {/* Inline SVG chart */}
          <svg viewBox="0 0 360 140" style={{ width: '100%', height: 'auto', display: 'block' }}>
            <defs>
              <linearGradient id="trendArea" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0"/>
              </linearGradient>
            </defs>
            {/* horizontal grid */}
            {[0,0.5,1].map((p, i) => (
              <line key={i} x1="24" y1={16 + p*96} x2="336" y2={16 + p*96} stroke="var(--border)" strokeDasharray="3 3"/>
            ))}
            {/* area + line */}
            {(() => {
              const pts = [12, 28, 18, 42, 26, 52, 68].map((v, i) => {
                const max = 80;
                return { x: 24 + i * 52, y: 16 + 96 - (v/max) * 96, v };
              });
              const line = pts.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
              const area = `${line} L ${pts[pts.length-1].x} 112 L ${pts[0].x} 112 Z`;
              return (
                <g>
                  <path d={area} fill="url(#trendArea)"/>
                  <path d={line} stroke="var(--primary)" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  {pts.map((p, i) => (
                    <g key={i}>
                      <circle cx={p.x} cy={p.y} r={i === pts.length - 1 ? 5 : 3} fill="var(--primary)" stroke="var(--surface)" strokeWidth="2"/>
                      {i === pts.length - 1 && (
                        <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="9" fontWeight="800" fill="var(--primary)">{p.v}</text>
                      )}
                    </g>
                  ))}
                  {pts.map((p, i) => (
                    <text key={'l'+i} x={p.x} y={130} textAnchor="middle" fontSize="9" fill="var(--ink3)" fontWeight="700">{'월화수목금토일'[i]}</text>
                  ))}
                </g>
              );
            })()}
          </svg>

          <div style={{ marginTop: 6, display: 'flex', gap: 8 }}>
            <div style={{ flex: 1, padding: '6px 8px', borderRadius: 'var(--radius)', background: 'var(--surface2)' }}>
              <div style={{ fontSize: 7, color: 'var(--ink3)', fontWeight: 800, letterSpacing: 1 }}>합계</div>
              <div style={{ fontSize: 14, fontWeight: 800, marginTop: 1 }}>246</div>
            </div>
            <div style={{ flex: 1, padding: '6px 8px', borderRadius: 'var(--radius)', background: 'var(--surface2)' }}>
              <div style={{ fontSize: 7, color: 'var(--ink3)', fontWeight: 800, letterSpacing: 1 }}>일평균</div>
              <div style={{ fontSize: 14, fontWeight: 800, marginTop: 1 }}>35</div>
            </div>
            <div style={{ flex: 1, padding: '6px 8px', borderRadius: 'var(--radius)', background: 'var(--surface2)' }}>
              <div style={{ fontSize: 7, color: 'var(--ink3)', fontWeight: 800, letterSpacing: 1 }}>최고</div>
              <div style={{ fontSize: 14, fontWeight: 800, marginTop: 1, color: 'var(--primary)' }}>68</div>
            </div>
          </div>
        </PCard>

        {/* Weakness chart preview */}
        <PCard padding={10} style={{ marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <span style={{ fontSize: 12 }}>🎯</span>
            <span style={{ fontSize: 11, fontWeight: 800 }}>레벨별 정답률</span>
          </div>
          {[
            { l: 'N5', v: 88, c: '#2EBD6B' },
            { l: 'N4', v: 64, c: '#F4B36A' },
            { l: 'N3', v: 42, c: '#FF5A5F' },
          ].map((r, i) => (
            <div key={i} style={{ marginTop: i ? 6 : 0 }}>
              <div style={{ display: 'flex', fontSize: 9, marginBottom: 2 }}>
                <span style={{ fontWeight: 800 }}>{r.l}</span>
                <div style={{ flex: 1 }}/>
                <span style={{ color: r.c, fontWeight: 800 }}>{r.v}%</span>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: 'var(--surface2)', overflow: 'hidden' }}>
                <div style={{ width: `${r.v}%`, height: '100%', background: r.c }}/>
              </div>
            </div>
          ))}
        </PCard>
      </div>
      <BottomNav active="stats"/>
    </div>
  );
}

Object.assign(window, { FlashcardScreen, LearningTrendChartScreen });
