// All screens of the login + onboarding flow
// Each screen receives { go, state, setState, tweaks } props

const screenPad = { padding: '0 28px', boxSizing: 'border-box', width: '100%' };

// ─────────────────────── Splash ───────────────────────
function SplashScreen({ go, tweaks }) {
  React.useEffect(() => {
    const t = setTimeout(() => go('welcome'), 1600 / tweaks.speed);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: `linear-gradient(160deg, ${tweaks.primary} 0%, #FF8FB1 100%)`,
      color: '#fff', position: 'relative', overflow: 'hidden',
    }}>
      {/* floating bubbles */}
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: 40 + i * 14, height: 40 + i * 14,
          left: `${(i * 17 + 7) % 90}%`, top: `${(i * 23 + 5) % 90}%`,
          borderRadius: '50%', background: 'rgba(255,255,255,0.12)',
          animation: `floatBubble ${(6 + i) / tweaks.speed}s ease-in-out infinite`,
          animationDelay: `${-i * 0.7}s`,
        }} />
      ))}
      <div style={{
        fontSize: 56, fontWeight: 800, letterSpacing: -2,
        fontFamily: '"Hiragino Sans","Noto Sans JP",serif',
        animation: 'splashLogo 1.2s cubic-bezier(.2,.7,.2,1.05)',
      }}>ことば</div>
      <div style={{
        marginTop: 12, fontSize: 15, opacity: 0.85, letterSpacing: 6,
        animation: 'fadeUp 1s 0.4s both ease-out',
      }}>KOTOBA</div>
    </div>
  );
}

// ─────────────────────── Welcome ───────────────────────
function WelcomeScreen({ go, tweaks }) {
  const M = MASCOTS[tweaks.mascot].Comp;
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: '#fff', paddingTop: 60,
      animation: `screenIn ${0.5/tweaks.speed}s ease-out`,
    }}>
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', position: 'relative',
      }}>
        {/* soft halo */}
        <div style={{
          position: 'absolute', width: 280, height: 280, borderRadius: '50%',
          background: `radial-gradient(circle, ${tweaks.primary}22 0%, transparent 70%)`,
          animation: 'haloPulse 3.4s ease-in-out infinite',
        }} />
        <M size={160} bobbing />
        <div style={{
          marginTop: 28, fontSize: 11, letterSpacing: 3,
          color: tweaks.primary, fontWeight: 700,
        }}>WELCOME TO KOTOBA</div>
        <div style={{
          marginTop: 12, fontSize: 30, fontWeight: 800, letterSpacing: -0.8,
          textAlign: 'center', lineHeight: 1.25,
        }}>일본어, 함께<br/>시작해볼까요?</div>
        <div style={{
          marginTop: 14, fontSize: 15, color: '#6B6B6B',
          textAlign: 'center', lineHeight: 1.5, maxWidth: 280,
        }}>매일 5분, N5에서 N3까지<br/>가장 쉽고 빠르게.</div>
      </div>
      <div style={{ ...screenPad, paddingBottom: 40, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <BigButton primary={tweaks.primary} onClick={() => go('auth')}>시작하기</BigButton>
        <button onClick={() => go('auth')} style={{
          background: 'none', border: 'none', fontSize: 14, color: '#6B6B6B',
          padding: 12, cursor: 'pointer', fontWeight: 500,
        }}>이미 계정이 있어요 · <span style={{ color: tweaks.primary, fontWeight: 700 }}>로그인</span></button>
      </div>
    </div>
  );
}

// ─────────────────────── Auth method ───────────────────────
function AuthScreen({ go, tweaks, setState }) {
  const providers = [
    { id: 'kakao', name: '카카오로 계속하기', bg: '#FEE500', fg: '#3C1E1E', icon: (
      <svg width="20" height="20" viewBox="0 0 20 20"><path fill="#3C1E1E" d="M10 3C5.6 3 2 5.9 2 9.5c0 2.3 1.5 4.3 3.7 5.4l-.9 3.3c-.1.3.3.6.6.4l3.9-2.6c.2 0 .5 0 .7 0 4.4 0 8-2.9 8-6.5S14.4 3 10 3z"/></svg>
    ) },
    { id: 'apple', name: 'Apple로 계속하기', bg: '#000', fg: '#fff', icon: (
      <svg width="20" height="20" viewBox="0 0 20 20"><path fill="#fff" d="M13.6 10.5c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.5-.2-2.8.9-3.6.9-.7 0-1.9-.9-3.1-.8C3.9 5.4 2.5 6.4 1.7 8c-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.3 0 2.1-1.1 2.8-2.2.9-1.3 1.3-2.5 1.3-2.6-.1 0-2.5-.9-2.5-3.8zM11.2 3.7c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.6.6-1.1 1.6-1 2.6 1 .1 2-.5 2.6-1.2z"/></svg>
    ) },
    { id: 'google', name: 'Google로 계속하기', bg: '#fff', fg: '#1A1A1A', border: true, icon: (
      <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.6 9.2c0-.6-.1-1.2-.2-1.8H9v3.4h4.8c-.2 1.1-.8 2-1.8 2.6v2.2h2.9c1.7-1.5 2.7-3.8 2.7-6.4z"/><path fill="#34A853" d="M9 18c2.4 0 4.5-.8 6-2.2L12 13.6c-.8.6-1.9.9-3 .9-2.3 0-4.3-1.6-5-3.7H1v2.3C2.5 16 5.5 18 9 18z"/><path fill="#FBBC04" d="M4 10.8c-.4-1.1-.4-2.3 0-3.4V5H1c-1.3 2.5-1.3 5.5 0 8l3-2.2z"/><path fill="#EA4335" d="M9 3.6c1.3 0 2.5.5 3.4 1.3l2.6-2.6C13.4.9 11.3 0 9 0 5.5 0 2.5 2 1 5l3 2.3c.7-2.1 2.7-3.7 5-3.7z"/></svg>
    ) },
  ];
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: '#fff', paddingTop: 80,
      animation: `screenIn ${0.5/tweaks.speed}s ease-out`,
    }}>
      <div style={{ ...screenPad }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: tweaks.primary, fontWeight: 700 }}>STEP 1 OF 6</div>
        <div style={{ marginTop: 12, fontSize: 28, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1.2 }}>
          어떻게 시작할까요?
        </div>
        <div style={{ marginTop: 8, fontSize: 14, color: '#6B6B6B', lineHeight: 1.5 }}>
          소셜 계정이면 30초면 끝나요.
        </div>
      </div>
      <div style={{ ...screenPad, marginTop: 40, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {providers.map((p, i) => (
          <button key={p.id} onClick={() => { setState({ provider: p.id }); go('quizIntro'); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center',
              padding: '16px 18px', borderRadius: 14, cursor: 'pointer',
              background: p.bg, color: p.fg,
              border: p.border ? '1px solid #E5E5E5' : 'none',
              fontSize: 15, fontWeight: 700, letterSpacing: -0.2,
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              animation: `slideUp ${0.5/tweaks.speed}s ${i*0.06}s both cubic-bezier(.2,.7,.2,1.05)`,
              transition: 'transform .15s',
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {p.icon}{p.name}
          </button>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '10px 0' }}>
          <div style={{ flex: 1, height: 1, background: '#EEE' }} />
          <div style={{ fontSize: 12, color: '#A3A3A3' }}>또는</div>
          <div style={{ flex: 1, height: 1, background: '#EEE' }} />
        </div>
        <button onClick={() => { setState({ provider: 'email' }); go('email'); }}
          style={{
            padding: '16px 18px', borderRadius: 14, cursor: 'pointer',
            background: '#F4F4F4', color: '#1A1A1A', border: 'none',
            fontSize: 15, fontWeight: 700,
          }}>이메일로 시작하기</button>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ ...screenPad, paddingBottom: 32, fontSize: 11, color: '#A3A3A3', textAlign: 'center', lineHeight: 1.6 }}>
        계속하면 <span style={{ textDecoration: 'underline' }}>이용약관</span> 및{' '}
        <span style={{ textDecoration: 'underline' }}>개인정보처리방침</span>에<br/>동의하는 것으로 간주됩니다.
      </div>
    </div>
  );
}

// ─────────────────────── Email form ───────────────────────
function EmailScreen({ go, tweaks, state, setState }) {
  const [email, setEmail] = React.useState(state.email || '');
  const [pw, setPw] = React.useState('');
  const [focus, setFocus] = React.useState('');
  const valid = email.includes('@') && pw.length >= 6;
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: '#fff', paddingTop: 80,
      animation: `screenIn ${0.5/tweaks.speed}s ease-out`,
    }}>
      <div style={{ ...screenPad }}>
        <button onClick={() => go('auth')} style={{
          width: 36, height: 36, borderRadius: 12, border: '1px solid #EEE',
          background: '#fff', cursor: 'pointer', fontSize: 18, marginBottom: 20,
        }}>‹</button>
        <div style={{ fontSize: 11, letterSpacing: 3, color: tweaks.primary, fontWeight: 700 }}>STEP 1 OF 6</div>
        <div style={{ marginTop: 12, fontSize: 28, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1.2 }}>
          이메일로 시작하기
        </div>
      </div>
      <div style={{ ...screenPad, marginTop: 32, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Field label="이메일" focus={focus === 'e'} primary={tweaks.primary}>
          <input value={email} onChange={e => setEmail(e.target.value)}
            onFocus={() => setFocus('e')} onBlur={() => setFocus('')}
            placeholder="hello@kotoba.app" type="email"
            style={inputStyle}/>
        </Field>
        <Field label="비밀번호" focus={focus === 'p'} primary={tweaks.primary}>
          <input value={pw} onChange={e => setPw(e.target.value)}
            onFocus={() => setFocus('p')} onBlur={() => setFocus('')}
            placeholder="6자 이상" type="password"
            style={inputStyle}/>
        </Field>
        <div style={{ fontSize: 12, color: '#A3A3A3', marginTop: 4 }}>
          영문, 숫자 포함 6자 이상 권장
        </div>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ ...screenPad, paddingBottom: 32 }}>
        <BigButton primary={tweaks.primary} disabled={!valid}
          onClick={() => { setState({ email }); go('quizIntro'); }}>
          계속하기
        </BigButton>
      </div>
    </div>
  );
}

function Field({ label, focus, primary, children }) {
  return (
    <div style={{
      border: `1.5px solid ${focus ? primary : '#E5E5E5'}`,
      borderRadius: 14, padding: '10px 14px', background: '#fff',
      transition: 'border-color .2s, box-shadow .2s',
      boxShadow: focus ? `0 0 0 4px ${primary}22` : 'none',
    }}>
      <div style={{ fontSize: 11, color: focus ? primary : '#A3A3A3', fontWeight: 700, letterSpacing: 0.5 }}>
        {label}
      </div>
      {children}
    </div>
  );
}
const inputStyle = {
  width: '100%', border: 'none', outline: 'none',
  fontSize: 16, padding: '4px 0 2px', background: 'transparent',
  fontFamily: 'inherit',
};

// ─────────────────────── Quiz intro ───────────────────────
function QuizIntroScreen({ go, tweaks }) {
  const M = MASCOTS[tweaks.mascot].Comp;
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: '#fff', paddingTop: 80,
      animation: `screenIn ${0.5/tweaks.speed}s ease-out`,
    }}>
      <div style={{ ...screenPad }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: tweaks.primary, fontWeight: 700 }}>STEP 2 OF 6</div>
        <div style={{ marginTop: 12, fontSize: 28, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1.2 }}>
          레벨을 확인할게요
        </div>
        <div style={{ marginTop: 10, fontSize: 14, color: '#6B6B6B', lineHeight: 1.5 }}>
          3문제만 풀면 끝. 모르면 건너뛰어도 괜찮아요.
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div style={{
          position: 'absolute', width: 240, height: 240, borderRadius: '50%',
          background: `radial-gradient(circle, ${tweaks.primary}22 0%, transparent 70%)`,
          animation: 'haloPulse 3.4s ease-in-out infinite',
        }}/>
        <M size={150} bobbing/>
        <div style={{
          position: 'absolute', top: '32%', right: 36,
          background: '#fff', padding: '10px 14px', borderRadius: 18,
          boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
          fontSize: 13, fontWeight: 600, animation: 'speech 0.4s 0.3s both',
        }}>
          がんばって! 💪
          <div style={{
            position: 'absolute', left: -6, top: 14, width: 12, height: 12,
            background: '#fff', transform: 'rotate(45deg)',
            boxShadow: '-2px 2px 6px rgba(0,0,0,0.04)',
          }}/>
        </div>
      </div>
      <div style={{ ...screenPad, paddingBottom: 32, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <BigButton primary={tweaks.primary} onClick={() => go('quiz')}>시작할게요</BigButton>
        <button onClick={() => { go('mascot'); }} style={{
          background: 'none', border: 'none', fontSize: 14, color: '#6B6B6B',
          padding: 12, cursor: 'pointer',
        }}>나중에 할게요</button>
      </div>
    </div>
  );
}

// ─────────────────────── Quiz ───────────────────────
const QUIZ = [
  { jp: '学校', kana: 'がっこう', romaji: 'gakkou', opts: ['병원', '학교', '회사', '집'], answer: 1, level: 'N5' },
  { jp: '美味しい', kana: 'おいしい', romaji: 'oishii', opts: ['아름답다', '예쁘다', '맛있다', '재미있다'], answer: 2, level: 'N5' },
  { jp: '約束', kana: 'やくそく', romaji: 'yakusoku', opts: ['약속', '계획', '걱정', '연습'], answer: 0, level: 'N4' },
];

function QuizScreen({ go, tweaks, state, setState }) {
  const [q, setQ] = React.useState(state.quizIdx || 0);
  const [picked, setPicked] = React.useState(null);
  const [score, setScore] = React.useState(state.quizScore || 0);
  const cur = QUIZ[q];

  function pick(i) {
    if (picked !== null) return;
    setPicked(i);
    const correct = i === cur.answer;
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      if (q + 1 < QUIZ.length) {
        setQ(q + 1);
        setPicked(null);
      } else {
        setState({ quizScore: score + (correct ? 1 : 0) });
        go('result');
      }
    }, 900 / tweaks.speed);
  }

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: '#fff', paddingTop: 80,
      animation: `screenIn ${0.5/tweaks.speed}s ease-out`,
    }}>
      {/* progress dots */}
      <div style={{ ...screenPad, display: 'flex', gap: 6, marginBottom: 28 }}>
        {QUIZ.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: i <= q ? tweaks.primary : '#EEE',
            transition: 'background .3s',
          }}/>
        ))}
      </div>
      <div style={{ ...screenPad, fontSize: 12, color: '#A3A3A3', fontWeight: 600 }}>
        문제 {q+1} / {QUIZ.length} · {cur.level}
      </div>
      <div style={{
        ...screenPad, marginTop: 28, marginBottom: 18,
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: 13, color: '#A3A3A3', marginBottom: 8, letterSpacing: 1,
          fontFamily: '"Hiragino Sans","Noto Sans JP",sans-serif',
        }}>{cur.kana} · {cur.romaji}</div>
        <div key={q} style={{
          fontSize: 76, fontWeight: 800, letterSpacing: -2,
          fontFamily: '"Hiragino Sans","Noto Sans JP",serif',
          color: '#1A1A1A', animation: `quizWord .4s ease-out`,
        }}>{cur.jp}</div>
      </div>
      <div style={{ ...screenPad, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
        {cur.opts.map((opt, i) => {
          const isAns = picked !== null && i === cur.answer;
          const isWrong = picked === i && i !== cur.answer;
          return (
            <button key={i} onClick={() => pick(i)} style={{
              padding: '18px 12px', borderRadius: 14, cursor: 'pointer',
              border: '1.5px solid ' + (isAns ? '#2EBD6B' : isWrong ? '#FF4D4D' : '#EEE'),
              background: isAns ? '#E8F8EF' : isWrong ? '#FFEDED' : '#fff',
              color: isAns ? '#1A8A4B' : isWrong ? '#C92626' : '#1A1A1A',
              fontSize: 16, fontWeight: 700, transition: 'all .25s',
              transform: isAns ? 'scale(1.03)' : 'scale(1)',
            }}>{opt}</button>
          );
        })}
      </div>
      <div style={{ flex: 1 }}/>
    </div>
  );
}

// ─────────────────────── Level result ───────────────────────
function ResultScreen({ go, tweaks, state }) {
  const score = state.quizScore || 0;
  const level = score >= 3 ? 'N4' : score >= 2 ? 'N5' : 'N5';
  const badge = score >= 3 ? '초급자' : '입문자';
  const M = MASCOTS[tweaks.mascot].Comp;
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: `linear-gradient(180deg, ${tweaks.primary}11 0%, #fff 50%)`,
      paddingTop: 80,
      animation: `screenIn ${0.5/tweaks.speed}s ease-out`,
    }}>
      {/* confetti */}
      {[...Array(14)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute', top: 60, left: `${(i*7+5)%100}%`,
          width: 8, height: 12, borderRadius: 2,
          background: ['#FF3366','#FFB400','#2EBD6B','#7FB8E6','#C5BCD0'][i%5],
          animation: `confetti ${(2.4+i*0.2)/tweaks.speed}s ${i*0.05}s ease-in forwards`,
        }}/>
      ))}
      <div style={{ ...screenPad, textAlign: 'center' }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: tweaks.primary, fontWeight: 700 }}>QUIZ RESULT</div>
        <div style={{ marginTop: 10, fontSize: 28, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1.2 }}>
          {QUIZ.length}문제 중 {score}개 정답!
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div style={{ position: 'relative', animation: 'badgePop 0.7s cubic-bezier(.2,1.5,.3,1)' }}>
          <div style={{
            width: 200, height: 200, borderRadius: '50%',
            background: `conic-gradient(${tweaks.primary} 0%, #FFB400 35%, ${tweaks.primary} 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 20px 50px ${tweaks.primary}44`,
            animation: 'spinSlow 14s linear infinite',
          }}>
            <div style={{
              width: 178, height: 178, borderRadius: '50%', background: '#fff',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              animation: 'spinSlow 14s linear infinite reverse',
            }}>
              <div style={{ fontSize: 13, color: '#A3A3A3', fontWeight: 600, letterSpacing: 2 }}>당신은</div>
              <div style={{ fontSize: 56, fontWeight: 900, color: tweaks.primary, letterSpacing: -2, marginTop: -2 }}>{level}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A' }}>{badge}</div>
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: -28, right: -16 }}>
            <M size={80}/>
          </div>
        </div>
      </div>
      <div style={{ ...screenPad, textAlign: 'center', marginBottom: 18 }}>
        <div style={{ fontSize: 14, color: '#6B6B6B', lineHeight: 1.6 }}>
          하루 15분, <span style={{ fontWeight: 800, color: '#1A1A1A' }}>약 90일</span>이면<br/>
          다음 레벨로 올라갈 수 있어요.
        </div>
      </div>
      <div style={{ ...screenPad, paddingBottom: 32 }}>
        <BigButton primary={tweaks.primary} onClick={() => go('mascot')}>다음</BigButton>
      </div>
    </div>
  );
}

// ─────────────────────── Mascot pick ───────────────────────
function MascotScreen({ go, tweaks, setState }) {
  const [pick, setPick] = React.useState(tweaks.mascot);
  const ids = ['kotaro','yuki','sora'];
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: '#fff', paddingTop: 80,
      animation: `screenIn ${0.5/tweaks.speed}s ease-out`,
    }}>
      <div style={{ ...screenPad }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: tweaks.primary, fontWeight: 700 }}>STEP 4 OF 6</div>
        <div style={{ marginTop: 12, fontSize: 28, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1.2 }}>
          학습 친구를 골라요
        </div>
        <div style={{ marginTop: 8, fontSize: 14, color: '#6B6B6B', lineHeight: 1.5 }}>
          매일 함께 학습할 친구예요. 나중에 바꿀 수 있어요.
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 220, height: 220, position: 'relative' }}>
          {React.createElement(MASCOTS[pick].Comp, { size: 200, bobbing: true })}
        </div>
      </div>
      <div style={{ ...screenPad, textAlign: 'center', marginBottom: 18 }}>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.4 }}>{MASCOTS[pick].name}</div>
        <div style={{ fontSize: 13, color: '#A3A3A3', marginTop: 2 }}>{MASCOTS[pick].jp} · {MASCOTS[pick].desc}</div>
      </div>
      <div style={{ ...screenPad, display: 'flex', gap: 10, marginBottom: 18 }}>
        {ids.map(id => {
          const M = MASCOTS[id].Comp;
          const active = pick === id;
          return (
            <button key={id} onClick={() => setPick(id)} style={{
              flex: 1, padding: 8, borderRadius: 18, cursor: 'pointer',
              border: `2px solid ${active ? tweaks.primary : '#EEE'}`,
              background: active ? `${tweaks.primary}0E` : '#fff',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              transition: 'all .25s', transform: active ? 'scale(1.04)' : 'scale(1)',
            }}>
              <M size={48}/>
              <div style={{ fontSize: 11, fontWeight: 700, color: active ? tweaks.primary : '#6B6B6B' }}>
                {MASCOTS[id].name}
              </div>
            </button>
          );
        })}
      </div>
      <div style={{ ...screenPad, paddingBottom: 32 }}>
        <BigButton primary={tweaks.primary} onClick={() => { setState({ mascotPick: pick }); go('goal'); }}>
          {MASCOTS[pick].name}와 함께할래요
        </BigButton>
      </div>
    </div>
  );
}

// ─────────────────────── Daily goal ───────────────────────
const GOALS = [
  { id: 5, mins: '5분', xp: '50 XP', label: '가볍게', sub: '하루 10단어' },
  { id: 10, mins: '10분', xp: '100 XP', label: '꾸준히', sub: '하루 20단어' },
  { id: 20, mins: '20분', xp: '200 XP', label: '진지하게', sub: '하루 40단어' },
  { id: 30, mins: '30분', xp: '300 XP', label: '몰입하기', sub: '하루 60단어' },
];
function GoalScreen({ go, tweaks, setState }) {
  const [pick, setPick] = React.useState(10);
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: '#fff', paddingTop: 80,
      animation: `screenIn ${0.5/tweaks.speed}s ease-out`,
    }}>
      <div style={{ ...screenPad }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: tweaks.primary, fontWeight: 700 }}>STEP 5 OF 6</div>
        <div style={{ marginTop: 12, fontSize: 28, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1.2 }}>
          하루 학습 목표는?
        </div>
        <div style={{ marginTop: 8, fontSize: 14, color: '#6B6B6B', lineHeight: 1.5 }}>
          꾸준히 할 수 있는 양을 골라요. 늘리는 건 언제든 OK.
        </div>
      </div>
      <div style={{ ...screenPad, marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {GOALS.map((g, i) => {
          const active = pick === g.id;
          return (
            <button key={g.id} onClick={() => setPick(g.id)} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 16px', borderRadius: 16, cursor: 'pointer',
              border: `1.5px solid ${active ? tweaks.primary : '#EEE'}`,
              background: active ? `${tweaks.primary}0E` : '#fff',
              transition: 'all .25s', textAlign: 'left',
              animation: `slideUp ${0.45/tweaks.speed}s ${i*0.05}s both ease-out`,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: active ? tweaks.primary : '#F4F4F4',
                color: active ? '#fff' : '#1A1A1A',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 800, letterSpacing: -0.5,
              }}>{g.mins}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>{g.label}</div>
                <div style={{ fontSize: 13, color: '#6B6B6B', marginTop: 2 }}>{g.sub} · 보상 {g.xp}</div>
              </div>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                border: `2px solid ${active ? tweaks.primary : '#DDD'}`,
                background: active ? tweaks.primary : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{active && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M1 5l3 3 5-6" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>}</div>
            </button>
          );
        })}
      </div>
      <div style={{ flex: 1 }}/>
      <div style={{ ...screenPad, paddingBottom: 32 }}>
        <BigButton primary={tweaks.primary} onClick={() => { setState({ goal: pick }); go('notify'); }}>
          계속하기
        </BigButton>
      </div>
    </div>
  );
}

// ─────────────────────── Notifications ───────────────────────
function NotifyScreen({ go, tweaks }) {
  const [time, setTime] = React.useState('20:00');
  const [days, setDays] = React.useState([1,2,3,4,5]);
  const dayLabels = ['일','월','화','수','목','금','토'];
  const toggle = i => setDays(d => d.includes(i) ? d.filter(x => x !== i) : [...d, i]);
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: '#fff', paddingTop: 80,
      animation: `screenIn ${0.5/tweaks.speed}s ease-out`,
    }}>
      <div style={{ ...screenPad }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: tweaks.primary, fontWeight: 700 }}>STEP 6 OF 6</div>
        <div style={{ marginTop: 12, fontSize: 28, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1.2 }}>
          언제 알림을 보낼까요?
        </div>
        <div style={{ marginTop: 8, fontSize: 14, color: '#6B6B6B', lineHeight: 1.5 }}>
          연속 학습을 지키는 가장 빠른 방법이에요.
        </div>
      </div>
      <div style={{ ...screenPad, marginTop: 32 }}>
        <div style={{ fontSize: 12, color: '#A3A3A3', fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>요일</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {dayLabels.map((d, i) => {
            const active = days.includes(i);
            return (
              <button key={i} onClick={() => toggle(i)} style={{
                flex: 1, height: 44, borderRadius: 12, cursor: 'pointer',
                border: 'none', background: active ? tweaks.primary : '#F4F4F4',
                color: active ? '#fff' : '#6B6B6B',
                fontSize: 14, fontWeight: 700, transition: 'all .2s',
              }}>{d}</button>
            );
          })}
        </div>
      </div>
      <div style={{ ...screenPad, marginTop: 24 }}>
        <div style={{ fontSize: 12, color: '#A3A3A3', fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>시각</div>
        <div style={{
          padding: '18px 20px', borderRadius: 16, background: '#F8F8F8',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5 }}>{time}</div>
            <div style={{ fontSize: 12, color: '#A3A3A3', marginTop: 2 }}>매일 학습 시간</div>
          </div>
          <input type="range" min="6" max="23" step="1"
            value={parseInt(time)}
            onChange={e => setTime(`${String(e.target.value).padStart(2,'0')}:00`)}
            style={{ width: 130, accentColor: tweaks.primary }}/>
        </div>
      </div>
      <div style={{ flex: 1 }}/>
      <div style={{ ...screenPad, paddingBottom: 32, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <BigButton primary={tweaks.primary} onClick={() => go('ready')}>알림 허용하기</BigButton>
        <button onClick={() => go('ready')} style={{
          background: 'none', border: 'none', fontSize: 14, color: '#6B6B6B',
          padding: 12, cursor: 'pointer',
        }}>나중에 설정할게요</button>
      </div>
    </div>
  );
}

// ─────────────────────── Ready ───────────────────────
function ReadyScreen({ go, tweaks, state }) {
  const M = MASCOTS[state.mascotPick || tweaks.mascot].Comp;
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: `linear-gradient(180deg, ${tweaks.primary}11 0%, #fff 50%)`,
      paddingTop: 80,
      animation: `screenIn ${0.5/tweaks.speed}s ease-out`,
    }}>
      {[...Array(20)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute', top: 40, left: `${(i*5.3+3)%100}%`,
          width: 6, height: 10, borderRadius: 2,
          background: ['#FF3366','#FFB400','#2EBD6B','#7FB8E6','#FF8FB1'][i%5],
          animation: `confetti ${(2.4+i*0.15)/tweaks.speed}s ${i*0.04}s ease-in forwards`,
        }}/>
      ))}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <M size={150} bobbing/>
        <div style={{ marginTop: 24, fontSize: 11, letterSpacing: 3, color: tweaks.primary, fontWeight: 700 }}>READY!</div>
        <div style={{ marginTop: 10, fontSize: 30, fontWeight: 800, letterSpacing: -0.8, textAlign: 'center', lineHeight: 1.25 }}>
          준비 완료!<br/>이제 시작해요.
        </div>
        <div style={{ marginTop: 14, fontSize: 14, color: '#6B6B6B', textAlign: 'center', lineHeight: 1.6, maxWidth: 280 }}>
          오늘의 첫 학습을 시작하면<br/>+25 XP를 받을 수 있어요.
        </div>
      </div>
      <div style={{ ...screenPad, paddingBottom: 32 }}>
        <BigButton primary={tweaks.primary} onClick={() => go('home')}>오늘의 학습 시작하기</BigButton>
      </div>
    </div>
  );
}

// ─────────────────────── Home preview (end of flow) ───────────────────────
function HomeScreen({ go, tweaks, state }) {
  const M = MASCOTS[state.mascotPick || tweaks.mascot].Comp;
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: '#FAFAFA', paddingTop: 70,
      animation: `screenIn ${0.5/tweaks.speed}s ease-out`,
    }}>
      <div style={{ ...screenPad, paddingTop: 12 }}>
        <div style={{ fontSize: 11, letterSpacing: 2, color: '#A3A3A3', fontWeight: 600 }}>오늘의 학습</div>
        <div style={{ marginTop: 6, fontSize: 22, fontWeight: 800, letterSpacing: -0.4 }}>안녕하세요,</div>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.4 }}>SeongGuk 님</div>
        <div style={{
          marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 10px', borderRadius: 999,
          background: `${tweaks.primary}1A`, color: tweaks.primary,
          fontSize: 11, fontWeight: 700,
        }}>● Lv.1 · 입문자</div>
      </div>
      <div style={{ ...screenPad, marginTop: 18 }}>
        <div style={{
          padding: '18px 18px', borderRadius: 20, background: '#161616',
          color: '#fff', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>연속 학습</div>
          <div style={{ marginTop: 2, fontSize: 32, fontWeight: 800, letterSpacing: -1 }}>1<span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>일째</span></div>
          <div style={{ display: 'flex', gap: 4, marginTop: 14 }}>
            {[6,7,8,9,10,11,12].map((d, i) => (
              <div key={i} style={{
                flex: 1, height: 30, borderRadius: 10,
                background: i === 6 ? tweaks.primary : 'rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700,
                color: i === 6 ? '#fff' : 'rgba(255,255,255,0.4)',
              }}>{d}</div>
            ))}
          </div>
          <div style={{
            position: 'absolute', top: 14, right: 14,
            width: 36, height: 36, borderRadius: 12,
            background: `${tweaks.primary}33`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16,
          }}>🔥</div>
        </div>
      </div>
      <div style={{ ...screenPad, marginTop: 14 }}>
        <div style={{
          padding: '16px 18px', borderRadius: 18, background: '#fff',
          border: '1px solid #EEE',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <M size={48}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: '#A3A3A3', fontWeight: 700 }}>{state.goal||10}분 · {MASCOTS[state.mascotPick||tweaks.mascot].name}와 함께</div>
            <div style={{ fontSize: 16, fontWeight: 800, marginTop: 2 }}>오늘의 학습 시작</div>
          </div>
          <button onClick={() => go('splash')} style={{
            width: 40, height: 40, borderRadius: 12, border: 'none',
            background: tweaks.primary, color: '#fff', cursor: 'pointer',
            fontSize: 18, fontWeight: 800,
          }}>›</button>
        </div>
      </div>
      <div style={{ flex: 1 }}/>
      <div style={{
        display: 'flex', justifyContent: 'space-around', padding: '10px 0 30px',
        background: '#fff', borderTop: '1px solid #EEE',
      }}>
        {[
          { ic:'🏠', label:'홈', active: true },
          { ic:'📖', label:'사전' },
          { ic:'💬', label:'회화' },
          { ic:'📊', label:'통계' },
          { ic:'⚙️', label:'설정' },
        ].map((t,i) => (
          <div key={i} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            color: t.active ? tweaks.primary : '#A3A3A3',
            fontSize: 10, fontWeight: 700,
          }}>
            <span style={{ fontSize: 18 }}>{t.ic}</span>
            {t.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────── BigButton ───────────────────────
function BigButton({ children, onClick, primary, disabled }) {
  return (
    <button onClick={disabled ? undefined : onClick} disabled={disabled}
      style={{
        width: '100%', padding: '17px 18px', borderRadius: 16,
        background: disabled ? '#EEE' : primary,
        color: disabled ? '#999' : '#fff',
        border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: 16, fontWeight: 800, letterSpacing: -0.3,
        boxShadow: disabled ? 'none' : `0 6px 20px ${primary}55`,
        transition: 'transform .15s, box-shadow .15s',
      }}
      onMouseDown={e => !disabled && (e.currentTarget.style.transform = 'scale(0.97)')}
      onMouseUp={e => !disabled && (e.currentTarget.style.transform = 'scale(1)')}
      onMouseLeave={e => !disabled && (e.currentTarget.style.transform = 'scale(1)')}
    >{children}</button>
  );
}

Object.assign(window, {
  SplashScreen, WelcomeScreen, AuthScreen, EmailScreen,
  QuizIntroScreen, QuizScreen, ResultScreen, MascotScreen,
  GoalScreen, NotifyScreen, ReadyScreen, HomeScreen, BigButton,
});
