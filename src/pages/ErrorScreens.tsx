// 공통 에러 화면 컴포넌트 + 5종 (network/server/permission/maintenance/update)
// 404는 NotFoundPage.tsx에 별도 (사용자 기존 패턴 유지)
// share/extras.jsx ErrorScreen 패턴 React 포팅
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { MascotScene } from '@/components/MascotScene'
import type { MascotReaction } from '@/components/MascotAvatar'

export type ErrorKind = 'network' | 'server' | 'permission' | 'maintenance' | 'update'

// kind별 마스코트 reaction 매핑
const KIND_REACTION: Record<ErrorKind, MascotReaction> = {
  network: 'shock',       // 연결 끊김 = 놀람
  server: 'sad',          // 서버 실패 = 슬픔
  permission: 'think',    // 권한 = 헷갈림
  maintenance: 'sleep',   // 점검 중 = 자고 있어요
  update: 'wave',         // 업데이트 = "안녕! 새 버전이에요"
}

interface ErrorMeta {
  tag: string
  title: string // \n 줄바꿈 지원
  body: string
  primaryAction: string
  secondaryAction: string
  color: string
  art: React.ReactNode
}

const ERRORS: Record<ErrorKind, ErrorMeta> = {
  network: {
    tag: 'NETWORK ERROR',
    title: '인터넷 연결을\n확인해주세요',
    body: '연결이 끊어졌어요.\nWi-Fi 또는 데이터를 확인하고 다시 시도해보세요.',
    primaryAction: '다시 시도',
    secondaryAction: '오프라인으로 사용',
    color: '#FF8A4D',
    art: (
      <svg viewBox="0 0 160 160" width="160" height="160">
        <circle cx="80" cy="110" r="6" fill="#FF8A4D" />
        <path
          d="M50 86 Q80 64 110 86"
          stroke="#FF8A4D"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M32 66 Q80 24 128 66"
          stroke="#FF8A4D"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          opacity="0.35"
        />
        <path
          d="M14 46 Q80 -10 146 46"
          stroke="#FF8A4D"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          opacity="0.18"
        />
        <line
          x1="20"
          y1="20"
          x2="140"
          y2="140"
          stroke="#FF4D4D"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  server: {
    tag: 'SERVER ERROR',
    title: '잠시 후 다시\n시도해주세요',
    body: '서버에 일시적인 문제가 발생했어요.\n계속되면 고객센터로 문의해주세요.',
    primaryAction: '다시 시도',
    secondaryAction: '고객센터 문의',
    color: '#FF4D6D',
    art: (
      <svg viewBox="0 0 160 160" width="160" height="160">
        <rect x="32" y="48" width="96" height="22" rx="6" fill="#FFE5EA" stroke="#FF4D6D" strokeWidth="2" />
        <circle cx="44" cy="59" r="3" fill="#FF4D6D" />
        <rect x="32" y="74" width="96" height="22" rx="6" fill="#FFD0D8" stroke="#FF4D6D" strokeWidth="2" />
        <circle cx="44" cy="85" r="3" fill="#FF4D6D" />
        <rect x="32" y="100" width="96" height="22" rx="6" fill="#FFB0BC" stroke="#FF4D6D" strokeWidth="2" />
        <text x="80" y="112" textAnchor="middle" fontSize="14" fontWeight="800" fill="#fff">
          500
        </text>
        <path
          d="M118 30 L138 50 M138 30 L118 50"
          stroke="#FF4D6D"
          strokeWidth="3"
          strokeLinecap="round"
          className="anim-err-bounce"
          style={{ transformOrigin: 'center' }}
        />
      </svg>
    ),
  },
  permission: {
    tag: 'PERMISSION',
    title: '알림 권한이\n필요해요',
    body: '학습 알림을 받으려면 설정 > 알림에서\n권한을 허용해주세요.',
    primaryAction: '설정으로 이동',
    secondaryAction: '나중에',
    color: '#7FB8E6',
    art: (
      <svg viewBox="0 0 160 160" width="160" height="160">
        <path
          d="M80 30 C 60 30 50 50 50 70 L 50 100 L 40 110 L 120 110 L 110 100 L 110 70 C 110 50 100 30 80 30 Z"
          fill="#EAF3FB"
          stroke="#7FB8E6"
          strokeWidth="3"
        />
        <circle cx="80" cy="120" r="8" fill="#7FB8E6" />
        <circle cx="115" cy="50" r="18" fill="#FF4D6D" />
        <text x="115" y="56" textAnchor="middle" fontSize="20" fontWeight="800" fill="#fff">
          !
        </text>
      </svg>
    ),
  },
  maintenance: {
    tag: 'MAINTENANCE',
    title: '잠시 점검 중이에요',
    body: '서비스 안정화 작업이 진행 중이에요.\n공지 사항에서 일정을 확인해 주세요.',
    primaryAction: '확인',
    secondaryAction: '공지 보기',
    color: '#A89BBA',
    art: (
      <svg viewBox="0 0 160 160" width="160" height="160">
        <g style={{ transformOrigin: '80px 80px' }} className="anim-gear">
          <path
            d="M80 30 L86 30 L88 40 L96 42 L102 36 L108 42 L102 50 L106 58 L116 60 L116 66 L106 68 L102 76 L108 84 L102 90 L94 84 L86 86 L84 96 L78 96 L76 86 L68 84 L62 90 L56 84 L62 76 L58 68 L48 66 L48 60 L58 58 L62 50 L56 42 L62 36 L70 42 L78 40 Z"
            fill="#E4DEEA"
            stroke="#A89BBA"
            strokeWidth="2"
          />
          <circle cx="82" cy="63" r="10" fill="#fff" stroke="#A89BBA" strokeWidth="2" />
        </g>
        <g
          style={{ transformOrigin: '116px 116px', animationDirection: 'reverse' }}
          className="anim-gear"
        >
          <circle cx="116" cy="116" r="20" fill="#D6CEDF" stroke="#A89BBA" strokeWidth="2" />
          <circle cx="116" cy="116" r="6" fill="#fff" />
        </g>
      </svg>
    ),
  },
  update: {
    tag: 'UPDATE REQUIRED',
    title: '새로운 버전이\n나왔어요',
    body: '성능과 안정성이 크게 개선되었어요.\n잠깐 새로고침해 주세요.',
    primaryAction: '업데이트',
    secondaryAction: '나중에',
    color: '#2EBD6B',
    art: (
      <svg viewBox="0 0 160 160" width="160" height="160">
        <circle cx="80" cy="80" r="60" fill="#E8F8EF" />
        <path
          d="M80 40 L80 100 M62 82 L80 100 L98 82"
          stroke="#2EBD6B"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="anim-update"
        />
        <line x1="55" y1="116" x2="105" y2="116" stroke="#2EBD6B" strokeWidth="6" strokeLinecap="round" />
      </svg>
    ),
  },
}

interface ErrorScreenProps {
  kind: ErrorKind
  onPrimary?: () => void
  onSecondary?: () => void
}

export function ErrorScreen({ kind, onPrimary, onSecondary }: ErrorScreenProps) {
  const navigate = useNavigate()
  const e = ERRORS[kind]

  const handlePrimary = () => {
    if (onPrimary) {
      onPrimary()
      return
    }
    // 기본 동작: 다시 시도 = 새로고침, 그 외 = 홈
    if (kind === 'network' || kind === 'server') {
      window.location.reload()
    } else if (kind === 'permission') {
      navigate('/settings/notifications')
    } else if (kind === 'update') {
      window.location.reload()
    } else {
      navigate('/')
    }
  }

  const handleSecondary = () => {
    if (onSecondary) {
      onSecondary()
      return
    }
    navigate('/')
  }

  return (
    <div
      className="min-h-screen flex flex-col pt-24 px-7 pb-9 anim-screen-in"
      style={{ background: 'var(--color-background)' }}
    >
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="mb-6 anim-badge-pop w-full max-w-[280px]">
          <MascotScene reaction={KIND_REACTION[kind]} sizeToken="md" />
        </div>
        <p
          className="type-eyebrow"
          style={{ color: e.color }}
        >
          {e.tag}
        </p>
        <h1
          className="mt-2.5 text-[26px] font-extrabold tracking-tight leading-tight whitespace-pre-line"
          style={{ color: 'var(--color-foreground)' }}
        >
          {e.title}
        </h1>
        <p
          className="mt-3 text-sm leading-relaxed whitespace-pre-line max-w-[290px]"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {e.body}
        </p>
      </div>

      <div className="space-y-2.5">
        <Button onClick={handlePrimary} className="w-full h-12">
          {e.primaryAction}
        </Button>
        <button
          onClick={handleSecondary}
          className="w-full py-3 text-sm font-medium"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {e.secondaryAction}
        </button>
      </div>
    </div>
  )
}

// 5개 라우트용 wrapper
export const NetworkErrorPage = () => <ErrorScreen kind="network" />
export const ServerErrorPage = () => <ErrorScreen kind="server" />
export const PermissionErrorPage = () => <ErrorScreen kind="permission" />
export const MaintenancePage = () => <ErrorScreen kind="maintenance" />
export const UpdateRequiredPage = () => <ErrorScreen kind="update" />
