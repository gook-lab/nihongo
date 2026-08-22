// 404 페이지 — 잘못된 URL 또는 사라진 페이지
import { useNavigate } from 'react-router-dom'
import { m } from 'framer-motion'
import { Home, BookOpen, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MascotScene } from '@/components/MascotScene'
import { useAppStore } from '@/store'

const QUICK_LINKS = [
  { href: '/', label: '홈', Icon: Home },
  { href: '/dictionary', label: '사전', Icon: BookOpen },
  { href: '/conversation', label: '회화', Icon: MessageCircle },
]

export function NotFoundPage() {
  const navigate = useNavigate()
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <m.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: '400px' }}
      >
        <Card>
          <CardContent className="p-6 text-center">
            <m.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mb-4"
            >
              {/* 페이지를 못 찾음 = 헷갈리는 마스코트 (think) */}
              <MascotScene reaction="think" sizeToken="md" />
            </m.div>

            <p
              className="text-5xl font-bold mb-2"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-primary)',
              }}
            >
              404
            </p>

            <h1 className="type-h3 mb-1">
              이 페이지는 사라졌어요
            </h1>
            <p
              className="text-sm mb-5"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              주소가 잘못되었거나 페이지가 이동했을 수 있어요
            </p>

            <Button
              onClick={() => navigate(isAuthenticated ? '/' : '/login')}
              className="w-full h-11"
            >
              {isAuthenticated ? '홈으로 돌아가기' : '로그인 페이지로'}
            </Button>

            {isAuthenticated && (
              <>
                <p
                  className="text-[11px] uppercase tracking-wider font-semibold mt-5 mb-2"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  이런 곳은 어때요?
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {QUICK_LINKS.map(({ href, label, Icon }) => (
                    <button
                      key={href}
                      onClick={() => navigate(href)}
                      className="rounded-xl border-2 border-border hover:border-foreground/30 py-3 flex flex-col items-center gap-1 transition-colors"
                    >
                      <Icon className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                      <span className="text-xs font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </m.div>
    </div>
  )
}
