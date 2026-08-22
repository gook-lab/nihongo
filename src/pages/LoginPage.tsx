import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { m, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User as UserIcon, AlertCircle } from 'lucide-react'
import { Spinner } from '@/components/Spinner'
import { MascotAvatar } from '@/components/MascotAvatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  isFirebaseConfigured,
} from '@/lib/firebase'
import { useAppStore } from '@/store'
import { cn } from '@/lib/utils'
import { reportAuthError } from '@/lib/sentry'

type Mode = 'signin' | 'signup'

// Firebase Auth 에러 코드를 사용자 친화적 메시지로
function authErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) return '로그인에 실패했어요. 다시 시도해 주세요.'
  const code = (error as { code?: string }).code ?? ''
  // error.message에서 코드 추출 시도 (code 필드가 없는 경우 대비)
  const codeFromMessage = error.message.match(/\(auth\/([\w-]+)\)/)?.[1]
  const finalCode = code || (codeFromMessage ? `auth/${codeFromMessage}` : '')

  const map: Record<string, string> = {
    'auth/invalid-email': '올바른 이메일 형식이 아닙니다.',
    'auth/user-disabled': '비활성화된 계정입니다.',
    'auth/user-not-found': '가입되지 않은 이메일입니다.',
    'auth/wrong-password': '비밀번호가 일치하지 않습니다.',
    'auth/invalid-credential': '이메일 또는 비밀번호가 올바르지 않습니다.',
    'auth/email-already-in-use': '이미 가입된 이메일입니다. 로그인해 주세요.',
    'auth/weak-password': '비밀번호는 6자 이상이어야 합니다.',
    'auth/too-many-requests': '시도가 너무 많습니다. 잠시 후 다시 시도해주세요.',
    'auth/network-request-failed': '네트워크 연결을 확인해 주세요.',
    'auth/popup-closed-by-user': '로그인이 취소되었습니다.',
    'auth/operation-not-allowed':
      '이 로그인 방식이 비활성 상태입니다. (Firebase Console에서 활성화 필요)',
    'auth/account-exists-with-different-credential':
      '다른 방식으로 가입된 이메일입니다. 다른 로그인 방법을 시도해 주세요.',
  }
  return map[finalCode] || error.message || '로그인에 실패했어요. 다시 시도해 주세요.'
}

export function LoginPage() {
  const navigate = useNavigate()
  const login = useAppStore((s) => s.login)
  const startGuestMode = useAppStore((s) => s.startGuestMode)

  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState<'google' | 'email' | null>(null)
  const [error, setError] = useState<string | null>(null)

  // 로그인 성공 → 자동으로 GuestGuard가 /splash로 우회 처리 (returnTo 쿼리 보존)

  const handleGoogle = async () => {
    if (!isFirebaseConfigured()) {
      setError('Firebase가 설정되지 않았습니다. 데모 모드를 사용하세요.')
      return
    }
    setLoading('google')
    setError(null)
    try {
      const user = await signInWithGoogle()
      login(user)
    } catch (e) {
      reportAuthError(e, { operation: 'signin', provider: 'google' })
      setError(authErrorMessage(e))
    } finally {
      setLoading(null)
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFirebaseConfigured()) {
      setError('Firebase가 설정되지 않았습니다.')
      return
    }
    if (!email.trim() || !password.trim()) {
      setError('이메일과 비밀번호를 입력해 주세요.')
      return
    }
    if (mode === 'signup' && password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.')
      return
    }
    setLoading('email')
    setError(null)
    try {
      const user =
        mode === 'signup'
          ? await signUpWithEmail(email.trim(), password, nickname.trim() || '학습자')
          : await signInWithEmail(email.trim(), password)
      login(user)
    } catch (err) {
      reportAuthError(err, {
        operation: mode === 'signup' ? 'signup' : 'signin',
        provider: 'email',
      })
      setError(authErrorMessage(err))
    } finally {
      setLoading(null)
    }
  }

  const switchMode = (next: Mode) => {
    setMode(next)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background p-4">
      <div className="min-h-screen flex flex-col items-center justify-center">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ width: '100%', maxWidth: '380px' }}
        >
          <Card>
            <CardHeader className="text-center">
              <m.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring' }}
                className="flex justify-center mb-2"
              >
                <MascotAvatar size="md" reaction="wave" />
              </m.div>
              <CardTitle className="type-h2">니혼고 앱</CardTitle>
              <p className="type-body text-muted-foreground">
                매일 조금씩 일본어를 배워요
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* 모드 토글 */}
              <div
                className="flex rounded-lg p-1"
                style={{ background: 'var(--color-muted)' }}
              >
                <button
                  onClick={() => switchMode('signin')}
                  className={cn(
                    'flex-1 py-2 text-sm font-semibold rounded-md transition-all',
                    mode === 'signin'
                      ? 'bg-card shadow-sm'
                      : 'text-muted-foreground',
                  )}
                  style={mode === 'signin' ? { color: 'var(--color-primary)' } : undefined}
                >
                  로그인
                </button>
                <button
                  onClick={() => switchMode('signup')}
                  className={cn(
                    'flex-1 py-2 text-sm font-semibold rounded-md transition-all',
                    mode === 'signup'
                      ? 'bg-card shadow-sm'
                      : 'text-muted-foreground',
                  )}
                  style={mode === 'signup' ? { color: 'var(--color-primary)' } : undefined}
                >
                  회원가입
                </button>
              </div>

              {/* 이메일 폼 */}
              <form onSubmit={handleEmailSubmit} className="space-y-2.5">
                <AnimatePresence mode="wait">
                  {mode === 'signup' && (
                    <m.div
                      key="nickname"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="relative">
                        <UserIcon
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                          style={{ color: 'var(--color-text-tertiary)' }}
                        />
                        <Input
                          value={nickname}
                          onChange={(e) => setNickname(e.target.value)}
                          placeholder="닉네임"
                          maxLength={20}
                          autoComplete="nickname"
                          className="pl-9 h-11"
                          disabled={loading !== null}
                        />
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>

                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="이메일"
                    autoComplete="email"
                    className="pl-9 h-11"
                    disabled={loading !== null}
                  />
                </div>

                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={
                      mode === 'signup' ? '비밀번호 (6자 이상)' : '비밀번호'
                    }
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    className="pl-9 h-11"
                    disabled={loading !== null}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 font-semibold"
                  disabled={loading !== null}
                >
                  {loading === 'email' ? (
                    <Spinner variant="ring" size={16} color="currentColor" />
                  ) : mode === 'signup' ? (
                    '회원가입 후 시작'
                  ) : (
                    '이메일로 로그인'
                  )}
                </Button>
              </form>

              {/* 구분선 */}
              <div className="relative">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div
                    className="w-full border-t"
                    style={{ borderColor: 'var(--color-border-light)' }}
                  />
                </div>
                <div className="relative flex justify-center">
                  <span
                    className="px-2 text-[11px]"
                    style={{
                      background: 'var(--color-card)',
                      color: 'var(--color-text-tertiary)',
                    }}
                  >
                    또는
                  </span>
                </div>
              </div>

              {/* Google */}
              <Button
                variant="outline"
                className="w-full h-11 font-medium"
                onClick={handleGoogle}
                disabled={loading !== null}
              >
                {loading === 'google' ? (
                  <Spinner variant="ring" size={16} color="currentColor" />
                ) : (
                  <>
                    <GoogleLogo className="w-4 h-4 mr-2" />
                    Google로 {mode === 'signup' ? '시작' : '로그인'}
                  </>
                )}
              </Button>

              {/* 에러 */}
              {error && (
                <m.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2 text-sm p-2 rounded-lg"
                  style={{
                    background: 'rgba(193, 53, 21, 0.08)',
                    color: 'var(--color-destructive)',
                  }}
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="text-xs break-all">{error}</span>
                </m.div>
              )}

              {/* 게스트 모드 — 로그인 없이 둘러보기 (홈/사전/회화/카나) */}
              <div
                className="pt-3 border-t"
                style={{ borderColor: 'var(--color-border-light)' }}
              >
                <Button
                  variant="ghost"
                  className="w-full text-xs h-9"
                  onClick={() => {
                    startGuestMode()
                    navigate('/')
                  }}
                >
                  로그인 없이 둘러보기
                </Button>
              </div>

              {/* 개발용 데모 모드 (자동 로그인) */}
              {import.meta.env.DEV && (
                <div
                  className="pt-2"
                >
                  <Button
                    variant="ghost"
                    className="w-full text-xs h-9"
                    onClick={() => {
                      login({
                        id: 'demo-user',
                        provider: 'google',
                        nickname: '데모 사용자',
                        email: 'demo@test.com',
                      })
                    }}
                  >
                    🧪 데모 자동 로그인 (DEV)
                  </Button>
                </div>
              )}

              {/* 약관/개인정보 링크 */}
              <p className="text-center text-[11px] text-muted-foreground pt-1">
                {mode === 'signup' ? '가입' : '로그인'} 시{' '}
                <button
                  onClick={() => navigate('/terms')}
                  className="underline hover:text-foreground"
                >
                  이용약관
                </button>
                {' · '}
                <button
                  onClick={() => navigate('/privacy')}
                  className="underline hover:text-foreground"
                >
                  개인정보 처리방침
                </button>
                에 동의합니다
              </p>
            </CardContent>
          </Card>
        </m.div>
      </div>
    </div>
  )
}

// 구글 로고 SVG (단순)
function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}
