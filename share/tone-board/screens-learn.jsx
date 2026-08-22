// Learning loop screens: Learning → WrongModal → Result

function LearningScreen() {
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
    }}>
      {/* progress */}
      <div style={{
        padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 8,
        background: 'var(--sakura-100)',
      }}>
        <div style={{ width: 20, height: 20, borderRadius: 10, background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>‹</div>
        <div style={{
          padding: '3px 10px', borderRadius: 999,
          background: 'var(--primary)', color: 'var(--primary-fg)',
          fontSize: 9, fontWeight: 800,
        }}>🏆 5/20</div>
        <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--surface2)', overflow: 'hidden' }}>
          <div style={{ width: '25%', height: '100%', background: 'var(--primary)' }}/>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 30, position: 'relative' }}>
        <div style={{
          fontSize: 56, fontWeight: 800, letterSpacing: -2,
          fontFamily: '"Hiragino Sans", "Noto Sans JP", serif',
        }}>努力</div>
        <div style={{ marginTop: 6, fontSize: 13, color: 'var(--ink2)', fontFamily: '"Hiragino Sans"' }}>どりょく</div>
        <div style={{ fontSize: 11, color: 'var(--ink3)', fontFamily: 'ui-monospace, monospace' }}>doryoku</div>
        <div style={{
          marginTop: 14, padding: '5px 12px', borderRadius: 999,
          background: 'var(--surface)', border: '1px solid var(--border)',
          fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4,
        }}>🔊 단어 듣기</div>

        {/* mascot bottom-left */}
        <div style={{
          position: 'absolute', bottom: 14, left: 14,
        }}>
          <Mascot id="sora" size={36}/>
        </div>
      </div>
      <div style={{
        padding: '10px 14px 16px',
        borderTop: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        <div style={{
          background: 'var(--surface2)', borderRadius: 'var(--radius)',
          padding: '10px 12px', fontSize: 11, color: 'var(--ink3)',
        }}>뜻을 입력하세요</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <BigButton variant="outline" size="sm">💡 힌트</BigButton>
          <BigButton variant="primary" size="sm">확인</BigButton>
        </div>
      </div>
    </div>
  );
}

function WrongModalScreen() {
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: 'rgba(0,0,0,0.5)', position: 'relative',
    }}>
      {/* faded learning page behind */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'var(--bg)', opacity: 0.3, pointerEvents: 'none',
      }}/>
      <div style={{
        position: 'relative', margin: 'auto', width: 240,
        background: 'var(--surface)', borderRadius: 'var(--radius-xl)',
        padding: 18, boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center',
      }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#E53935', display: 'flex', alignItems: 'center', gap: 6 }}>
          ✗ 오답
        </div>
        <div style={{ width: '100%', height: 1, background: 'var(--border)' }}/>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -1, fontFamily: '"Hiragino Sans"' }}>貧しい</div>
          <div style={{ fontSize: 11, color: 'var(--ink2)', marginTop: 2 }}>まずしい</div>
          <div style={{ fontSize: 9, color: 'var(--ink3)' }}>mazushii</div>
          <div style={{ marginTop: 6, fontSize: 14, color: 'var(--primary)', fontWeight: 700 }}>가난한</div>
        </div>
        <div style={{
          padding: '6px 12px', borderRadius: 999,
          background: 'var(--surface2)', fontSize: 10, fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: 4,
        }}>🔊 발음 듣기</div>
        <div style={{ fontSize: 10, color: 'var(--ink2)', textAlign: 'center' }}>오답노트에 추가할까요?</div>
        <BigButton variant="primary" size="sm">📋 오답노트에 추가</BigButton>
        <BigButton variant="outline" size="sm">→ 그냥 진행하기</BigButton>
      </div>
    </div>
  );
}

function ResultScreen() {
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      padding: '40px 18px 24px', boxSizing: 'border-box',
      background: 'linear-gradient(180deg, var(--sakura-100), var(--bg) 50%)',
      alignItems: 'center',
    }}>
      <div style={{ fontSize: 10, letterSpacing: 3, color: 'var(--primary)', fontWeight: 800 }}>SESSION COMPLETE</div>
      <div style={{ marginTop: 6, fontSize: 22, fontWeight: 800, textAlign: 'center', fontFamily: 'var(--font-display)' }}>
        잘했어요!
      </div>

      <div style={{
        marginTop: 14, position: 'relative',
      }}>
        <div style={{
          width: 130, height: 130, borderRadius: '50%',
          background: 'conic-gradient(var(--primary) 80%, var(--surface2) 80%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: 110, height: 110, borderRadius: '50%', background: 'var(--surface)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'inset 0 0 0 1px var(--border)',
          }}>
            <div style={{ fontSize: 9, color: 'var(--ink3)', fontWeight: 700, letterSpacing: 1 }}>정답률</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--primary)', letterSpacing: -1, lineHeight: 1 }}>80%</div>
            <div style={{ fontSize: 10, color: 'var(--ink2)', marginTop: 2 }}>16 / 20</div>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: -10, right: -16 }}>
          <Mascot id="kotaro" size={50}/>
        </div>
      </div>

      <div style={{ marginTop: 18, width: '100%', display: 'flex', gap: 8 }}>
        <PCard padding={10} style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 9, color: 'var(--ink3)', fontWeight: 700, letterSpacing: 1 }}>XP</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)', marginTop: 2 }}>+85</div>
        </PCard>
        <PCard padding={10} style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 9, color: 'var(--ink3)', fontWeight: 700, letterSpacing: 1 }}>STREAK</div>
          <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2 }}>🔥 7일</div>
        </PCard>
      </div>

      <div style={{ flex: 1 }}/>
      <BigButton variant="primary">계속하기</BigButton>
    </div>
  );
}

Object.assign(window, { LearningScreen, WrongModalScreen, ResultScreen });
