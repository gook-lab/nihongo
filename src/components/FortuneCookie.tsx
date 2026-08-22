import { useState, useEffect } from 'react'
import { m } from 'framer-motion'
import { Sparkles, RefreshCw, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { TTSButton } from '@/components/TTSButton'

// Fortune data types
interface Fortune {
  id: number
  japanese: string
  koreanPronunciation: string
  romaji: string
  koreanTranslation: string
}

// Fortune data
const FORTUNES: Fortune[] = [
  {
    id: 1,
    japanese: '七転び八起き',
    koreanPronunciation: '나나코로비 야오키',
    romaji: 'Nanakorobi yaoki',
    koreanTranslation: '일곱 번 넘어져도 여덟 번 일어나라 (실패해도 포기하지 말라)',
  },
  {
    id: 2,
    japanese: '継続は力なり',
    koreanPronunciation: '케이조쿠와 치카라 나리',
    romaji: 'Keizoku wa chikara nari',
    koreanTranslation: '계속하면 힘이 된다 (꾸준함이 중요하다)',
  },
  {
    id: 3,
    japanese: '一期一会',
    koreanPronunciation: '이치고 이치에',
    romaji: 'Ichigo ichie',
    koreanTranslation: '일생에 한 번의 만남 (모든 만남을 소중히)',
  },
  {
    id: 4,
    japanese: '明日は明日の風が吹く',
    koreanPronunciation: '아시타와 아시타노 카제가 후쿠',
    romaji: 'Ashita wa ashita no kaze ga fuku',
    koreanTranslation: '내일은 내일의 바람이 분다 (내일 일은 내일 생각하자)',
  },
  {
    id: 5,
    japanese: '猿も木から落ちる',
    koreanPronunciation: '사루모 키카라 오치루',
    romaji: 'Saru mo ki kara ochiru',
    koreanTranslation: '원숭이도 나무에서 떨어진다 (전문가도 실수한다)',
  },
  {
    id: 6,
    japanese: '千里の道も一歩から',
    koreanPronunciation: '센리노 미치모 잇포카라',
    romaji: 'Senri no michi mo ippo kara',
    koreanTranslation: '천 리 길도 한 걸음부터 (큰 일도 작은 것부터)',
  },
  {
    id: 7,
    japanese: '花より団子',
    koreanPronunciation: '하나요리 당고',
    romaji: 'Hana yori dango',
    koreanTranslation: '꽃보다 경단 (실속이 중요하다)',
  },
  {
    id: 8,
    japanese: '雨降って地固まる',
    koreanPronunciation: '아메 훗테 지카타마루',
    romaji: 'Ame futte ji katamaru',
    koreanTranslation: '비가 와야 땅이 굳어진다 (시련 후 더 단단해진다)',
  },
  {
    id: 9,
    japanese: '笑う門には福来る',
    koreanPronunciation: '와라우 카도니와 후쿠 키타루',
    romaji: 'Warau kado niwa fuku kitaru',
    koreanTranslation: '웃는 집에는 복이 온다',
  },
  {
    id: 10,
    japanese: '急がば回れ',
    koreanPronunciation: '이소가바 마와레',
    romaji: 'Isogaba maware',
    koreanTranslation: '급하면 돌아가라 (서두르지 말고 안전하게)',
  },
  {
    id: 11,
    japanese: '明けない夜はない',
    koreanPronunciation: '아케나이 요루와 나이',
    romaji: 'Akenai yoru wa nai',
    koreanTranslation: '밝지 않는 밤은 없다 (힘든 시기도 지나간다)',
  },
  {
    id: 12,
    japanese: '心機一転',
    koreanPronunciation: '신키 잇텐',
    romaji: 'Shinki itten',
    koreanTranslation: '마음을 새롭게 (새로운 시작)',
  },
  {
    id: 13,
    japanese: '十人十色',
    koreanPronunciation: '쥬닌 토이로',
    romaji: 'Jūnin toiro',
    koreanTranslation: '열 사람 열 가지 색 (사람마다 다르다)',
  },
  {
    id: 14,
    japanese: '虎穴に入らずんば虎子を得ず',
    koreanPronunciation: '코케츠니 이라즌바 코지오 에즈',
    romaji: 'Koketsu ni irazunba koji wo ezu',
    koreanTranslation: '호랑이 굴에 들어가야 호랑이 새끼를 얻는다 (위험을 감수해야 성공한다)',
  },
  {
    id: 15,
    japanese: '案ずるより産むが易し',
    koreanPronunciation: '안즈루요리 우무가 야스시',
    romaji: 'Anzuru yori umu ga yasushi',
    koreanTranslation: '걱정하는 것보다 실행이 쉽다',
  },
]

// Fortune Cookie Component
interface FortuneCookieProps {
  isOpen: boolean
  onClick: () => void
}

function FortuneCookieView({ isOpen, onClick }: FortuneCookieProps) {
  const [hasClicked, setHasClicked] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setHasClicked(false)
    }
  }, [isOpen])

  const handleClick = () => {
    if (!hasClicked) {
      setHasClicked(true)
      onClick()
    }
  }

  return (
    <div className="flex flex-col items-center gap-4" style={{ width: '100%' }}>
      {/* Cookie Container */}
      <div className="relative">
        {/* Sparkle effects around cookie */}
        {!isOpen && (
          <>
            <m.div
              className="absolute -left-8 top-6"
              style={{ color: 'var(--color-primary)' }}
              animate={{
                opacity: [0.4, 1, 0.4],
                scale: [0.8, 1.2, 0.8],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Sparkles size={16} fill="currentColor" />
            </m.div>
            <m.div
              className="absolute -right-8 top-8"
              style={{ color: 'var(--color-primary)' }}
              animate={{
                opacity: [0.4, 1, 0.4],
                scale: [0.8, 1.2, 0.8],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 3,
                delay: 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Sparkles size={14} fill="currentColor" />
            </m.div>
            <m.div
              className="absolute left-2 -top-2"
              style={{ color: 'color-mix(in srgb, var(--color-primary) 70%, #FFB400)' }}
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scale: [0.6, 1, 0.6],
                rotate: [0, 90, 180],
              }}
              transition={{
                duration: 2.5,
                delay: 1,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Sparkles size={12} fill="currentColor" />
            </m.div>
          </>
        )}

        {/* Cookie */}
        <m.div
          className="relative cursor-pointer"
          style={{ width: '12rem', height: '9rem' }}
          onClick={handleClick}
          whileHover={!isOpen ? { scale: 1.05 } : {}}
          whileTap={!isOpen ? { scale: 0.95 } : {}}
        >
          {/* Closed Cookie */}
          {!isOpen && (
            <m.div
              initial={{ opacity: 1, scale: 1 }}
              animate={{
                opacity: isOpen ? 0 : 1,
                scale: isOpen ? 0.8 : 1,
              }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <svg
                viewBox="0 0 200 120"
                className="w-full h-full"
                style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.15))' }}
              >
                <defs>
                  <linearGradient id="cookieGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FDE68A" />
                    <stop offset="50%" stopColor="#FCD34D" />
                    <stop offset="100%" stopColor="#FBBF24" />
                  </linearGradient>
                  <linearGradient id="cookieStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#D97706" />
                  </linearGradient>
                </defs>
                {/* Cookie body */}
                <ellipse
                  cx="100"
                  cy="60"
                  rx="80"
                  ry="50"
                  fill="url(#cookieGradient)"
                  stroke="url(#cookieStroke)"
                  strokeWidth="3"
                />
                {/* Cookie details */}
                <ellipse cx="70" cy="50" rx="3" ry="2" fill="#F59E0B" opacity="0.4" />
                <ellipse cx="130" cy="55" rx="2.5" ry="2" fill="#F59E0B" opacity="0.4" />
                <ellipse cx="100" cy="45" rx="2" ry="1.5" fill="#F59E0B" opacity="0.4" />
                <ellipse cx="85" cy="65" rx="2.5" ry="2" fill="#F59E0B" opacity="0.4" />
                <ellipse cx="115" cy="68" rx="2" ry="1.5" fill="#F59E0B" opacity="0.4" />
              </svg>
            </m.div>
          )}

          {/* Cracking Animation */}
          {isOpen && (
            <>
              {/* Top half */}
              <m.div
                initial={{ y: 0, rotate: 0 }}
                animate={{
                  y: -60,
                  rotate: -15,
                  opacity: 0,
                }}
                transition={{
                  duration: 0.6,
                  ease: 'easeOut',
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <svg
                  viewBox="0 0 200 60"
                  className="w-full h-1/2"
                  style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}
                >
                  <defs>
                    <linearGradient id="topGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FDE68A" />
                      <stop offset="100%" stopColor="#FCD34D" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 20 30 Q 50 10, 100 10 Q 150 10, 180 30 L 180 60 Q 100 40, 20 60 Z"
                    fill="url(#topGradient)"
                    stroke="#F59E0B"
                    strokeWidth="3"
                  />
                </svg>
              </m.div>

              {/* Bottom half */}
              <m.div
                initial={{ y: 0, rotate: 0 }}
                animate={{
                  y: 60,
                  rotate: 15,
                  opacity: 0,
                }}
                transition={{
                  duration: 0.6,
                  ease: 'easeOut',
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <svg
                  viewBox="0 0 200 60"
                  className="w-full h-1/2 mt-12"
                  style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}
                >
                  <defs>
                    <linearGradient id="bottomGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FCD34D" />
                      <stop offset="100%" stopColor="#FBBF24" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 20 0 Q 100 20, 180 0 L 180 30 Q 150 50, 100 50 Q 50 50, 20 30 Z"
                    fill="url(#bottomGradient)"
                    stroke="#F59E0B"
                    strokeWidth="3"
                  />
                </svg>
              </m.div>
            </>
          )}
        </m.div>
      </div>

      {/* Title & Instructions */}
      {!isOpen && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center space-y-2"
        >
          <h2 className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
            오늘의 명언
          </h2>
          <p
            className="text-sm"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            쿠키를 탭해서 열어보세요
          </p>
          <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-[1.5px] shadow-sm text-sm"
            style={{
              backgroundColor: 'var(--color-card)',
              borderColor:
                'color-mix(in srgb, var(--color-primary) 22%, transparent)',
            }}
          >
            <Sparkles
              size={12}
              style={{ color: 'var(--color-primary)' }}
              fill="currentColor"
            />
            <span
              className="font-semibold"
              style={{ color: 'var(--color-primary)' }}
            >
              오늘의 지혜가 기다려요
            </span>
            <Sparkles
              size={12}
              style={{ color: 'var(--color-primary)' }}
              fill="currentColor"
            />
          </m.div>
        </m.div>
      )}
    </div>
  )
}

// Fortune Display Component
interface FortuneDisplayProps {
  fortune: Fortune
  onGetAnother: () => void
}

function FortuneDisplay({ fortune, onGetAnother }: FortuneDisplayProps) {
  return (
    <m.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="relative"
      style={{ width: '100%', maxWidth: '24rem' }}
    >
      {/* Main card */}
      <div
        className="rounded-2xl shadow-lg border-[1.5px] p-4 relative overflow-hidden"
        style={{
          backgroundColor: 'var(--color-card)',
          borderColor:
            'color-mix(in srgb, var(--color-primary) 22%, transparent)',
          boxShadow: 'var(--shadow-primary-glow)',
        }}
      >
        {/* Background decoration — primary radial halo */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at top right, color-mix(in srgb, var(--color-primary) 10%, transparent) 0%, transparent 60%)',
          }}
        />

        <div className="relative z-10 space-y-3">
          {/* Title */}
          <div className="text-center">
            <p
              className="type-eyebrow"
              style={{ color: 'var(--color-primary)' }}
            >
              KOTOWAZA
            </p>
            <h2
              className="text-lg font-bold mt-0.5"
              style={{ color: 'var(--color-foreground)' }}
            >
              오늘의 속담
            </h2>
          </div>

          {/* Japanese text with TTS */}
          <div
            className="text-center rounded-xl p-3 border-[1.5px]"
            style={{
              background:
                'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 8%, var(--color-card)) 0%, var(--color-card) 100%)',
              borderColor:
                'color-mix(in srgb, var(--color-primary) 18%, transparent)',
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <p
                className="text-xl font-bold leading-relaxed break-keep"
                style={{ color: 'var(--color-foreground)' }}
              >
                {fortune.japanese}
              </p>
              <TTSButton text={fortune.japanese} size="sm" variant="ghost" className="shrink-0" />
            </div>
          </div>

          {/* Pronunciation info */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <h3
                className="text-[10px] font-bold uppercase tracking-wider mb-0.5"
                style={{ color: 'var(--color-primary)' }}
              >
                한국어 발음
              </h3>
              <p
                className="font-medium"
                style={{ color: 'var(--color-foreground)' }}
              >
                {fortune.koreanPronunciation}
              </p>
            </div>

            <div>
              <h3
                className="text-[10px] font-bold uppercase tracking-wider mb-0.5"
                style={{ color: 'var(--color-primary)' }}
              >
                Romaji
              </h3>
              <p
                className="font-medium italic"
                style={{ color: 'var(--color-foreground)' }}
              >
                {fortune.romaji}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div
            className="border-t"
            style={{ borderColor: 'var(--color-border-light)' }}
          />

          {/* Korean translation */}
          <div>
            <h3
              className="text-[10px] font-bold uppercase tracking-wider mb-0.5"
              style={{ color: 'var(--color-primary)' }}
            >
              의미
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {fortune.koreanTranslation}
            </p>
          </div>

          {/* Button — 테마 primary 적용 */}
          <div className="flex justify-center pt-1">
            <Button
              onClick={onGetAnother}
              size="sm"
              className="px-4 py-2 text-sm rounded-full flex items-center gap-1.5"
            >
              <RefreshCw size={14} />
              다시 뽑기
            </Button>
          </div>
        </div>
      </div>
    </m.div>
  )
}

// Modal Component
interface FortuneCookieModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function FortuneCookieModal({ open, onOpenChange }: FortuneCookieModalProps) {
  const [isOpened, setIsOpened] = useState(false)
  const [currentFortune, setCurrentFortune] = useState<Fortune | null>(null)
  const [showFortune, setShowFortune] = useState(false)

  const getRandomFortune = () => {
    const randomIndex = Math.floor(Math.random() * FORTUNES.length)
    return FORTUNES[randomIndex]
  }

  useEffect(() => {
    if (open) {
      setIsOpened(false)
      setShowFortune(false)
      setCurrentFortune(null)
    }
  }, [open])

  const handleCookieClick = () => {
    setIsOpened(true)
    const fortune = getRandomFortune()
    setCurrentFortune(fortune)

    setTimeout(() => {
      setShowFortune(true)
    }, 800)
  }

  const handleGetAnother = () => {
    setIsOpened(false)
    setShowFortune(false)
    setCurrentFortune(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[calc(100vw-32px)] max-w-[440px] p-0 overflow-hidden border-[1.5px]"
        style={{
          minHeight: '400px',
          background:
            'linear-gradient(180deg, color-mix(in srgb, var(--color-primary) 8%, var(--color-card)) 0%, var(--color-card) 60%)',
          borderColor:
            'color-mix(in srgb, var(--color-primary) 18%, transparent)',
        }}
      >
        <DialogTitle className="sr-only">오늘의 명언 쿠키</DialogTitle>

        {/* 닫기 버튼 */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 z-10 rounded-full hover:bg-primary/10"
          onClick={() => onOpenChange(false)}
        >
          <X className="w-4 h-4" />
        </Button>

        <div className="p-4 pt-8 flex flex-col items-center w-full">
          {/* Cookie or Fortune */}
          {!showFortune ? (
            <FortuneCookieView isOpen={isOpened} onClick={handleCookieClick} />
          ) : (
            currentFortune && (
              <FortuneDisplay fortune={currentFortune} onGetAnother={handleGetAnother} />
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// 배너 컴포넌트
export function FortuneCookieBanner() {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <m.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowModal(true)}
        className="w-full p-4 rounded-2xl border-[1.5px] flex items-center gap-4 text-left relative overflow-hidden"
        style={{
          // 테마 토큰 기반 그라데이션 — primary 5% → card
          background:
            'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 10%, var(--color-card)) 0%, var(--color-card) 70%)',
          borderColor:
            'color-mix(in srgb, var(--color-primary) 22%, transparent)',
          boxShadow: 'var(--shadow-primary-glow)',
        }}
        aria-label="오늘의 명언 뽑기"
      >
        {/* 미세 halo 펄스 (배경 장식) */}
        <div
          className="absolute -right-8 -top-8 w-32 h-32 rounded-full anim-halo pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, color-mix(in srgb, var(--color-primary) 18%, transparent) 0%, transparent 70%)',
          }}
        />

        {/* 쿠키 아이콘 (SVG, primary 톤 그라데이션) */}
        <m.div
          animate={{ rotate: [0, -5, 5, -5, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          className="flex-shrink-0 relative z-10"
          style={{ width: '3rem', height: '3rem' }}
        >
          <svg viewBox="0 0 200 120" className="w-full h-full">
            <defs>
              <linearGradient id="bannerCookieGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                {/* primary 색을 베이스로 + 골드 하이라이트 (쿠키 느낌 유지) */}
                <stop offset="0%" stopColor="#FDE68A" />
                <stop offset="50%" stopColor="#FCD34D" />
                <stop
                  offset="100%"
                  stopColor="var(--color-primary)"
                  stopOpacity="0.9"
                />
              </linearGradient>
            </defs>
            <ellipse
              cx="100"
              cy="60"
              rx="80"
              ry="50"
              fill="url(#bannerCookieGradient)"
              stroke="var(--color-primary)"
              strokeWidth="3"
              strokeOpacity="0.7"
            />
            {/* 쿠키 갈라진 선 — primary 톤 */}
            <path
              d="M 30 60 Q 60 50 100 60 T 170 60"
              stroke="var(--color-primary)"
              strokeWidth="2"
              strokeOpacity="0.35"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </m.div>

        {/* 텍스트 */}
        <div className="flex-1 min-w-0 relative z-10">
          <p
            className="font-bold"
            style={{ color: 'var(--color-foreground)' }}
          >
            오늘의 명언 쿠키
          </p>
          <p
            className="text-xs mt-0.5"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            탭해서 일본어 속담 한 줄 받기
          </p>
        </div>

        {/* 스파클 */}
        <Sparkles
          className="w-5 h-5 flex-shrink-0 relative z-10"
          style={{ color: 'var(--color-primary)' }}
        />
      </m.button>

      <FortuneCookieModal open={showModal} onOpenChange={setShowModal} />
    </>
  )
}
