// 마스코트 7종 — 레벨별 해금 시스템.
// Lv.1 코타로 기본 / Lv.2~7 순차 해금.
// 이미지 없는 마스코트는 emoji fallback (사용자가 추후 PNG 추가 시 image 경로만 지정하면 자동 사용).
import kotaroImg from '@/assets/mascots/kotaro.webp'
import yukiImg from '@/assets/mascots/yuki.webp'
import soraImg from '@/assets/mascots/sora.webp'
import haruImg from '@/assets/mascots/haru.webp'
import kamoImg from '@/assets/mascots/kamo.webp'
import usaImg from '@/assets/mascots/usa.webp'
import meriImg from '@/assets/mascots/meri.webp'
import type { Mascot } from '@/types'

export const MASCOTS: Mascot[] = [
  {
    id: 'kotaro',
    name: 'コタロウ',
    nameKr: '코타로',
    image: kotaroImg,
    unlockLevel: 1,
    description: '에너지 넘치는 첫 친구. 시바견.',
  },
  {
    id: 'yuki',
    name: 'ユキ',
    nameKr: '유키',
    image: yukiImg,
    unlockLevel: 2,
    description: '차분한 길잡이. 북극여우.',
  },
  {
    id: 'sora',
    name: 'ソラ',
    nameKr: '소라',
    image: soraImg,
    unlockLevel: 3,
    description: '재치있는 동반자. 고양이.',
  },
  {
    id: 'haru',
    name: 'ハル',
    nameKr: '하루',
    image: haruImg,
    unlockLevel: 4,
    description: '슬기로운 달빛 늑대.',
  },
  {
    id: 'kamo',
    name: 'カモ',
    nameKr: '카모',
    image: kamoImg,
    unlockLevel: 5,
    description: '활기 가득한 말하기 파트너.',
  },
  {
    id: 'usa',
    name: 'ウサ',
    nameKr: '우사',
    image: usaImg,
    unlockLevel: 6,
    description: '따뜻한 응원단장 토끼.',
  },
  {
    id: 'meri',
    name: 'メリー',
    nameKr: '메리',
    image: meriImg,
    unlockLevel: 7,
    description: '온유한 현자. 양.',
  },
]

// 기본 마스코트 ID
export const DEFAULT_MASCOT_ID = 'kotaro'

// 해금 여부
export function isMascotUnlocked(mascot: Mascot, userLevel: number): boolean {
  return userLevel >= mascot.unlockLevel
}

// 특정 레벨에서 새로 해금되는 마스코트 (레벨업 알림용)
export function newlyUnlockedAt(level: number): Mascot | undefined {
  return MASCOTS.find((m) => m.unlockLevel === level)
}
