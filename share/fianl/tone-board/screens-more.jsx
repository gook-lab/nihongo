// More pages — dictionary, stats, conversation suite, kanji/kana, reading/writing, songs, mock test, profile

// ─── DICTIONARY ───
function DictionaryScreen() {
  const words = [
    { jp: '勉強', kana: 'べんきょう', ro: 'benkyou', ko: '공부', level: 'N5' },
    { jp: '時間', kana: 'じかん', ro: 'jikan', ko: '시간', level: 'N5' },
    { jp: '美味しい', kana: 'おいしい', ro: 'oishii', ko: '맛있다', level: 'N5' },
    { jp: '約束', kana: 'やくそく', ro: 'yakusoku', ko: '약속', level: 'N4' },
    { jp: '努力', kana: 'どりょく', ro: 'doryoku', ko: '노력', level: 'N3' },
  ];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px 14px 8px', background: 'linear-gradient(180deg, var(--sakura-100), transparent)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <div style={{ width: 20, height: 20, borderRadius: 10, background: 'var(--sakura-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--primary)' }}>📖</div>
          <div style={{ fontSize: 13, fontWeight: 800, fontFamily: 'var(--font-display)' }}>사전</div>
          <span style={{ fontSize: 10, color: 'var(--ink2)' }}>600 단어</span>
        </div>
        <div style={{ display: 'flex', background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '6px 10px', alignItems: 'center', gap: 6, border: '1px solid var(--border)' }}>
          <span style={{ fontSize: 10, color: 'var(--ink3)' }}>🔍</span>
          <span style={{ fontSize: 10, color: 'var(--ink3)' }}>단어 검색</span>
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
          {['전체', 'N5', 'N4', 'N3'].map((l, i) => (
            <div key={l} style={{
              padding: '3px 8px', borderRadius: 999, fontSize: 9, fontWeight: 800,
              background: i === 0 ? 'var(--primary)' : 'var(--surface)',
              color: i === 0 ? 'var(--primary-fg)' : 'var(--ink2)',
              border: i === 0 ? 'none' : '1px solid var(--border)',
            }}>{l}</div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '4px 14px 70px' }}>
        {words.map((w, i) => (
          <div key={i} style={{
            padding: '10px 0', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.5, fontFamily: '"Hiragino Sans", "Noto Sans JP", serif' }}>{w.jp}</div>
              <div style={{ fontSize: 9, color: 'var(--ink2)', fontFamily: '"Hiragino Sans"' }}>{w.kana}</div>
              <div style={{ fontSize: 8, color: 'var(--ink3)', fontFamily: 'ui-monospace, monospace' }}>{w.ro}</div>
            </div>
            <div style={{ flex: 1 }}/>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink)' }}>{w.ko}</div>
              <div style={{ fontSize: 8, color: 'var(--primary)', fontWeight: 800, marginTop: 2 }}>{w.level}</div>
            </div>
          </div>
        ))}
      </div>
      <BottomNav active="dict"/>
    </div>
  );
}

// ─── STATISTICS ───
function StatsScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px 14px 8px', background: 'linear-gradient(180deg, var(--sakura-100), transparent)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 20, height: 20, borderRadius: 10, background: 'var(--sakura-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--primary)' }}>📊</div>
          <div style={{ fontSize: 13, fontWeight: 800, fontFamily: 'var(--font-display)' }}>통계</div>
          <span style={{ fontSize: 10, color: 'var(--ink2)' }}>학습 인사이트</span>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '10px 14px 70px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {[
            { l: '총 단어', v: '127', s: '/ 600' },
            { l: '정답률', v: '82%', s: '평균' },
            { l: 'STREAK', v: '7', s: '일째' },
            { l: 'XP', v: '432', s: 'Lv.1' },
          ].map((s, i) => (
            <PCard key={i} padding={10}>
              <div style={{ fontSize: 8, color: 'var(--ink3)', fontWeight: 800, letterSpacing: 1 }}>{s.l}</div>
              <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.5, marginTop: 2 }}>{s.v}</div>
              <div style={{ fontSize: 9, color: 'var(--ink2)' }}>{s.s}</div>
            </PCard>
          ))}
        </div>

        <div style={{ marginTop: 10 }}>
          <PCard padding={10}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 11 }}>📈</span>
              <span style={{ fontSize: 11, fontWeight: 800 }}>주간 학습량</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 70 }}>
              {[40, 65, 30, 85, 50, 75, 95].map((h, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <div style={{
                    width: '100%', height: `${h}%`,
                    background: i === 6 ? 'var(--primary)' : 'var(--sakura-200)',
                    borderRadius: 'var(--radius)',
                  }}/>
                  <span style={{ fontSize: 7, color: 'var(--ink3)' }}>{'월화수목금토일'[i]}</span>
                </div>
              ))}
            </div>
          </PCard>
        </div>

        <div style={{ marginTop: 8 }}>
          <PCard padding={10}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 11 }}>🎯</span>
              <span style={{ fontSize: 11, fontWeight: 800 }}>JLPT 마스터리</span>
            </div>
            {[
              { l: 'N5', v: 78 },
              { l: 'N4', v: 42 },
              { l: 'N3', v: 18 },
            ].map((r, i) => (
              <div key={i} style={{ marginTop: 6 }}>
                <div style={{ display: 'flex', fontSize: 9, color: 'var(--ink2)', marginBottom: 2 }}>
                  <span style={{ fontWeight: 800, color: 'var(--ink)' }}>{r.l}</span>
                  <div style={{ flex: 1 }}/>
                  <span>{r.v}%</span>
                </div>
                <ProgressBar pct={r.v / 100} height={4}/>
              </div>
            ))}
          </PCard>
        </div>

        <div style={{ marginTop: 8 }}>
          <PCard padding={10}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 11 }}>🔥</span>
              <span style={{ fontSize: 11, fontWeight: 800 }}>약점 분석</span>
            </div>
            {[
              { l: '동사 활용', e: '23% 오답률' },
              { l: 'い-형용사', e: '18% 오답률' },
            ].map((r, i) => (
              <div key={i} style={{
                padding: '6px 0',
                borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <div style={{ width: 18, height: 18, borderRadius: 9, background: 'var(--sakura-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9 }}>📝</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, fontWeight: 700 }}>{r.l}</div>
                  <div style={{ fontSize: 8, color: 'var(--ink2)' }}>{r.e}</div>
                </div>
                <span style={{ fontSize: 10, color: 'var(--ink3)' }}>›</span>
              </div>
            ))}
          </PCard>
        </div>
      </div>
      <BottomNav active="stats"/>
    </div>
  );
}

// ─── WRONG WORDS ───
function WrongWordsScreen() {
  const items = [
    { jp: '貧しい', kana: 'まずしい', ko: '가난한', count: 3 },
    { jp: '影響', kana: 'えいきょう', ko: '영향', count: 2 },
    { jp: '解決', kana: 'かいけつ', ko: '해결', count: 2 },
    { jp: '経験', kana: 'けいけん', ko: '경험', count: 1 },
  ];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="오답 노트" sub="12개 단어"/>
      <div style={{ flex: 1, overflow: 'auto', padding: '4px 14px 70px' }}>
        <PCard padding={10} style={{ background: 'var(--sakura-100)', border: '1px solid var(--primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 22 }}>📝</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 800 }}>12개 단어가 기다려요</div>
              <div style={{ fontSize: 9, color: 'var(--ink2)' }}>복습하면 빠르게 익혀요</div>
            </div>
          </div>
          <div style={{ marginTop: 8 }}><BigButton variant="primary" size="sm">복습 시작 →</BigButton></div>
        </PCard>

        <div style={{ marginTop: 14 }}>
          {items.map((w, i) => (
            <div key={i} style={{
              padding: '10px 0', borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, fontFamily: '"Hiragino Sans"' }}>{w.jp}</div>
                <div style={{ fontSize: 9, color: 'var(--ink2)' }}>{w.kana}</div>
              </div>
              <div style={{ flex: 1 }}/>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: 'var(--ink)' }}>{w.ko}</div>
                <div style={{
                  display: 'inline-block', marginTop: 2,
                  padding: '2px 6px', borderRadius: 999,
                  background: '#FFE5EA', color: '#E53935',
                  fontSize: 8, fontWeight: 800,
                }}>{w.count}회 틀림</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CONVERSATION LIST ───
function ConversationListScreen() {
  const cats = [
    { ic: '💼', n: '일하기', ja: '仕事', c: 14 },
    { ic: '🏨', n: '숙소', ja: '宿泊', c: 14 },
    { ic: '☁️', n: '날씨', ja: '天気', c: 14 },
    { ic: '🍽', n: '식당', ja: 'レストラン', c: 15 },
    { ic: '✈️', n: '여행', ja: '旅行', c: 14 },
    { ic: '🏥', n: '건강', ja: '健康', c: 14 },
  ];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px 14px 10px', background: 'linear-gradient(180deg, var(--sakura-100), transparent)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 20, height: 20, borderRadius: 10, background: 'var(--sakura-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--primary)' }}>💬</div>
          <div style={{ fontSize: 13, fontWeight: 800, fontFamily: 'var(--font-display)' }}>회화</div>
          <span style={{ fontSize: 10, color: 'var(--ink2)' }}>상황별 표현</span>
          <div style={{ flex: 1 }}/>
          <span style={{ fontSize: 11, color: 'var(--ink3)' }}>🔖</span>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 14px 70px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {cats.map((c, i) => (
            <PCard key={i} padding={12}>
              <div style={{ width: 28, height: 28, borderRadius: 14, background: 'var(--sakura-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{c.ic}</div>
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 800 }}>{c.n}</div>
                <div style={{ fontSize: 9, color: 'var(--ink2)', fontFamily: '"Hiragino Sans"' }}>{c.ja}</div>
                <div style={{ fontSize: 8, color: 'var(--ink3)', marginTop: 4 }}>{c.c}개 표현</div>
              </div>
            </PCard>
          ))}
        </div>
        {/* FAB AI chat */}
        <div style={{
          position: 'absolute', bottom: 76, right: 14,
          width: 44, height: 44, borderRadius: 22,
          background: 'var(--primary)', color: 'var(--primary-fg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, boxShadow: 'var(--shadow)',
        }}>🤖</div>
      </div>
      <BottomNav active="chat"/>
    </div>
  );
}

// ─── CONVERSATION DETAIL ───
function ConversationDetailScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="식당" sub="14개 표현"/>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 14px 16px' }}>
        {[
          { jp: 'レストラン', read: 'れすとらん', ko: '레스토랑' },
          { jp: '探しています', read: 'さがしています', ko: '찾고 있습니다' },
        ].map((w, i) => (
          <PCard key={i} padding={12} style={{ marginTop: i ? 8 : 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, fontFamily: '"Hiragino Sans"' }}>{w.jp}</div>
                <div style={{ fontSize: 9, color: 'var(--ink2)' }}>{w.read}</div>
              </div>
              <div style={{ flex: 1 }}/>
              <div style={{
                padding: '4px 8px', borderRadius: 999,
                background: 'var(--sakura-100)', color: 'var(--primary)',
                fontSize: 9, fontWeight: 800,
              }}>🔊</div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink)', marginTop: 6 }}>{w.ko}</div>
            <div style={{
              marginTop: 6, padding: '6px 8px', background: 'var(--surface2)',
              borderRadius: 'var(--radius)', fontSize: 9, color: 'var(--ink2)',
            }}>레스토랑을 찾고 있어요</div>
          </PCard>
        ))}
        <div style={{ marginTop: 14 }}>
          <BigButton variant="primary" icon="🎯">퀴즈로 확인하기</BigButton>
        </div>
      </div>
    </div>
  );
}

// ─── CONVERSATION QUIZ ───
function ConversationQuizScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, background: 'var(--sakura-100)' }}>
        <div style={{ width: 20, height: 20, borderRadius: 10, background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>‹</div>
        <div style={{ fontSize: 10, fontWeight: 800 }}>퀴즈 3/10</div>
        <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--surface2)', overflow: 'hidden' }}>
          <div style={{ width: '30%', height: '100%', background: 'var(--primary)' }}/>
        </div>
      </div>
      <div style={{ flex: 1, padding: '16px 16px 12px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 10, color: 'var(--ink2)', fontWeight: 800, letterSpacing: 1 }}>다음 표현의 뜻은?</div>
        <div style={{ marginTop: 12, padding: 14, background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800, fontFamily: '"Hiragino Sans"', letterSpacing: -0.5 }}>注文 お願いします</div>
          <div style={{ fontSize: 10, color: 'var(--ink2)', marginTop: 4 }}>ちゅうもん おねがいします</div>
        </div>
        <div style={{ flex: 1 }}/>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            '계산 부탁해요',
            '주문 부탁드려요',
            '메뉴 주세요',
            '예약했습니다',
          ].map((o, i) => (
            <div key={i} style={{
              padding: '10px 12px', borderRadius: 'var(--radius)',
              background: i === 1 ? 'var(--sakura-100)' : 'var(--surface)',
              border: `1px solid ${i === 1 ? 'var(--primary)' : 'var(--border)'}`,
              fontSize: 11, fontWeight: 700,
              color: i === 1 ? 'var(--primary)' : 'var(--ink)',
            }}>{String.fromCharCode(65 + i)}. {o}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── AI CONVERSATION (full chat) ───
function AIConversationScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, background: 'var(--sakura-100)' }}>
        <div style={{ width: 20, height: 20, borderRadius: 10, background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>‹</div>
        <div style={{
          width: 26, height: 26, borderRadius: '50%',
          background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '2px solid var(--primary)', fontSize: 14,
        }}>🤖</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800 }}>AI 일본어 튜터</div>
          <div style={{ fontSize: 9, color: 'var(--ink2)' }}>온라인</div>
        </div>
        <div style={{ flex: 1 }}/>
        <div style={{ fontSize: 12, color: 'var(--ink2)' }}>⋯</div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '12px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ alignSelf: 'flex-end', maxWidth: '70%', padding: '8px 10px', borderRadius: 14, background: 'var(--primary)', color: 'var(--primary-fg)', fontSize: 11 }}>안녕하세요</div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
          <Mascot id="sora" size={26}/>
          <div style={{ maxWidth: '75%', padding: '8px 10px', borderRadius: 14, background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 12, fontFamily: '"Hiragino Sans"', fontWeight: 700 }}>こんにちは <span style={{ color: 'var(--primary)' }}>(안녕하세요)</span> 🔊</div>
            <div style={{ fontSize: 10, color: 'var(--ink2)', marginTop: 4, lineHeight: 1.5 }}>
              만나서 정말 반가워요. 앞으로 저와 함께 즐겁게 일본어를 공부해 봐요.
            </div>
          </div>
        </div>
        <div style={{ alignSelf: 'flex-end', maxWidth: '70%', padding: '8px 10px', borderRadius: 14, background: 'var(--primary)', color: 'var(--primary-fg)', fontSize: 11 }}>식당에서 쓸 표현 알려주세요</div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
          <Mascot id="sora" size={26}/>
          <div style={{ maxWidth: '75%', padding: '6px 10px', borderRadius: 14, background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', gap: 3 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--ink3)' }}/>
            ))}
          </div>
        </div>
      </div>
      <div style={{ padding: '8px 12px', borderTop: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ flex: 1, fontSize: 10, color: 'var(--ink3)', padding: '6px 10px', background: 'var(--surface2)', borderRadius: 999 }}>메시지를 입력하세요…</div>
        <div style={{ display: 'flex', gap: 4 }}>
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>🇰🇷</div>
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--primary)', color: 'var(--primary-fg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>✈</div>
        </div>
      </div>
    </div>
  );
}

// ─── CONVERSATION MEMO ───
function ConversationMemoScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="저장한 단어" sub="8개"/>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 14px 16px' }}>
        {[
          { jp: 'レストラン', r: 'れすとらん', k: '레스토랑', cat: '식당' },
          { jp: '予約', r: 'よやく', k: '예약', cat: '식당' },
          { jp: '駅', r: 'えき', k: '역', cat: '여행' },
          { jp: '切符', r: 'きっぷ', k: '표', cat: '여행' },
        ].map((m, i) => (
          <div key={i} style={{
            padding: '10px 0', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 800, fontFamily: '"Hiragino Sans"' }}>{m.jp}</div>
              <div style={{ fontSize: 9, color: 'var(--ink2)' }}>{m.r}</div>
            </div>
            <div style={{ fontSize: 11 }}>{m.k}</div>
            <div style={{
              padding: '2px 6px', borderRadius: 999,
              background: 'var(--sakura-100)', color: 'var(--primary)',
              fontSize: 8, fontWeight: 800,
            }}>{m.cat}</div>
            <span style={{ fontSize: 11, color: 'var(--ink3)' }}>×</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── KANA CHART ───
function KanaChartScreen() {
  const rows = [
    ['あ','い','う','え','お'],
    ['か','き','く','け','こ'],
    ['さ','し','す','せ','そ'],
    ['た','ち','つ','て','と'],
    ['な','に','ぬ','ね','の'],
  ];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="히라가나" sub="50음도"/>
      <div style={{ flex: 1, overflow: 'auto', padding: '4px 14px 16px' }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
          {['히라가나', '가타카나'].map((t, i) => (
            <div key={t} style={{
              flex: 1, padding: '6px 10px', borderRadius: 'var(--radius)',
              background: i === 0 ? 'var(--primary)' : 'var(--surface2)',
              color: i === 0 ? 'var(--primary-fg)' : 'var(--ink2)',
              textAlign: 'center', fontSize: 10, fontWeight: 800,
            }}>{t}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4 }}>
          {rows.flat().map((c, i) => (
            <div key={i} style={{
              aspectRatio: '1/1', borderRadius: 'var(--radius)',
              background: 'var(--surface)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 700, fontFamily: '"Hiragino Sans"',
            }}>{c}</div>
          ))}
        </div>
        <div style={{ marginTop: 12 }}>
          <BigButton variant="primary" icon="🎮">미니게임으로 외우기</BigButton>
        </div>
      </div>
    </div>
  );
}

// ─── KANA GAME ───
function KanaGameScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, background: 'var(--sakura-100)' }}>
        <div style={{ width: 20, height: 20, borderRadius: 10, background: 'var(--surface)', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</div>
        <div style={{
          padding: '3px 8px', borderRadius: 999,
          background: 'var(--primary)', color: 'var(--primary-fg)',
          fontSize: 9, fontWeight: 800,
        }}>SCORE 24</div>
        <div style={{ flex: 1 }}/>
        <div style={{ fontSize: 11 }}>⏱ 0:12</div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 16, position: 'relative' }}>
        <Mascot id="sora" size={56} bobbing/>
        <div style={{ fontSize: 10, color: 'var(--ink2)', marginTop: 6, fontWeight: 800, letterSpacing: 1 }}>이 음은?</div>
        <div style={{
          marginTop: 10, width: 80, height: 80, borderRadius: '50%',
          background: 'var(--primary)', color: 'var(--primary-fg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 36, fontWeight: 800, fontFamily: '"Hiragino Sans"',
          boxShadow: 'var(--shadow)',
        }}>ね</div>
      </div>
      <div style={{ padding: '0 14px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
          {['ne', 'no', 'me', 'na', 'ni', 'ke'].map((o, i) => (
            <div key={i} style={{
              padding: '10px 0', borderRadius: 'var(--radius)',
              background: 'var(--surface)', border: '1px solid var(--border)',
              textAlign: 'center', fontSize: 12, fontWeight: 800,
              fontFamily: 'ui-monospace, monospace',
            }}>{o}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── KANJI ───
function KanjiScreen() {
  const kanji = [
    { c: '学', m: '배울', n: 'N5' },
    { c: '生', m: '날', n: 'N5' },
    { c: '時', m: '때', n: 'N5' },
    { c: '間', m: '사이', n: 'N5' },
    { c: '人', m: '사람', n: 'N5' },
    { c: '本', m: '책', n: 'N5' },
  ];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="한자 카드" sub="N5~N3 · 240자"/>
      <div style={{ flex: 1, overflow: 'auto', padding: '4px 14px 16px' }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
          {['N5', 'N4', 'N3'].map((l, i) => (
            <div key={l} style={{
              flex: 1, padding: '5px 8px', borderRadius: 'var(--radius)',
              background: i === 0 ? 'var(--primary)' : 'var(--surface2)',
              color: i === 0 ? 'var(--primary-fg)' : 'var(--ink2)',
              textAlign: 'center', fontSize: 10, fontWeight: 800,
            }}>{l}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {kanji.map((k, i) => (
            <PCard key={i} padding={12} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 38, fontWeight: 800, fontFamily: '"Hiragino Sans", "Noto Sans JP", serif',
                letterSpacing: -1, lineHeight: 1,
              }}>{k.c}</div>
              <div style={{ fontSize: 10, color: 'var(--ink2)', marginTop: 6 }}>{k.m}</div>
              <div style={{ fontSize: 8, color: 'var(--primary)', fontWeight: 800, marginTop: 2 }}>{k.n}</div>
            </PCard>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── READING ───
function ReadingScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="짧은 글" sub="10편 + AI"/>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 14px 16px' }}>
        <PCard padding={12} style={{
          background: 'linear-gradient(135deg, var(--sakura-100), var(--surface))',
          marginBottom: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--primary)', color: 'var(--primary-fg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>✨</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 800 }}>AI 맞춤 글</div>
              <div style={{ fontSize: 9, color: 'var(--ink2)' }}>관심사로 직접 생성</div>
            </div>
            <span style={{ fontSize: 11 }}>›</span>
          </div>
        </PCard>
        {[
          { t: '私の一日', sub: '하루 일과', lv: 'N5', m: '3분' },
          { t: '夏の思い出', sub: '여름의 추억', lv: 'N4', m: '5분' },
          { t: '日本の四季', sub: '일본의 사계절', lv: 'N3', m: '7분' },
        ].map((r, i) => (
          <PCard key={i} padding={12} style={{ marginTop: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 8,
                background: 'var(--sakura-100)', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
              }}>📖</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 800, fontFamily: '"Hiragino Sans"' }}>{r.t}</div>
                <div style={{ fontSize: 9, color: 'var(--ink2)' }}>{r.sub}</div>
                <div style={{ marginTop: 4, display: 'flex', gap: 6 }}>
                  <span style={{ fontSize: 8, color: 'var(--primary)', fontWeight: 800 }}>{r.lv}</span>
                  <span style={{ fontSize: 8, color: 'var(--ink3)' }}>· {r.m}</span>
                </div>
              </div>
            </div>
          </PCard>
        ))}
      </div>
    </div>
  );
}

// ─── READING DETAIL ───
function ReadingDetailScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="私の一日"/>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 14px 24px' }}>
        <div style={{ fontSize: 8, color: 'var(--primary)', fontWeight: 800, letterSpacing: 2 }}>N5 · 3분</div>
        <div style={{
          marginTop: 4, fontSize: 18, fontWeight: 800, letterSpacing: -0.3,
          fontFamily: '"Hiragino Sans", serif',
        }}>私の一日</div>
        <div style={{ fontSize: 10, color: 'var(--ink2)', marginTop: 2 }}>나의 하루</div>
        <div style={{
          marginTop: 12, fontSize: 13, lineHeight: 1.9,
          fontFamily: '"Hiragino Sans", serif',
        }}>
          <p>毎朝、私は <ruby style={{ color: 'var(--primary)' }}>七時<rt style={{ fontSize: 7 }}>しちじ</rt></ruby>に起きます。</p>
          <p>顔を洗って、朝ごはんを食べます。</p>
          <p>パンと牛乳が好きです。</p>
          <p>八時に学校へ行きます。</p>
        </div>
        <div style={{ marginTop: 14 }}>
          <BigButton variant="primary" size="sm">🔊 전체 읽어주기</BigButton>
        </div>
      </div>
    </div>
  );
}

// ─── WRITING ───
function WritingScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="AI 작문" sub="첨삭 받기"/>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 14px 16px' }}>
        <PCard padding={10} style={{ background: 'var(--sakura-100)', border: '1px solid var(--primary)' }}>
          <div style={{ fontSize: 9, color: 'var(--primary)', fontWeight: 800, letterSpacing: 1 }}>오늘의 주제</div>
          <div style={{ fontSize: 12, fontWeight: 800, marginTop: 2 }}>좋아하는 음식 소개하기</div>
          <div style={{ fontSize: 9, color: 'var(--ink2)', marginTop: 2 }}>N5 · 3~5문장</div>
        </PCard>
        <div style={{ marginTop: 10, fontSize: 9, color: 'var(--ink3)', fontWeight: 800, letterSpacing: 1 }}>내가 쓴 글</div>
        <PCard padding={10} style={{ marginTop: 4 }}>
          <div style={{ fontSize: 11, fontFamily: '"Hiragino Sans"', lineHeight: 1.7 }}>
            私はラーメンが好きです。<br/>
            毎週、友達と食べに行きます。<br/>
            一番美味しいのは<span style={{ background: '#FFE5EA', textDecoration: 'line-through', textDecorationColor: '#E53935' }}>豚骨</span>です。
          </div>
        </PCard>
        <div style={{ marginTop: 10, fontSize: 9, color: 'var(--ink3)', fontWeight: 800, letterSpacing: 1 }}>AI 첨삭</div>
        <PCard padding={10} style={{ marginTop: 4, background: 'var(--surface2)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
            <span style={{ fontSize: 12 }}>✨</span>
            <div style={{ fontSize: 10, color: 'var(--ink)', lineHeight: 1.6 }}>
              "豚骨ラーメン"이라고 종류를 명시하면 더 자연스러워요. <b style={{ color: 'var(--primary)' }}>일본어 문법 정확도 92%</b>
            </div>
          </div>
        </PCard>
      </div>
    </div>
  );
}

// ─── SONGS ───
function SongsScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="동요" sub="가사로 배우기"/>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 14px 16px' }}>
        {[
          { t: 'さくらさくら', sub: '벚꽃 벚꽃', g: ['#FFD9E2','#FFB6CE'] },
          { t: 'ふるさと', sub: '고향', g: ['#C5E8FF','#7FB8E6'] },
          { t: '夕焼け小焼け', sub: '저녁노을', g: ['#FFE38A','#FF8A4D'] },
        ].map((s, i) => (
          <div key={i} style={{
            marginTop: i ? 8 : 0,
            borderRadius: 'var(--radius-lg)',
            background: `linear-gradient(135deg, ${s.g[0]}, ${s.g[1]})`,
            padding: 14, display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 8, background: 'rgba(255,255,255,0.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
            }}>🎵</div>
            <div style={{ flex: 1, color: 'var(--ink)' }}>
              <div style={{ fontSize: 13, fontWeight: 800, fontFamily: '"Hiragino Sans"' }}>{s.t}</div>
              <div style={{ fontSize: 10, opacity: 0.7 }}>{s.sub}</div>
            </div>
            <div style={{
              width: 30, height: 30, borderRadius: 15,
              background: 'rgba(255,255,255,0.8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12,
            }}>▶</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MOCK TEST ───
function MockTestScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="JLPT 모의고사"/>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 14px 16px' }}>
        {[
          { l: 'N5', d: '입문', q: 60, t: '45분', col: '#7FB8E6' },
          { l: 'N4', d: '초보', q: 80, t: '60분', col: '#2EBD6B' },
          { l: 'N3', d: '중급', q: 100, t: '90분', col: '#FF8A4D' },
        ].map((t, i) => (
          <PCard key={i} padding={14} style={{ marginTop: i ? 8 : 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: t.col, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 800, letterSpacing: -0.5,
              }}>{t.l}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 800 }}>{t.d} · {t.l}</div>
                <div style={{ fontSize: 9, color: 'var(--ink2)', marginTop: 2 }}>{t.q}문제 · {t.t}</div>
              </div>
              <span style={{ fontSize: 12, color: 'var(--ink3)' }}>›</span>
            </div>
          </PCard>
        ))}
      </div>
    </div>
  );
}

// ─── PROFILE ───
function ProfileScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="마이페이지"/>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 14px 16px' }}>
        <div style={{ textAlign: 'center', padding: '14px 0' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: 'var(--sakura-100)',
            border: '3px solid var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
            margin: '0 auto',
          }}>🌸</div>
          <div style={{ marginTop: 8, fontSize: 14, fontWeight: 800 }}>데모 사용자</div>
          <div style={{ fontSize: 10, color: 'var(--ink2)' }}>demo@test.com</div>
          <div style={{
            display: 'inline-block', marginTop: 6,
            padding: '3px 10px', borderRadius: 999,
            background: 'var(--sakura-100)', color: 'var(--primary)',
            fontSize: 9, fontWeight: 800,
          }}>● Lv.1 입문자</div>
        </div>

        <PCard padding={0} style={{ overflow: 'hidden', marginTop: 10 }}>
          {[
            { ic: '🏆', l: '내 배지', r: '4 / 11' },
            { ic: '📊', l: '학습 통계', r: '' },
            { ic: '🗃', l: '데이터 내보내기', r: '' },
          ].map((r, i, arr) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
              borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--sakura-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>{r.ic}</div>
              <div style={{ flex: 1, fontSize: 11, fontWeight: 600 }}>{r.l}</div>
              {r.r && <span style={{ fontSize: 9, color: 'var(--ink2)' }}>{r.r}</span>}
              <span style={{ fontSize: 10, color: 'var(--ink3)' }}>›</span>
            </div>
          ))}
        </PCard>

        <PCard padding={0} style={{ overflow: 'hidden', marginTop: 10 }}>
          {[
            { ic: '🔄', l: '학습 데이터 초기화', danger: false },
            { ic: '🚪', l: '로그아웃', danger: false },
            { ic: '⚠️', l: '계정 탈퇴', danger: true },
          ].map((r, i, arr) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
              borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
              color: r.danger ? '#E53935' : 'var(--ink)',
            }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: r.danger ? '#FFE5EA' : 'var(--sakura-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>{r.ic}</div>
              <div style={{ flex: 1, fontSize: 11, fontWeight: 600 }}>{r.l}</div>
              <span style={{ fontSize: 10, color: 'var(--ink3)' }}>›</span>
            </div>
          ))}
        </PCard>
      </div>
    </div>
  );
}

// ─── NOTIFICATION SETTINGS ───
function NotificationScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="알림 설정"/>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 14px 16px' }}>
        <div style={{ fontSize: 9, color: 'var(--ink3)', fontWeight: 800, letterSpacing: 1 }}>요일</div>
        <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
          {['일','월','화','수','목','금','토'].map((d, i) => (
            <div key={d} style={{
              flex: 1, height: 32, borderRadius: 'var(--radius)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: [1,2,3,4,5].includes(i) ? 'var(--primary)' : 'var(--surface2)',
              color: [1,2,3,4,5].includes(i) ? 'var(--primary-fg)' : 'var(--ink2)',
              fontSize: 10, fontWeight: 800,
            }}>{d}</div>
          ))}
        </div>
        <div style={{ marginTop: 14, fontSize: 9, color: 'var(--ink3)', fontWeight: 800, letterSpacing: 1 }}>시각</div>
        <PCard padding={12} style={{ marginTop: 6, background: 'var(--surface2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>20:00</div>
              <div style={{ fontSize: 9, color: 'var(--ink2)', marginTop: 2 }}>매일 학습 시간</div>
            </div>
            <div style={{ width: 100, height: 4, borderRadius: 2, background: 'var(--surface)', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '60%', top: -4, width: 12, height: 12, borderRadius: 6, background: 'var(--primary)', boxShadow: 'var(--shadow)' }}/>
            </div>
          </div>
        </PCard>
        <div style={{ marginTop: 14, fontSize: 9, color: 'var(--ink3)', fontWeight: 800, letterSpacing: 1 }}>알림 종류</div>
        <PCard padding={0} style={{ marginTop: 6, overflow: 'hidden' }}>
          {[
            { l: '학습 리마인더', t: true },
            { l: '연속 학습 격려', t: true },
            { l: 'AI 튜터 메시지', t: false },
          ].map((r, i, arr) => (
            <div key={i} style={{
              padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10,
              borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{ flex: 1, fontSize: 11 }}>{r.l}</div>
              <div style={{
                width: 28, height: 16, borderRadius: 8,
                background: r.t ? 'var(--primary)' : 'var(--surface2)',
                display: 'flex', alignItems: 'center', padding: 2,
              }}>
                <div style={{ width: 12, height: 12, borderRadius: 6, background: '#fff', marginLeft: r.t ? 12 : 0 }}/>
              </div>
            </div>
          ))}
        </PCard>
      </div>
    </div>
  );
}

Object.assign(window, {
  DictionaryScreen, StatsScreen, WrongWordsScreen,
  ConversationListScreen, ConversationDetailScreen, ConversationQuizScreen, AIConversationScreen, ConversationMemoScreen,
  KanaChartScreen, KanaGameScreen, KanjiScreen,
  ReadingScreen, ReadingDetailScreen, WritingScreen,
  SongsScreen, MockTestScreen,
  ProfileScreen, NotificationScreen,
});
