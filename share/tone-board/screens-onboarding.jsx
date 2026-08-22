// Onboarding flow screens: Splash → Login → Goal → Ready

function SplashScreen() {
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 16,
      background: 'linear-gradient(160deg, var(--primary) 0%, var(--sakura-200) 100%)',
      color: 'var(--primary-fg)', position: 'relative',
    }}>
      <Mascot id="kotaro" size={90} bobbing/>
      <div style={{
        fontSize: 36, fontWeight: 800, letterSpacing: -1.5,
        fontFamily: 'var(--font-display)',
      }}>にほんご</div>
      <div style={{ fontSize: 10, letterSpacing: 5, opacity: 0.85, fontWeight: 700 }}>
        NIHONGO
      </div>
    </div>
  );
}

function LoginScreen() {
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      padding: '40px 20px 24px', boxSizing: 'border-box',
    }}>
      <div style={{ marginBottom: 24 }}>
        <Mascot id="kotaro" size={50}/>
      </div>
      <div style={{ fontSize: 11, letterSpacing: 3, color: 'var(--primary)', fontWeight: 800 }}>WELCOME</div>
      <div style={{ marginTop: 6, fontSize: 22, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1.2, fontFamily: 'var(--font-display)' }}>
        함께 시작해볼까요?
      </div>
      <div style={{ marginTop: 6, fontSize: 11, color: 'var(--ink2)', lineHeight: 1.5 }}>
        매일 5분, 즐겁게 일본어
      </div>
      <div style={{ flex: 1 }}/>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{
          background: '#FEE500', color: '#3C1E1E',
          padding: '11px 12px', borderRadius: 'var(--radius-lg)',
          fontSize: 12, fontWeight: 800, textAlign: 'center',
        }}>💬 카카오로 시작</div>
        <div style={{
          background: '#000', color: '#fff',
          padding: '11px 12px', borderRadius: 'var(--radius-lg)',
          fontSize: 12, fontWeight: 800, textAlign: 'center',
        }}>🍎 Apple로 시작</div>
        <div style={{
          background: '#fff', color: '#222', border: '1px solid var(--border)',
          padding: '11px 12px', borderRadius: 'var(--radius-lg)',
          fontSize: 12, fontWeight: 800, textAlign: 'center',
        }}>G &nbsp; Google로 시작</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '4px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
          <span style={{ fontSize: 10, color: 'var(--ink3)' }}>또는</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
        </div>
        <div style={{ fontSize: 11, color: 'var(--ink2)', textAlign: 'center' }}>
          이메일로 시작하기
        </div>
      </div>
    </div>
  );
}

function GoalScreen() {
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      padding: '40px 18px 24px', boxSizing: 'border-box',
    }}>
      <div style={{ fontSize: 10, letterSpacing: 3, color: 'var(--primary)', fontWeight: 800 }}>STEP 1 OF 2</div>
      <div style={{ marginTop: 6, fontSize: 20, fontWeight: 800, letterSpacing: -0.4, lineHeight: 1.2, fontFamily: 'var(--font-display)' }}>
        하루 학습 목표는?
      </div>
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { m: '5분', l: '가볍게', xp: '50 XP', active: false },
          { m: '10분', l: '꾸준히', xp: '100 XP', active: true },
          { m: '20분', l: '진지하게', xp: '200 XP' },
          { m: '30분', l: '몰입하기', xp: '300 XP' },
        ].map((g, i) => (
          <PCard key={i} padding={10} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            border: `1px solid ${g.active ? 'var(--primary)' : 'var(--border)'}`,
            background: g.active ? 'var(--sakura-100)' : 'var(--surface)',
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8,
              background: g.active ? 'var(--primary)' : 'var(--surface2)',
              color: g.active ? 'var(--primary-fg)' : 'var(--ink)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 800,
            }}>{g.m}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 800 }}>{g.l}</div>
              <div style={{ fontSize: 9, color: 'var(--ink2)' }}>{g.xp}</div>
            </div>
            <div style={{
              width: 14, height: 14, borderRadius: 7,
              background: g.active ? 'var(--primary)' : 'transparent',
              border: `1.5px solid ${g.active ? 'var(--primary)' : 'var(--border)'}`,
            }}/>
          </PCard>
        ))}
      </div>
      <div style={{ flex: 1 }}/>
      <BigButton variant="primary">계속하기</BigButton>
    </div>
  );
}

function ReadyScreen() {
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      padding: '40px 18px 24px', boxSizing: 'border-box',
      background: 'linear-gradient(180deg, var(--sakura-100), var(--bg) 60%)',
      alignItems: 'center', justifyContent: 'center',
    }}>
      <Mascot id="kotaro" size={84} bobbing/>
      <div style={{ marginTop: 20, fontSize: 10, letterSpacing: 3, color: 'var(--primary)', fontWeight: 800 }}>
        READY!
      </div>
      <div style={{
        marginTop: 6, fontSize: 22, fontWeight: 800, letterSpacing: -0.5,
        textAlign: 'center', lineHeight: 1.25,
        fontFamily: 'var(--font-display)',
      }}>
        준비 완료!<br/>이제 시작해요.
      </div>
      <div style={{
        marginTop: 8, fontSize: 11, color: 'var(--ink2)',
        textAlign: 'center', lineHeight: 1.6,
      }}>
        첫 학습을 시작하면<br/>+25 XP를 받아요.
      </div>
      <div style={{ flex: 1 }}/>
      <BigButton variant="primary" icon="📖">오늘의 학습 시작하기</BigButton>
    </div>
  );
}

Object.assign(window, { SplashScreen, LoginScreen, GoalScreen, ReadyScreen });
