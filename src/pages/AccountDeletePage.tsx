// 계정 탈퇴 — 재인증 → Firestore 데이터 전체 삭제 → Auth user 삭제 → 로그아웃
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { m } from 'framer-motion'
import {
  ChevronLeft,
  AlertTriangle,
  Trash2,
  Loader2,
  ShieldCheck,
  Lock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { BottomNav } from '@/components/BottomNav'
import { useAppStore } from '@/store'
import {
  isFirebaseConfigured,
  reauthenticateCurrent,
  reauthenticateWithPassword,
  getCurrentProvider,
  deleteCurrentAuthUser,
  getCurrentUid,
  firebaseSignOut,
} from '@/lib/firebase'
import { deleteAllUserData } from '@/lib/firestore'
import { reportAuthError } from '@/lib/sentry'

type Phase = 'confirm' | 'reauth' | 'deleting' | 'done' | 'error'

const REQUIRED_PHRASE = '탈퇴'

export function AccountDeletePage() {
  const navigate = useNavigate()
  const logout = useAppStore((s) => s.logout)
  const user = useAppStore((s) => s.user)

  const [phase, setPhase] = useState<Phase>('confirm')
  const [confirmText, setConfirmText] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  // 이메일 사용자는 비밀번호 입력 필수, 그 외(Google 등)는 비밀번호 불필요
  const provider = getCurrentProvider()
  const needsPassword = provider === 'email'
  const canProceed =
    confirmText.trim() === REQUIRED_PHRASE && (!needsPassword || password.length >= 6)

  const handleDelete = async () => {
    if (!canProceed) return
    setError(null)

    // 데모 모드: Firebase 미설정 → store만 초기화 후 로그인 페이지로
    if (!isFirebaseConfigured()) {
      setPhase('deleting')
      localStorage.removeItem('nihongo-app-storage')
      logout()
      setPhase('done')
      setTimeout(() => navigate('/login'), 1200)
      return
    }

    const uid = getCurrentUid()
    if (!uid) {
      setError('로그인 정보를 찾을 수 없습니다. 다시 로그인해주세요.')
      setPhase('error')
      return
    }

    try {
      // 1단계: 재인증 (Firebase는 최근 로그인 후 일정 시간 지나면 deleteUser() 거부)
      setPhase('reauth')
      if (needsPassword) {
        await reauthenticateWithPassword(password)
      } else {
        await reauthenticateCurrent()
      }

      // 2단계: Firestore 전체 삭제
      setPhase('deleting')
      await deleteAllUserData(uid)

      // 3단계: Auth user 삭제
      await deleteCurrentAuthUser()

      // 4단계: 로컬 상태 초기화
      try {
        await firebaseSignOut()
      } catch {
        // ignore
      }
      localStorage.removeItem('nihongo-app-storage')
      logout()

      setPhase('done')
      setTimeout(() => navigate('/login'), 1500)
    } catch (e) {
      let isUserCancellation = false
      if (e instanceof Error) {
        const code = (e as { code?: string }).code ?? ''
        // 사용자가 재인증 popup 닫음 — 정상 흐름이므로 Sentry 보고 생략
        if (e.message.includes('cancelled') || e.message.includes('popup-closed')) {
          isUserCancellation = true
          setError('재인증이 취소되었습니다. 다시 시도해주세요.')
        }
        // 비밀번호 불일치 (이메일 사용자) — 사용자 실수, Sentry 보고 생략
        else if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
          isUserCancellation = true
          setError('비밀번호가 일치하지 않습니다.')
        }
        // 너무 많은 시도
        else if (code === 'auth/too-many-requests') {
          setError('시도가 너무 많아요. 잠시 후 다시 시도해주세요.')
        } else {
          setError(`탈퇴 처리 실패: ${e.message}`)
        }
      } else {
        setError('알 수 없는 오류가 났어요.')
      }
      if (!isUserCancellation) {
        reportAuthError(e, {
          operation: 'delete',
          provider: needsPassword ? 'email' : undefined,
        })
      }
      setPhase('error')
    }
  }

  return (
    <div className="min-h-screen bg-background pb-nav">
      <div className="pt-6 pb-4 px-5 sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border-light">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/profile')}
            disabled={phase === 'reauth' || phase === 'deleting'}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(193, 53, 21, 0.10)' }}
            >
              <AlertTriangle className="w-4 h-4" style={{ color: 'var(--color-destructive)' }} />
            </div>
            <span className="type-h3">계정 탈퇴</span>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <m.div
        className="px-5 mt-4 space-y-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Done 화면 */}
        {phase === 'done' && (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <p className="font-semibold">탈퇴가 완료되었습니다</p>
              <p
                className="text-sm mt-1"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                그동안 이용해주셔서 감사합니다
              </p>
              <p
                className="text-[11px] mt-3"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                잠시 후 로그인 화면으로 이동합니다…
              </p>
            </CardContent>
          </Card>
        )}

        {/* 진행 중 화면 */}
        {(phase === 'reauth' || phase === 'deleting') && (
          <Card>
            <CardContent className="p-6 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-primary" />
              <p className="font-semibold">
                {phase === 'reauth' ? '본인 확인 중…' : '데이터 삭제 중…'}
              </p>
              <p
                className="text-[11px] mt-2"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                {phase === 'reauth'
                  ? '재로그인 팝업이 열립니다'
                  : '잠시만 기다려주세요'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* 확인 / 에러 화면 */}
        {(phase === 'confirm' || phase === 'error') && (
          <>
            {/* 안내 */}
            <Card
              style={{
                background: 'rgba(193, 53, 21, 0.05)',
                border: '1px solid rgba(193, 53, 21, 0.20)',
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle
                    className="w-5 h-5 shrink-0 mt-0.5"
                    style={{ color: 'var(--color-destructive)' }}
                  />
                  <div>
                    <p
                      className="font-semibold"
                      style={{ color: 'var(--color-destructive)' }}
                    >
                      탈퇴 시 다음이 영구 삭제됩니다
                    </p>
                    <ul
                      className="text-sm mt-2 space-y-0.5 list-disc list-inside"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      <li>학습 진행도 (XP, 레벨, 스트릭, 일별 기록)</li>
                      <li>단어 SRS 상태 (망각 곡선 데이터)</li>
                      <li>회화 메모, 즐겨찾기 한자</li>
                      <li>AI로 만든 짧은 이야기 라이브러리</li>
                      <li>프로필/설정 (마스코트, 테마)</li>
                    </ul>
                    <p
                      className="text-[11px] mt-2"
                      style={{ color: 'var(--color-text-tertiary)' }}
                    >
                      탈퇴 후에는 복구할 수 없으니, 필요하시면 먼저 마이페이지에서
                      데이터를 CSV로 내보내주세요. 도움이 필요하면{' '}
                      <a
                        href="mailto:ym05200@naver.com?subject=%5B%EB%8B%88%ED%98%BC%EA%B3%A0%20%EC%95%B1%5D%20%ED%83%88%ED%87%B4%20%EB%AC%B8%EC%9D%98"
                        className="underline"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        ym05200@naver.com
                      </a>
                      으로 문의해 주세요.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 확인 입력 */}
            <div>
              <p
                className="type-section mb-2 px-1"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                확인
              </p>
              <Card>
                <CardContent className="p-4 space-y-3">
                  <p className="text-sm">
                    탈퇴를 진행하려면 아래 입력란에 <b>"{REQUIRED_PHRASE}"</b>을(를)
                    입력해주세요.
                  </p>
                  <Input
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder={REQUIRED_PHRASE}
                    className="h-11"
                  />

                  {/* 이메일 사용자는 비밀번호 재인증 필요 */}
                  {needsPassword && (
                    <div className="space-y-1.5">
                      <p
                        className="text-xs font-medium flex items-center gap-1"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        <Lock className="w-3 h-3" />
                        본인 확인을 위해 비밀번호를 입력해 주세요
                      </p>
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="비밀번호"
                        autoComplete="current-password"
                        className="h-11"
                      />
                    </div>
                  )}

                  {user?.email && (
                    <p
                      className="text-[11px]"
                      style={{ color: 'var(--color-text-tertiary)' }}
                    >
                      탈퇴할 계정: {user.email}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* 에러 */}
            {error && (
              <div
                className="rounded-xl p-3 flex items-start gap-2 text-sm"
                style={{
                  background: 'rgba(193, 53, 21, 0.08)',
                  border: '1px solid rgba(193, 53, 21, 0.20)',
                  color: 'var(--color-destructive)',
                }}
              >
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="break-all">{error}</span>
              </div>
            )}

            {/* 액션 */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => navigate('/profile')}
                className="h-12"
              >
                취소
              </Button>
              <Button
                onClick={handleDelete}
                disabled={!canProceed}
                className="h-12"
                style={{
                  background: canProceed
                    ? 'var(--color-destructive)'
                    : undefined,
                  color: canProceed ? '#FFFFFF' : undefined,
                }}
              >
                <Trash2 className="w-4 h-4 mr-1.5" />
                탈퇴하기
              </Button>
            </div>
          </>
        )}
      </m.div>

      {phase === 'confirm' && <BottomNav />}
    </div>
  )
}
