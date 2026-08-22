// 마이페이지 — 닉네임 편집, 프로필 메타 표시, 학습 통계, 데이터 내보내기, 탈퇴 진입
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { m } from 'framer-motion'
import {
  User as UserIcon,
  Mail,
  Calendar,
  Edit3,
  Check,
  Download,
  AlertTriangle,
  Flame,
  BookX,
  RotateCcw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { BottomNav } from '@/components/BottomNav'
import { PageHeader } from '@/components/PageHeader'
import { MascotScene } from '@/components/MascotScene'
import { Spinner } from '@/components/Spinner'
import { LevelBadgeSvg } from '@/components/LevelBadgeSvg'
import { LevelJourneyDialog } from '@/components/LevelJourneyDialog'
import { SelectedBadgeStrip } from '@/components/SelectedBadgeStrip'
import { buildIcsContent, downloadIcs } from '@/lib/ical-export'
import { useAppStore } from '@/store'
import {
  isFirebaseConfigured,
  updateUserDisplayName,
  getCurrentProvider,
  getCreationTimestamp,
  getCurrentUid,
} from '@/lib/firebase'
import { deleteAllUserData } from '@/lib/firestore'
import { getLevelInfo } from '@/constants'
import { toast } from '@/lib/toast'
import { cn } from '@/lib/utils'
import { reportAuthError, reportStorageError } from '@/lib/sentry'

const PROVIDER_LABEL: Record<string, string> = {
  google: 'Google',
  kakao: '카카오',
  naver: '네이버',
}

function formatDate(ms: number | null): string {
  if (!ms) return '-'
  const d = new Date(ms)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

function buildCsvExport(state: ReturnType<typeof useAppStore.getState>): string {
  const lines: string[] = []
  lines.push('# 니혼고 앱 학습 데이터 내보내기')
  lines.push(`# Exported: ${new Date().toISOString()}`)
  lines.push('')
  lines.push('## 진행 상태')
  lines.push('field,value')
  lines.push(`xp,${state.xp}`)
  lines.push(`level,${state.level}`)
  lines.push(`streak,${state.streak}`)
  lines.push(`wrong_word_count,${state.wrongWordIds.length}`)
  lines.push('')
  lines.push('## 일별 학습 기록')
  lines.push('date,studyCount,correctCount,totalCount,xpEarned')
  for (const rec of Object.values(state.dailyRecords)) {
    lines.push(`${rec.date},${rec.studyCount},${rec.correctCount},${rec.totalCount},${rec.xpEarned}`)
  }
  lines.push('')
  lines.push('## SRS 단어 상태')
  lines.push('wordId,reviewCount,correctCount,wrongCount,ease,intervalDays')
  for (const s of Object.values(state.wordSrs)) {
    lines.push(`${s.wordId},${s.reviewCount},${s.correctCount},${s.wrongCount},${s.ease.toFixed(2)},${s.intervalDays}`)
  }
  lines.push('')
  lines.push('## 회화 메모')
  lines.push('text,reading,meaning,category')
  for (const m of state.conversationMemo) {
    lines.push(`${m.text},${m.reading},${m.meaning.replace(/,/g, ' ')},${m.category}`)
  }
  return lines.join('\n')
}

function downloadCsv(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 100)
}

// Anki TSV 포맷 export — 학습한 단어를 Anki 카드로.
// 형식: Front<TAB>Back  (Anki "Basic" 노트 타입 기본 매핑)
// Back: 뜻 + 예문 (HTML <br>로 줄바꿈)
async function buildAnkiTsv(): Promise<string> {
  const { WORDS } = await import('@/data/words')
  const state = useAppStore.getState()
  const learnedIds = new Set(Object.keys(state.wordSrs ?? {}))
  if (learnedIds.size === 0) {
    // 학습 기록이 없으면 전체 N5 단어 export (입문자가 처음 import해도 가치 있음)
    return wordsToTsv(WORDS.filter((w) => w.level === 5))
  }
  const learned = WORDS.filter((w) => learnedIds.has(w.id))
  return wordsToTsv(learned)
}

function wordsToTsv(words: typeof import('@/data/words').WORDS): string {
  const lines: string[] = []
  // Anki는 첫 줄 #separator:tab 등 헤더 직접 인식
  lines.push('#separator:tab')
  lines.push('#html:true')
  for (const w of words) {
    const front = `${w.kanji}<br><span style="font-size:14px;opacity:.7">${w.hiragana}</span>`
    let back = w.meaning
    if (w.example) {
      back += `<br><br><i>${w.example.japanese}</i><br><span style="font-size:13px;opacity:.7">${w.example.reading}</span><br>${w.example.korean}`
    }
    // tab/newline은 공백으로 escape
    const clean = (s: string) => s.replace(/[\t\n]/g, ' ')
    lines.push(`${clean(front)}\t${clean(back)}`)
  }
  return lines.join('\n')
}

function downloadText(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 100)
}

export function ProfilePage() {
  const navigate = useNavigate()
  const user = useAppStore((s) => s.user)
  const xp = useAppStore((s) => s.xp)
  const level = useAppStore((s) => s.level)
  const streak = useAppStore((s) => s.streak)
  const wrongWordIds = useAppStore((s) => s.wrongWordIds)
  const dailyRecords = useAppStore((s) => s.dailyRecords)
  const login = useAppStore((s) => s.login)

  const [editingNickname, setEditingNickname] = useState(false)
  const [nicknameDraft, setNicknameDraft] = useState(user?.nickname || '')
  const [savingNickname, setSavingNickname] = useState(false)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [resetIncludeCloud, setResetIncludeCloud] = useState(true)
  const [isResetting, setIsResetting] = useState(false)
  const [showLevelJourney, setShowLevelJourney] = useState(false)

  const provider = isFirebaseConfigured() ? getCurrentProvider() : (user?.provider ?? null)
  const createdAt = isFirebaseConfigured() ? getCreationTimestamp() : null
  const levelInfo = getLevelInfo(level)
  const studyDays = useMemo(
    () => Object.values(dailyRecords).filter((r) => r.studyCount > 0).length,
    [dailyRecords],
  )

  const handleSaveNickname = async () => {
    const trimmed = nicknameDraft.trim()
    if (!trimmed || trimmed === user?.nickname) {
      setEditingNickname(false)
      setNicknameDraft(user?.nickname || '')
      return
    }
    setSavingNickname(true)
    try {
      if (isFirebaseConfigured()) {
        await updateUserDisplayName(trimmed)
      }
      // store 업데이트 (sync hook이 profile 카테고리 변경 감지해서 Firestore 자동 저장)
      if (user) {
        login({ ...user, nickname: trimmed })
      }
      setEditingNickname(false)
      toast.success({ message: '닉네임이 변경됐어요' })
    } catch (e) {
      console.error('닉네임 변경 실패:', e)
      reportAuthError(e, { operation: 'update-profile' })
      toast.error({ message: '닉네임 변경에 실패했어요. 다시 시도해 주세요.' })
    } finally {
      setSavingNickname(false)
    }
  }

  const handleExportCsv = () => {
    const csv = buildCsvExport(useAppStore.getState())
    const date = new Date().toISOString().split('T')[0]
    downloadCsv(csv, `nihongo-data-${date}.csv`)
  }

  const handleExportAnki = async () => {
    try {
      const tsv = await buildAnkiTsv()
      const date = new Date().toISOString().split('T')[0]
      downloadText(tsv, `nihongo-anki-${date}.txt`, 'text/tab-separated-values')
      toast.success({
        message: 'Anki 파일이 저장됐어요. Anki Desktop에서 가져오기 → 파일을 선택하세요.',
      })
    } catch (e) {
      console.error('Anki export 실패:', e)
      toast.error({ message: 'Anki 파일 생성에 실패했어요.' })
    }
  }

  const handleExportIcal = () => {
    const state = useAppStore.getState()
    const ics = buildIcsContent(state.dailyRecords, state.user?.nickname || '학습자')
    const date = new Date().toISOString().split('T')[0]
    downloadIcs(ics, `nihongo-calendar-${date}.ics`)
  }

  const handleResetProgress = async () => {
    setIsResetting(true)
    try {
      if (resetIncludeCloud && isFirebaseConfigured()) {
        const uid = getCurrentUid()
        if (uid) {
          await deleteAllUserData(uid)
        }
      }
      localStorage.removeItem('nihongo-app-storage')
      window.location.reload()
    } catch (e) {
      console.error('초기화 실패:', e)
      reportStorageError(e, {
        operation: 'remove',
        key: 'nihongo-app-storage',
        extra: { includeCloud: resetIncludeCloud },
      })
      toast.error({ message: '초기화에 실패했어요. 다시 시도해 주세요.' })
      setIsResetting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHeader title="마이페이지" icon={UserIcon} back backTo="/settings" />

      <m.div
        className="px-5 mt-4 space-y-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* 마스코트 인사 — 스트릭 7+ streak / 1-6 happy / 0 wave */}
        <MascotScene
          reaction={streak >= 7 ? 'streak' : streak > 0 ? 'happy' : 'wave'}
          sizeToken="sm"
          bubble={
            streak >= 7
              ? `${streak}일 연속! 🔥`
              : streak > 0
                ? `${streak}일째 학습 중!`
                : '안녕!'
          }
        />

        {/* 프로필 카드 */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/70 p-0.5 shrink-0">
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.nickname}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl">🌸</span>
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                {!editingNickname ? (
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-bold truncate">
                      {user?.nickname || '학습자'}
                      <span className="text-base font-medium text-muted-foreground ml-0.5">
                        님
                      </span>
                    </p>
                    <button
                      onClick={() => {
                        setNicknameDraft(user?.nickname || '')
                        setEditingNickname(true)
                      }}
                      className="w-7 h-7 rounded-full hover:bg-muted flex items-center justify-center shrink-0"
                      aria-label="닉네임 편집"
                    >
                      <Edit3
                        className="w-3.5 h-3.5"
                        style={{ color: 'var(--color-text-secondary)' }}
                      />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Input
                      value={nicknameDraft}
                      onChange={(e) => setNicknameDraft(e.target.value)}
                      maxLength={20}
                      autoFocus
                      className="h-9"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveNickname()
                        if (e.key === 'Escape') {
                          setEditingNickname(false)
                          setNicknameDraft(user?.nickname || '')
                        }
                      }}
                    />
                    <Button
                      size="icon"
                      onClick={handleSaveNickname}
                      disabled={savingNickname}
                      className="shrink-0"
                    >
                      {savingNickname ? (
                        <Spinner variant="ring" size={16} color="currentColor" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                )}

                <div className="mt-3 space-y-1.5 text-sm">
                  <div
                    className="flex items-center gap-2"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span className="truncate">{user?.email || '이메일 없음'}</span>
                  </div>
                  {provider && (
                    <div
                      className="flex items-center gap-2"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      <span className="w-3.5 h-3.5 flex items-center justify-center text-[10px]">
                        🔐
                      </span>
                      <span>{PROVIDER_LABEL[provider] || provider} 로그인</span>
                    </div>
                  )}
                  {createdAt && (
                    <div
                      className="flex items-center gap-2"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(createdAt)} 가입</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* 선택한 뱃지 — 사용자가 뱃지함에서 고른 최대 3개 */}
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <SelectedBadgeStrip size={32} showEmptyCta />
            </div>
          </CardContent>
        </Card>

        {/* 학습 통계 요약 */}
        <div>
          <p
            className="type-section mb-2 px-1"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            학습 통계
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setShowLevelJourney(true)}
              className="text-left rounded-2xl border border-border bg-card hover:border-primary/30 transition-colors p-3 flex items-center gap-3"
              aria-label="레벨 여정 보기"
            >
              <LevelBadgeSvg level={level} size={44} />
              <div>
                <p className="text-lg font-bold leading-tight">Lv.{level}</p>
                <p
                  className="text-[10px]"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {levelInfo.name} · {xp} XP
                </p>
              </div>
            </button>
            <Card>
              <CardContent className="p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <Flame className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-bold leading-tight">{streak}일</p>
                  <p
                    className="text-[10px]"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    연속 학습 · 총 {studyDays}일
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-2">
              <CardContent className="p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookX className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-lg font-bold leading-tight">
                    {wrongWordIds.length}개
                  </p>
                  <p
                    className="text-[10px]"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    오답 단어 — 복습이 기다려요
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/stats')}
                >
                  전체 보기
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 데이터 내보내기 */}
        <div>
          <p
            className="type-section mb-2 px-1"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            데이터
          </p>
          <Card>
            <CardContent className="p-0 divide-y divide-border-light">
              <button
                onClick={handleExportCsv}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/40 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Download className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">학습 데이터 CSV 내보내기</p>
                  <p
                    className="text-[11px]"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    진행도/SRS/오답/회화 메모를 CSV로
                  </p>
                </div>
              </button>
              <button
                onClick={handleExportIcal}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/40 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">학습 캘린더(.ics) 내보내기</p>
                  <p
                    className="text-[11px]"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    Google·Apple·Outlook 캘린더에 학습일 종일 이벤트로
                  </p>
                </div>
              </button>
              <button
                onClick={handleExportAnki}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/40 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Download className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Anki 카드 내보내기</p>
                  <p
                    className="text-[11px]"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    학습한 단어를 Anki Desktop import용 TSV로
                  </p>
                </div>
              </button>
            </CardContent>
          </Card>
        </div>

        {/* 위험 영역 — 초기화 / 탈퇴 */}
        <div>
          <p
            className="type-section mb-2 px-1"
            style={{ color: 'var(--color-destructive)' }}
          >
            위험 영역
          </p>
          <Card>
            <CardContent className="p-0 divide-y divide-border-light">
              <button
                onClick={() => setShowResetDialog(true)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-destructive/5 transition-colors"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(193, 53, 21, 0.10)' }}
                >
                  <RotateCcw
                    className="w-4 h-4"
                    style={{ color: 'var(--color-destructive)' }}
                  />
                </div>
                <div className="flex-1">
                  <p
                    className="font-medium text-sm"
                    style={{ color: 'var(--color-destructive)' }}
                  >
                    학습 데이터 초기화
                  </p>
                  <p
                    className="text-[11px]"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    모든 진행 상황을 처음 상태로 되돌립니다
                  </p>
                </div>
              </button>

              <button
                onClick={() => navigate('/account/delete')}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-destructive/5 transition-colors"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(193, 53, 21, 0.10)' }}
                >
                  <AlertTriangle
                    className="w-4 h-4"
                    style={{ color: 'var(--color-destructive)' }}
                  />
                </div>
                <div className="flex-1">
                  <p
                    className="font-medium text-sm"
                    style={{ color: 'var(--color-destructive)' }}
                  >
                    계정 탈퇴
                  </p>
                  <p
                    className="text-[11px]"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    모든 학습 기록이 영구 삭제됩니다
                  </p>
                </div>
              </button>
            </CardContent>
          </Card>
        </div>
      </m.div>

      {/* 초기화 확인 다이얼로그 */}
      <Dialog
        open={showResetDialog}
        onOpenChange={(v) => !isResetting && setShowResetDialog(v)}
      >
        <DialogContent className="w-[calc(100vw-32px)] max-w-[360px]">
          <DialogHeader>
            <DialogTitle className="text-center">학습 데이터 초기화</DialogTitle>
            <DialogDescription className="text-center">
              모든 학습 진행 상황이 삭제됩니다.
              <br />이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>

          {isFirebaseConfigured() && (
            <label
              className={cn(
                'flex items-start gap-3 p-3 rounded-xl border cursor-pointer mt-4 transition-colors',
                resetIncludeCloud
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-foreground/30',
              )}
            >
              <input
                type="checkbox"
                checked={resetIncludeCloud}
                onChange={(e) => setResetIncludeCloud(e.target.checked)}
                disabled={isResetting}
                className="mt-0.5 w-4 h-4 accent-primary shrink-0"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">클라우드 데이터도 함께 삭제</p>
                <p
                  className="text-[11px] mt-0.5"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {resetIncludeCloud
                    ? 'Firestore의 모든 학습 기록도 같이 사라집니다'
                    : '로컬만 초기화하면 다음 로그인 시 클라우드에서 복원돼요'}
                </p>
              </div>
            </label>
          )}

          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              className="flex-1 h-11"
              onClick={() => setShowResetDialog(false)}
              disabled={isResetting}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              className="flex-1 h-11"
              onClick={handleResetProgress}
              disabled={isResetting}
            >
              {isResetting ? '삭제 중...' : '초기화'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 레벨 여정 다이얼로그 */}
      <LevelJourneyDialog open={showLevelJourney} onOpenChange={setShowLevelJourney} />

      <BottomNav />
    </div>
  )
}
