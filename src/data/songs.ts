// 동요/민요 데이터 (모두 public domain)
// 출처:
//   - Warabe uta (わらべうた): 전통 어린이 놀이노래, 저작권 만료
//   - Meiji/Taisho era 동요: 1923년 이전 출판물, public domain
//   - 民謡 (민요): 전통 민속 노래
// 한국어 번역은 학습용 자작

export interface SongVerse {
  ja: string        // 일본어 가사
  reading: string   // 후리가나 (띄어쓰기로 단어 분리)
  ko: string        // 한국어 번역
}

export type SongEra = 'warabe' | 'meiji' | 'minyo'

export interface Song {
  id: string
  title: string
  titleKo: string
  era: SongEra
  year?: number          // 발표/채록 연도 (대략)
  description: string    // 한국어 배경 설명 (1-2문장)
  verses: SongVerse[]
  wikiUrl?: string       // 위키피디아 (해당 곡 더 알기)
}

export const SONG_ERAS: Record<SongEra, { label: string; sublabel: string }> = {
  warabe: { label: 'わらべ歌', sublabel: '전통 어린이 놀이노래' },
  meiji: { label: '明治・大正', sublabel: '메이지·다이쇼 시대 동요' },
  minyo: { label: '民謡', sublabel: '민요' },
}

const BASE_SONGS: Song[] = [
  // ─── わらべ歌 ──────────────────────────────────────
  {
    id: 'kagome',
    title: 'かごめかごめ',
    titleKo: '카고메 카고메',
    era: 'warabe',
    description:
      '둥글게 손을 잡고 부르는 놀이노래. 가사의 의미가 모호해 다양한 해석이 있어 일본에서 가장 유명한 わらべうた 중 하나.',
    wikiUrl: 'https://ja.wikipedia.org/wiki/%E3%81%8B%E3%81%94%E3%82%81%E3%81%8B%E3%81%94%E3%82%81',
    verses: [
      {
        ja: 'かごめ かごめ 籠の中の 鳥は',
        reading: 'かごめ かごめ かごのなかの とりは',
        ko: '카고메 카고메 바구니 속의 새는',
      },
      {
        ja: 'いついつ 出やる 夜明けの晩に',
        reading: 'いついつ でやる よあけの ばんに',
        ko: '언제 언제 나오나 새벽이 오기 직전에',
      },
      {
        ja: '鶴と亀が 滑った',
        reading: 'つると かめが すべった',
        ko: '학과 거북이가 미끄러졌네',
      },
      {
        ja: '後ろの正面 だあれ',
        reading: 'うしろの しょうめん だあれ',
        ko: '뒤쪽 정면은 누구일까',
      },
    ],
  },
  {
    id: 'antagata',
    title: 'あんたがたどこさ',
    titleKo: '당신은 어디서 왔어요',
    era: 'warabe',
    description:
      '공을 튕기며 부르는 놀이노래. 구마모토(熊本) 지방의 「센바산(船場山)」을 소재로 한 채록 가사.',
    wikiUrl: 'https://ja.wikipedia.org/wiki/%E3%81%82%E3%82%93%E3%81%9F%E3%81%8C%E3%81%9F%E3%81%A9%E3%81%93%E3%81%95',
    verses: [
      {
        ja: 'あんたがた どこさ 肥後さ',
        reading: 'あんたがた どこさ ひごさ',
        ko: '당신은 어디 사람? 히고 사람',
      },
      {
        ja: '肥後どこさ 熊本さ',
        reading: 'ひご どこさ くまもとさ',
        ko: '히고 어디? 구마모토',
      },
      {
        ja: '熊本どこさ 船場さ',
        reading: 'くまもと どこさ せんばさ',
        ko: '구마모토 어디? 센바',
      },
      {
        ja: '船場山には 狸がおってさ',
        reading: 'せんばやまには たぬきが おってさ',
        ko: '센바산에는 너구리가 있어서',
      },
      {
        ja: 'それを猟師が 鉄砲で 撃ってさ',
        reading: 'それを りょうしが てっぽうで うってさ',
        ko: '그걸 사냥꾼이 총으로 쏴서',
      },
    ],
  },

  // ─── 明治・大正 ────────────────────────────────────
  {
    id: 'haru-ga-kita',
    title: '春が来た',
    titleKo: '봄이 왔다',
    era: 'meiji',
    year: 1910,
    description:
      '1910년 발표된 일본의 대표적 봄 노래. 짧고 간결한 가사로 일본의 초등학교 음악 교과서 단골 곡.',
    wikiUrl: 'https://ja.wikipedia.org/wiki/%E6%98%A5%E3%81%8C%E6%9D%A5%E3%81%9F',
    verses: [
      {
        ja: '春が来た 春が来た どこに来た',
        reading: 'はるが きた はるが きた どこに きた',
        ko: '봄이 왔다 봄이 왔다 어디로 왔나',
      },
      {
        ja: '山に来た 里に来た 野にも来た',
        reading: 'やまに きた さとに きた のにも きた',
        ko: '산에 왔다 마을에 왔다 들에도 왔다',
      },
      {
        ja: '花が咲く 花が咲く どこに咲く',
        reading: 'はなが さく はなが さく どこに さく',
        ko: '꽃이 핀다 꽃이 핀다 어디에 피나',
      },
      {
        ja: '山に咲く 里に咲く 野にも咲く',
        reading: 'やまに さく さとに さく のにも さく',
        ko: '산에 핀다 마을에 핀다 들에도 핀다',
      },
    ],
  },
  {
    id: 'furusato',
    title: 'ふるさと',
    titleKo: '고향',
    era: 'meiji',
    year: 1914,
    description:
      '1914년 高野辰之 작사. 일본인이 가장 사랑하는 고향 노래. 도시로 떠난 이가 어린 시절 산천을 그리워하는 정서.',
    wikiUrl: 'https://ja.wikipedia.org/wiki/%E6%95%85%E9%83%B7_(%E5%94%B1%E6%AD%8C)',
    verses: [
      {
        ja: '兎追いし かの山',
        reading: 'うさぎ おいし かのやま',
        ko: '토끼를 쫓던 저 산',
      },
      {
        ja: '小鮒釣りし かの川',
        reading: 'こぶな つりし かのかわ',
        ko: '작은 붕어를 낚던 저 강',
      },
      {
        ja: '夢は今も めぐりて',
        reading: 'ゆめは いまも めぐりて',
        ko: '꿈은 지금도 맴돌아',
      },
      {
        ja: '忘れがたき ふるさと',
        reading: 'わすれがたき ふるさと',
        ko: '잊을 수 없는 고향',
      },
    ],
  },
  {
    id: 'momiji',
    title: '紅葉',
    titleKo: '단풍',
    era: 'meiji',
    year: 1911,
    description:
      '1911년 발표. 가을 단풍을 묘사한 대표 동요. 일본의 가을 풍경을 가장 잘 담은 곡으로 평가됨.',
    wikiUrl: 'https://ja.wikipedia.org/wiki/%E7%B4%85%E8%91%89_(%E5%94%B1%E6%AD%8C)',
    verses: [
      {
        ja: '秋の夕日に 照る山紅葉',
        reading: 'あきの ゆうひに てる やまもみじ',
        ko: '가을 석양에 빛나는 산 단풍',
      },
      {
        ja: '濃いも薄いも 数ある中に',
        reading: 'こいも うすいも かずある なかに',
        ko: '진한 것도 옅은 것도 수많은 빛깔 속에',
      },
      {
        ja: '松をいろどる 楓や蔦は',
        reading: 'まつを いろどる かえでや つたは',
        ko: '소나무를 물들이는 단풍과 담쟁이는',
      },
      {
        ja: '山のふもとの 裾模様',
        reading: 'やまの ふもとの すそもよう',
        ko: '산기슭의 옷자락 무늬',
      },
    ],
  },

  // ─── 民謡 ─────────────────────────────────────────
  {
    id: 'sakura',
    title: 'さくら さくら',
    titleKo: '벚꽃 벚꽃',
    era: 'minyo',
    description:
      '에도 시대 말기에 채록된 거문고 연습곡이 기원. 메이지 시대에 학교 음악 교본에 채택되어 일본을 대표하는 민요로 자리잡음.',
    wikiUrl: 'https://ja.wikipedia.org/wiki/%E3%81%95%E3%81%8F%E3%82%89%E3%81%95%E3%81%8F%E3%82%89',
    verses: [
      {
        ja: 'さくら さくら',
        reading: 'さくら さくら',
        ko: '벚꽃이여 벚꽃이여',
      },
      {
        ja: '野山も里も 見渡す限り',
        reading: 'のやまも さとも みわたす かぎり',
        ko: '들과 산도 마을도 보이는 한',
      },
      {
        ja: '霞か雲か 朝日に匂う',
        reading: 'かすみか くもか あさひに におう',
        ko: '안개인지 구름인지 아침해에 풍기네',
      },
      {
        ja: 'さくら さくら 花ざかり',
        reading: 'さくら さくら はなざかり',
        ko: '벚꽃이여 벚꽃이여 만개한 꽃',
      },
    ],
  },
  {
    id: 'ooki-na-furudokei',
    title: '大きな古時計',
    titleKo: '커다란 낡은 시계',
    era: 'meiji',
    year: 1876,
    description:
      '미국 민요 "My Grandfather\'s Clock"(1876)를 일본어로 옮긴 곡. 일본에서는 어린이부터 어른까지 모두가 아는 국민 동요.',
    wikiUrl: 'https://ja.wikipedia.org/wiki/%E5%A4%A7%E3%81%8D%E3%81%AA%E5%8F%A4%E6%99%82%E8%A8%88',
    verses: [
      {
        ja: '大きな のっぽの 古時計',
        reading: 'おおきな のっぽの ふるどけい',
        ko: '커다랗고 키 큰 낡은 시계',
      },
      {
        ja: 'おじいさんの 時計',
        reading: 'おじいさんの とけい',
        ko: '할아버지의 시계',
      },
      {
        ja: '百年いつも 動いていた',
        reading: 'ひゃくねん いつも うごいていた',
        ko: '백 년 동안 늘 움직였지',
      },
      {
        ja: 'ご自慢の 時計さ',
        reading: 'ごじまんの とけいさ',
        ko: '자랑스러운 시계라네',
      },
    ],
  },
  {
    id: 'donguri',
    title: 'どんぐりころころ',
    titleKo: '도토리 데굴데굴',
    era: 'meiji',
    year: 1921,
    description:
      '1921년 발표된 동요. 도토리가 연못에 빠진 이야기로, 일본 어린이가 가장 먼저 배우는 노래 중 하나.',
    wikiUrl: 'https://ja.wikipedia.org/wiki/%E3%81%A9%E3%82%93%E3%81%90%E3%82%8A%E3%81%93%E3%82%8D%E3%81%93%E3%82%8D',
    verses: [
      {
        ja: 'どんぐり ころころ どんぶりこ',
        reading: 'どんぐり ころころ どんぶりこ',
        ko: '도토리 데굴데굴 퐁당',
      },
      {
        ja: 'お池に はまって さあ大変',
        reading: 'おいけに はまって さあたいへん',
        ko: '연못에 빠져서 어이쿠 큰일',
      },
      {
        ja: 'どじょうが 出て来て 今日は',
        reading: 'どじょうが でてきて こんにちは',
        ko: '미꾸라지가 나와서 안녕하세요',
      },
      {
        ja: '坊ちゃん 一緒に 遊びましょう',
        reading: 'ぼっちゃん いっしょに あそびましょう',
        ko: '도련님 함께 놀아요',
      },
    ],
  },
]

import { EXTRA_SONGS } from './songs-ext'

// base 8 + ext 5 = 총 13곡
export const SONGS: Song[] = [...BASE_SONGS, ...EXTRA_SONGS]

export function getSongById(id: string): Song | undefined {
  return SONGS.find((s) => s.id === id)
}

export function getSongsByEra(era: 'all' | SongEra): Song[] {
  if (era === 'all') return SONGS
  return SONGS.filter((s) => s.era === era)
}
