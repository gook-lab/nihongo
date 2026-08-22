import { m } from 'framer-motion'
import { BookX, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BottomNav } from '@/components/BottomNav'
import { WrongWordsList } from '@/components/WrongWordsList'
import { EmptyState } from '@/components/EmptyState'
import { useAppStore } from '@/store'

export function WrongWordsPage() {
  const navigate = useNavigate()
  const { wrongWordIds } = useAppStore()

  return (
    <div className="min-h-screen bg-background pb-nav">
      {/* 헤더 */}
      <div className="bg-gradient-to-b from-primary/10 to-background pt-12 pb-8 px-5">
        <m.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="type-h3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <BookX className="w-4 h-4 text-primary" />
            </div>
            오답 노트
          </h1>
        </m.div>
      </div>

      <m.div
        className="px-5 space-y-4 -mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {wrongWordIds.length > 0 ? (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <span>복습이 필요한 단어</span>
                <span className="text-sm font-normal text-primary">
                  {wrongWordIds.length}개
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WrongWordsList wordIds={wrongWordIds} showRemoveButton />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-2">
              <EmptyState
                reaction="celebrate"
                title="오답 단어가 없어요!"
                description="계속해서 학습을 이어가세요"
                bubble="완벽해요! 🎉"
                actionLabel="학습하러 가기"
                onAction={() => navigate('/learn')}
              />
            </CardContent>
          </Card>
        )}

        {/* 안내 메시지 */}
        {wrongWordIds.length > 0 && (
          <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center text-sm text-muted-foreground px-4"
          >
            <p>오답 단어는 학습할 때 자동으로 출제됩니다.</p>
            <p className="text-primary font-medium mt-1">
              맞추면 자동으로 목록에서 제거돼요!
            </p>
          </m.div>
        )}
      </m.div>

      <BottomNav />
    </div>
  )
}
