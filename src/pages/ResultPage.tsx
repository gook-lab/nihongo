// 학습 결과 화면 — share/screens.jsx ResultScreen 패턴 적용:
// confetti 배경 + conic-gradient 회전 N5 배지 + 모서리 마스코트 + 격려 문구
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Home, RotateCcw, Zap, Share2, AlertCircle, PenLine, MessageCircle, ChevronRight } from 'lucide-react'
import { toast } from '@/lib/toast'
import { Button } from '@/components/ui/button'
import { MascotScene } from '@/components/MascotScene'
import type { MascotReaction } from '@/components/MascotAvatar'
import { QUESTIONS_PER_SESSION } from '@/constants'
import { useAppStore } from '@/store'
import { trackEvent } from '@/lib/analytics'
import { FirstSessionModal } from '@/components/FirstSessionModal'
import { useEffect, useState } from 'react'

// 점수에 따라 마스코트 reaction + 말풍선 분기
function scoreToReaction(score: number): MascotReaction {
  if (score === 100) return 'dance'     // 만점 — 신나는 춤
  if (score >= 90) return 'celebrate'   // 완벽
  if (score >= 70) return 'happy'       // 잘함
  if (score >= 40) return 'cheer'       // 격려 (할 수 있어요)
  return 'encourage'                    // 다음 기회에
}

function scoreToBubble(score: number): string {
  if (score === 100) return '만점이에요! 🎊'
  if (score >= 90) return '완벽해요! 🎉'
  if (score >= 70) return '잘했어요!'
  if (score >= 40) return '거의 다 왔어요!'
  return '괜찮아요, 다시!'
}

interface ResultState {
  score: number
  xpEarned: number
}

const CONFETTI_COLORS = ['#FF3366', '#FFB400', '#2EBD6B', '#7FB8E6', '#C5BCD0']

// 점수 → JLPT 레벨 매핑 (간이 진단)
function scoreToLevel(score: number): { level: string; badge: string } {
  if (score >= 90) return { level: 'N4', badge: '학습자' }
  if (score >= 70) return { level: 'N5', badge: '초보자' }
  if (score >= 50) return { level: 'N5', badge: '입문자' }
  return { level: 'N5', badge: '시작' }
}

export function ResultPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const result = location.state as ResultState | undefined
  const nickname = useAppStore((s) => s.user?.nickname)
  const streak = useAppStore((s) => s.streak)
  const wrongCount = useAppStore((s) => s.wrongWordIds.length)
  const hasCompletedFirstSession = useAppStore((s) => s.hasCompletedFirstSession)
  const markFirstSessionComplete = useAppStore((s) => s.markFirstSessionComplete)
  const [firstModalOpen, setFirstModalOpen] = useState(false)

  // 첫 세션 완주면 특별 모달 1회 노출
  useEffect(() => {
    if (result && !hasCompletedFirstSession) {
      const t = setTimeout(() => setFirstModalOpen(true), 800)
      return () => clearTimeout(t)
    }
  }, [result, hasCompletedFirstSession])

  const handleFirstClose = () => {
    setFirstModalOpen(false)
    markFirstSessionComplete()
  }

  if (!result) {
    // 렌더 중에 navigate() 를 부르면 안 된다 — 부수효과라 버려지는 렌더에서도
    // 실행된다. <Navigate> 는 커밋된 뒤에 이동한다.
    return <Navigate to="/" replace />
  }

  const { score, xpEarned } = result
  const correctCount = Math.round((score / 100) * QUESTIONS_PER_SESSION)
  const { level, badge } = scoreToLevel(score)
  const showConfetti = score >= 50

  return (
    <>
    <FirstSessionModal
      open={firstModalOpen}
      onClose={handleFirstClose}
      score={score}
      xpEarned={xpEarned}
    />
    <div
      className="min-h-screen relative overflow-hidden flex flex-col anim-screen-in"
      style={{
        background:
          'linear-gradient(180deg, color-mix(in srgb, var(--color-primary) 8%, transparent) 0%, var(--color-background) 50%)',
      }}
    >
      {/* Confetti 배경 (50점 이상) */}
      {showConfetti &&
        [...Array(14)].map((_, i) => (
          <div
            key={i}
            className="absolute anim-confetti pointer-events-none"
            style={{
              top: 60,
              left: `${(i * 7 + 5) % 100}%`,
              width: 8,
              height: 12,
              borderRadius: 2,
              background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
              animationDelay: `${i * 0.12}s`,
              // 모든 confetti가 동일 duration — wave 효과는 delay로만 표현 (MascotSprites.Confetti와 일관)
              animationDuration: '2.4s',
            }}
          />
        ))}

      {/* 상단 헤더 */}
      <div className="pt-20 px-6 text-center anim-fade-up">
        <p className="type-eyebrow">QUIZ RESULT</p>
        <h1
          className="mt-2.5 type-h1"
          style={{ color: 'var(--color-foreground)' }}
        >
          {QUESTIONS_PER_SESSION}문제 중 {correctCount}개 정답!
        </h1>
      </div>

      {/* N5 회전 배지 + 모서리 마스코트 */}
      <div className="flex-1 flex items-center justify-center relative">
        <div className="relative anim-badge-pop">
          {/* 외곽 conic-gradient 회전 링 */}
          <div
            className="w-[200px] h-[200px] rounded-full flex items-center justify-center anim-spin-slow"
            style={{
              background:
                'conic-gradient(var(--color-primary) 0%, #FFB400 35%, var(--color-primary) 100%)',
              boxShadow:
                '0 20px 50px color-mix(in srgb, var(--color-primary) 28%, transparent)',
            }}
          >
            {/* 내부 흰 원 (반대방향 회전으로 텍스트 정상 표시) */}
            <div
              className="w-[178px] h-[178px] rounded-full flex flex-col items-center justify-center anim-spin-slow"
              style={{
                background: 'var(--color-card)',
                animationDirection: 'reverse',
              }}
            >
              <span
                className="text-[13px] font-semibold tracking-[0.18em]"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                당신은
              </span>
              <span
                className="text-[56px] font-black leading-none mt-0.5 tracking-tight"
                style={{ color: 'var(--color-primary)', letterSpacing: '-0.04em' }}
              >
                {level}
              </span>
              <span
                className="text-[15px] font-bold mt-1"
                style={{ color: 'var(--color-foreground)' }}
              >
                {badge}
              </span>
            </div>
          </div>

          {/* 마스코트 corner — 점수 기반 reaction + 말풍선 */}
          <div className="absolute -bottom-6 -right-10 w-[140px]">
            <MascotScene
              reaction={scoreToReaction(score)}
              sizeToken="xs"
              bubble={scoreToBubble(score)}
              bubblePosition="top-left"
            />
          </div>
        </div>
      </div>

      {/* XP 라인 */}
      <div className="px-6 mt-2 anim-fade-up" style={{ animationDelay: '0.3s' }}>
        <div
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full mx-auto w-fit"
          style={{
            background: 'var(--color-sakura-100)',
            color: 'var(--color-primary)',
          }}
        >
          <Zap className="w-4 h-4 fill-current" />
          <span className="text-sm font-bold">+{xpEarned} XP 획득</span>
        </div>
      </div>

      {/* 격려 문구 */}
      <div
        className="px-6 mt-4 text-center anim-fade-up"
        style={{ animationDelay: '0.4s' }}
      >
        <p
          className="text-sm leading-relaxed"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          하루 15분씩, <b style={{ color: 'var(--color-foreground)' }}>약 90일</b>이면
          <br />
          다음 레벨로 올라갈 수 있어요.
        </p>
      </div>

      {/* 다음 추천 액션 — 학습 흐름 자연스럽게 연결 */}
      <div
        className="px-6 pt-3 anim-fade-up"
        style={{ animationDelay: '0.45s' }}
      >
        <p
          className="type-eyebrow mb-2.5 px-1"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          다음으로 이어가요
        </p>
        <div className="space-y-1.5">
          {wrongCount > 0 && (
            <NextStepCard
              icon={<AlertCircle className="w-4 h-4" />}
              title="약점 단어 복습"
              desc={`오답 ${wrongCount}개 — 짧게 다시 한 번`}
              onClick={() => navigate('/wrong-words')}
            />
          )}
          <NextStepCard
            icon={<MessageCircle className="w-4 h-4" />}
            title="회화 한 표현"
            desc="짧은 일본어 회화 익히기"
            onClick={() => navigate('/conversation')}
          />
          <NextStepCard
            icon={<PenLine className="w-4 h-4" />}
            title="한자 손글씨 연습"
            desc="배운 한자를 직접 써 보기"
            onClick={() => navigate('/kanji/practice')}
          />
        </div>
      </div>

      {/* 액션 버튼 */}
      <div
        className="px-6 pt-4 pb-8 space-y-2.5 anim-fade-up"
        style={{ animationDelay: '0.5s' }}
      >
        <Button onClick={() => navigate('/learn')} className="w-full h-12">
          <RotateCcw className="w-4 h-4 mr-2" />
          다시 학습하기
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={async () => {
              // 동적 이미지 + 풍부한 텍스트 메시지 (Web Share Level 2)
              const who = nickname ? `${nickname}님` : '저'
              const streakLine = streak > 1 ? `🔥 ${streak}일 연속 학습 중!\n` : ''
              const scoreEmoji = score >= 90 ? '🎉' : score >= 70 ? '✨' : score >= 50 ? '💪' : '🌱'
              const text =
                `${scoreEmoji} ${who}이 니혼고 앱에서 오늘 ${correctCount}/${QUESTIONS_PER_SESSION}개 맞췄어요 (${score}점)!\n` +
                `+${xpEarned} XP 획득 · Lv.${badge}\n` +
                streakLine +
                `\n나도 일본어 시작하기 👉`
              const url = 'https://nihan-go-test.netlify.app/'
              trackEvent('share-result', { score, xpEarned })

              try {
                // 1) 동적 이미지 생성
                const { generateShareImage, shareImageOrDownload } = await import('@/lib/shareImage')
                const blob = await generateShareImage({
                  nickname,
                  score,
                  correctCount,
                  totalCount: QUESTIONS_PER_SESSION,
                  xpEarned,
                  streak,
                  level,
                  badge,
                })
                if (blob) {
                  const result = await shareImageOrDownload(
                    blob,
                    `nihongo-result-${Date.now()}.png`,
                    text,
                    url,
                  )
                  if (result === 'downloaded') {
                    toast.success({ message: '결과 이미지가 다운로드됐어요' })
                  }
                  return
                }
              } catch (e) {
                console.warn('이미지 생성 실패, 텍스트만 공유:', e)
              }

              // 2) 폴백 — 기존 텍스트 공유
              if (typeof navigator !== 'undefined' && navigator.share) {
                navigator.share({ title: '니혼고 학습 결과', text, url }).catch(() => {})
              } else if (navigator.clipboard) {
                navigator.clipboard
                  .writeText(`${text}\n${url}`)
                  .then(() => toast.success({ message: '결과가 복사됐어요!' }))
                  .catch(() => toast.error({ message: '복사에 실패했어요' }))
              } else {
                toast.info({ message: '이 브라우저는 공유를 지원하지 않아요' })
              }
            }}
            className="h-12"
          >
            <Share2 className="w-4 h-4 mr-2" />
            공유
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="h-12"
          >
            <Home className="w-4 h-4 mr-2" />
            홈으로
          </Button>
        </div>
      </div>
    </div>
    </>
  )
}

function NextStepCard({
  icon,
  title,
  desc,
  onClick,
}: {
  icon: React.ReactNode
  title: string
  desc: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors"
      style={{ background: 'var(--color-card)', border: '1.5px solid var(--color-border-light)' }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: 'var(--color-sakura-100)', color: 'var(--color-primary)' }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold">{title}</p>
        <p className="text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>
          {desc}
        </p>
      </div>
      <ChevronRight className="w-4 h-4 shrink-0" style={{ color: 'var(--color-text-tertiary)' }} />
    </button>
  )
}
