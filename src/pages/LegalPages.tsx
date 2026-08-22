// 약관 / 개인정보 처리방침 — 정적 컨텐츠. 같은 레이아웃 공유.
import { useNavigate } from 'react-router-dom'
import { m } from 'framer-motion'
import { FileText, Shield } from 'lucide-react'
import { BottomNav } from '@/components/BottomNav'
import { PageHeader } from '@/components/PageHeader'
import { useAppStore } from '@/store'

interface LegalSection {
  heading: string
  body: string
}

interface LegalContent {
  title: string
  subtitle: string
  lastUpdated: string
  sections: LegalSection[]
}

const TERMS: LegalContent = {
  title: '이용약관',
  subtitle: '니혼고 앱 서비스 이용에 관한 약관',
  lastUpdated: '2026-05-14',
  sections: [
    {
      heading: '제1조 (목적)',
      body: '본 약관은 니혼고 앱(이하 "서비스")이 제공하는 일본어 학습 서비스의 이용과 관련하여 이용자와 서비스 제공자 사이의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.',
    },
    {
      heading: '제2조 (서비스의 제공)',
      body: '서비스는 다음과 같은 기능을 무료로 제공합니다.\n· 일본어 단어/한자 학습 콘텐츠\n· 회화 표현 학습 및 메모 기능\n· 학습 통계 및 SRS 기반 복습 시스템\n· AI 기반 짧은 글 생성 및 채팅(Google Gemini 사용)\n· 음성 합성(Murf.ai 또는 브라우저 TTS)',
    },
    {
      heading: '제3조 (회원가입 및 계정)',
      body: '회원가입은 다음 방법 중 하나로 이루어집니다.\n· Google 계정 (OAuth)\n· 카카오 계정 (OIDC)\n· 네이버 계정 (OIDC)\n· 이메일/비밀번호\n\n이용자는 본인의 계정 정보를 안전하게 관리할 의무가 있으며, 계정 도용으로 인한 손해에 대해 서비스는 책임지지 않습니다.',
    },
    {
      heading: '제4조 (이용자의 의무)',
      body: '이용자는 다음 행위를 하여서는 안 됩니다.\n· 타인의 계정을 도용하거나 정보를 위조하는 행위\n· 서비스의 정상적인 운영을 방해하는 행위\n· 저작권 등 타인의 권리를 침해하는 행위',
    },
    {
      heading: '제5조 (서비스 변경 및 중단)',
      body: '서비스 제공자는 사전 공지 후 서비스의 일부 또는 전부를 변경하거나 중단할 수 있습니다. 천재지변, 시스템 장애 등 불가피한 사유로 일시 중단될 수 있습니다.',
    },
    {
      heading: '제6조 (면책)',
      body: '본 서비스는 학습 보조 도구이며, 학습 결과(JLPT 시험 점수 등)를 보증하지 않습니다. AI가 생성한 콘텐츠의 정확성에 대해서도 보증하지 않으니 학습 시 참고로만 사용하시기 바랍니다.',
    },
    {
      heading: '제7조 (약관의 변경)',
      body: '본 약관은 필요한 경우 변경될 수 있으며, 변경된 약관은 앱 내 공지를 통해 효력이 발생합니다.',
    },
  ],
}

const PRIVACY: LegalContent = {
  title: '개인정보 처리방침',
  subtitle: '수집하는 정보, 사용 목적, 보관 기간',
  lastUpdated: '2026-05-14',
  sections: [
    {
      heading: '1. 수집하는 개인정보',
      body: '서비스는 다음 정보를 수집·이용합니다.\n· 필수: 이메일, 닉네임, 프로필 사진 URL, OAuth 제공자 식별자\n· 자동: 학습 기록(XP, 레벨, 정답률, 학습 일자), 단어별 SRS 상태, 회화 메모, 즐겨찾기, AI 생성 이야기\n· 선택: TTS 설정, 마스코트/테마 선호',
    },
    {
      heading: '2. 수집 방법',
      body: '· OAuth 제공자(Google 등)를 통한 로그인 시 자동 수집\n· 서비스 이용 중 사용자 행동에 의해 자동 생성\n· 사용자가 직접 입력(닉네임 편집 등)',
    },
    {
      heading: '3. 이용 목적',
      body: '· 회원 식별 및 학습 진행도 관리\n· 여러 기기 간 학습 데이터 동기화\n· 개인화된 학습 추천 및 통계 제공\n· 서비스 개선을 위한 익명 통계 분석',
    },
    {
      heading: '4. 보관 위치 및 보안',
      body: '개인정보는 Google Firebase(Authentication, Firestore) 인프라에 저장됩니다. Firebase는 SOC 2, ISO 27001 등 국제 보안 인증을 받은 클라우드 서비스입니다. 모든 데이터 통신은 HTTPS로 암호화됩니다.',
    },
    {
      heading: '5. 보관 기간 및 파기',
      body: '회원 정보 및 학습 기록은 회원 탈퇴 시 즉시 영구 삭제됩니다. 탈퇴 후에는 어떠한 정보도 보관되지 않습니다. 단, 관련 법령에 따라 일정 기간 보관해야 하는 경우(전자상거래 법 등) 예외가 적용될 수 있습니다.',
    },
    {
      heading: '6. 제3자 제공',
      body: '서비스는 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만 다음의 경우에는 예외로 합니다.\n· 법령에 의거하여 수사기관의 요청이 있는 경우\n· 이용자가 사전에 동의한 경우',
    },
    {
      heading: '7. 처리 위탁',
      body: '· Google LLC (Firebase Authentication / Firestore 인프라, AI Gemini)\n· Murf Inc. (TTS, 음성 합성을 위한 텍스트만 일시 전송)\n· GlitchTip (오픈소스 오류 진단 — 익명 스택 트레이스만, 이메일/학습 데이터 미전송)\n· Plausible Analytics (페이지뷰 등 익명 사용 통계, 쿠키 없음, 개인 식별 정보 미전송)\n\nMurf.ai 사용을 원치 않으시면 설정 > 음성 > "기본 음성(브라우저 TTS)"로 변경 가능합니다.',
    },
    {
      heading: '8. 이용자의 권리',
      body: '이용자는 언제든지 다음 권리를 행사할 수 있습니다.\n· 본인 정보 열람: 마이페이지에서 학습 기록 확인\n· 정정: 닉네임 등 직접 수정\n· 내보내기: 마이페이지 > 데이터 CSV 내보내기\n· 삭제: 마이페이지 > 위험 영역 > 계정 탈퇴',
    },
    {
      heading: '9. 문의',
      body: '개인정보 처리와 관련한 문의는 다음 이메일로 연락 주시기 바랍니다.\n· 이메일: ym05200@naver.com\n\n설정 > 지원 > 문의하기에서도 메일 작성 화면으로 이동할 수 있습니다.',
    },
  ],
}

function LegalPageView({
  content,
  icon: Icon,
}: {
  content: LegalContent
  icon: React.ComponentType<{ className?: string }>
}) {
  const navigate = useNavigate()
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)

  // 인증 상태에 따라 뒤로가기 동작 분기: 로그인 사용자는 설정으로, 게스트는 로그인 페이지로
  const handleBack = () => {
    navigate(isAuthenticated ? '/settings' : '/login')
  }

  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHeader title={content.title} icon={Icon} back onBack={handleBack} />

      <m.div
        className="px-5 mt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p
          className="text-sm"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {content.subtitle}
        </p>
        <p
          className="text-[11px] mt-1"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          최종 업데이트: {content.lastUpdated}
        </p>

        <div className="mt-5 space-y-6">
          {content.sections.map((sec, i) => (
            <section key={i}>
              <h2 className="text-base font-bold mb-2">{sec.heading}</h2>
              <p
                className="text-sm leading-relaxed whitespace-pre-line"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {sec.body}
              </p>
            </section>
          ))}
        </div>

        <p
          className="text-center text-[11px] mt-8 mb-4"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          본 문서는 개인 학습용 앱의 표준 양식을 기반으로 작성되었으며, 정책 변경 시 앱 내 공지를 통해 안내됩니다.
        </p>
      </m.div>

      {isAuthenticated && <BottomNav />}
    </div>
  )
}

export function TermsPage() {
  return <LegalPageView content={TERMS} icon={FileText} />
}

export function PrivacyPage() {
  return <LegalPageView content={PRIVACY} icon={Shield} />
}
