// 히라가나/가타카나 발음표 데이터

export interface KanaChar {
  hiragana: string
  katakana: string
  romaji: string
  korean: string
}

// 기본 50음도 (Gojūon)
export const BASIC_KANA: KanaChar[][] = [
  // あ행 (a-row)
  [
    { hiragana: 'あ', katakana: 'ア', romaji: 'a', korean: '아' },
    { hiragana: 'い', katakana: 'イ', romaji: 'i', korean: '이' },
    { hiragana: 'う', katakana: 'ウ', romaji: 'u', korean: '우' },
    { hiragana: 'え', katakana: 'エ', romaji: 'e', korean: '에' },
    { hiragana: 'お', katakana: 'オ', romaji: 'o', korean: '오' },
  ],
  // か행 (ka-row)
  [
    { hiragana: 'か', katakana: 'カ', romaji: 'ka', korean: '카' },
    { hiragana: 'き', katakana: 'キ', romaji: 'ki', korean: '키' },
    { hiragana: 'く', katakana: 'ク', romaji: 'ku', korean: '쿠' },
    { hiragana: 'け', katakana: 'ケ', romaji: 'ke', korean: '케' },
    { hiragana: 'こ', katakana: 'コ', romaji: 'ko', korean: '코' },
  ],
  // さ행 (sa-row)
  [
    { hiragana: 'さ', katakana: 'サ', romaji: 'sa', korean: '사' },
    { hiragana: 'し', katakana: 'シ', romaji: 'shi', korean: '시' },
    { hiragana: 'す', katakana: 'ス', romaji: 'su', korean: '스' },
    { hiragana: 'せ', katakana: 'セ', romaji: 'se', korean: '세' },
    { hiragana: 'そ', katakana: 'ソ', romaji: 'so', korean: '소' },
  ],
  // た행 (ta-row)
  [
    { hiragana: 'た', katakana: 'タ', romaji: 'ta', korean: '타' },
    { hiragana: 'ち', katakana: 'チ', romaji: 'chi', korean: '치' },
    { hiragana: 'つ', katakana: 'ツ', romaji: 'tsu', korean: '츠' },
    { hiragana: 'て', katakana: 'テ', romaji: 'te', korean: '테' },
    { hiragana: 'と', katakana: 'ト', romaji: 'to', korean: '토' },
  ],
  // な행 (na-row)
  [
    { hiragana: 'な', katakana: 'ナ', romaji: 'na', korean: '나' },
    { hiragana: 'に', katakana: 'ニ', romaji: 'ni', korean: '니' },
    { hiragana: 'ぬ', katakana: 'ヌ', romaji: 'nu', korean: '누' },
    { hiragana: 'ね', katakana: 'ネ', romaji: 'ne', korean: '네' },
    { hiragana: 'の', katakana: 'ノ', romaji: 'no', korean: '노' },
  ],
  // は행 (ha-row)
  [
    { hiragana: 'は', katakana: 'ハ', romaji: 'ha', korean: '하' },
    { hiragana: 'ひ', katakana: 'ヒ', romaji: 'hi', korean: '히' },
    { hiragana: 'ふ', katakana: 'フ', romaji: 'fu', korean: '후' },
    { hiragana: 'へ', katakana: 'ヘ', romaji: 'he', korean: '헤' },
    { hiragana: 'ほ', katakana: 'ホ', romaji: 'ho', korean: '호' },
  ],
  // ま행 (ma-row)
  [
    { hiragana: 'ま', katakana: 'マ', romaji: 'ma', korean: '마' },
    { hiragana: 'み', katakana: 'ミ', romaji: 'mi', korean: '미' },
    { hiragana: 'む', katakana: 'ム', romaji: 'mu', korean: '무' },
    { hiragana: 'め', katakana: 'メ', romaji: 'me', korean: '메' },
    { hiragana: 'も', katakana: 'モ', romaji: 'mo', korean: '모' },
  ],
  // や행 (ya-row)
  [
    { hiragana: 'や', katakana: 'ヤ', romaji: 'ya', korean: '야' },
    { hiragana: '', katakana: '', romaji: '', korean: '' },
    { hiragana: 'ゆ', katakana: 'ユ', romaji: 'yu', korean: '유' },
    { hiragana: '', katakana: '', romaji: '', korean: '' },
    { hiragana: 'よ', katakana: 'ヨ', romaji: 'yo', korean: '요' },
  ],
  // ら행 (ra-row)
  [
    { hiragana: 'ら', katakana: 'ラ', romaji: 'ra', korean: '라' },
    { hiragana: 'り', katakana: 'リ', romaji: 'ri', korean: '리' },
    { hiragana: 'る', katakana: 'ル', romaji: 'ru', korean: '루' },
    { hiragana: 'れ', katakana: 'レ', romaji: 're', korean: '레' },
    { hiragana: 'ろ', katakana: 'ロ', romaji: 'ro', korean: '로' },
  ],
  // わ행 (wa-row)
  [
    { hiragana: 'わ', katakana: 'ワ', romaji: 'wa', korean: '와' },
    { hiragana: '', katakana: '', romaji: '', korean: '' },
    { hiragana: '', katakana: '', romaji: '', korean: '' },
    { hiragana: '', katakana: '', romaji: '', korean: '' },
    { hiragana: 'を', katakana: 'ヲ', romaji: 'wo', korean: '오' },
  ],
  // ん (n)
  [
    { hiragana: 'ん', katakana: 'ン', romaji: 'n', korean: '응' },
    { hiragana: '', katakana: '', romaji: '', korean: '' },
    { hiragana: '', katakana: '', romaji: '', korean: '' },
    { hiragana: '', katakana: '', romaji: '', korean: '' },
    { hiragana: '', katakana: '', romaji: '', korean: '' },
  ],
]

// 탁음 (Dakuon)
export const DAKUON_KANA: KanaChar[][] = [
  // が행 (ga-row)
  [
    { hiragana: 'が', katakana: 'ガ', romaji: 'ga', korean: '가' },
    { hiragana: 'ぎ', katakana: 'ギ', romaji: 'gi', korean: '기' },
    { hiragana: 'ぐ', katakana: 'グ', romaji: 'gu', korean: '구' },
    { hiragana: 'げ', katakana: 'ゲ', romaji: 'ge', korean: '게' },
    { hiragana: 'ご', katakana: 'ゴ', romaji: 'go', korean: '고' },
  ],
  // ざ행 (za-row)
  [
    { hiragana: 'ざ', katakana: 'ザ', romaji: 'za', korean: '자' },
    { hiragana: 'じ', katakana: 'ジ', romaji: 'ji', korean: '지' },
    { hiragana: 'ず', katakana: 'ズ', romaji: 'zu', korean: '즈' },
    { hiragana: 'ぜ', katakana: 'ゼ', romaji: 'ze', korean: '제' },
    { hiragana: 'ぞ', katakana: 'ゾ', romaji: 'zo', korean: '조' },
  ],
  // だ행 (da-row)
  [
    { hiragana: 'だ', katakana: 'ダ', romaji: 'da', korean: '다' },
    { hiragana: 'ぢ', katakana: 'ヂ', romaji: 'ji', korean: '지' },
    { hiragana: 'づ', katakana: 'ヅ', romaji: 'zu', korean: '즈' },
    { hiragana: 'で', katakana: 'デ', romaji: 'de', korean: '데' },
    { hiragana: 'ど', katakana: 'ド', romaji: 'do', korean: '도' },
  ],
  // ば행 (ba-row)
  [
    { hiragana: 'ば', katakana: 'バ', romaji: 'ba', korean: '바' },
    { hiragana: 'び', katakana: 'ビ', romaji: 'bi', korean: '비' },
    { hiragana: 'ぶ', katakana: 'ブ', romaji: 'bu', korean: '부' },
    { hiragana: 'べ', katakana: 'ベ', romaji: 'be', korean: '베' },
    { hiragana: 'ぼ', katakana: 'ボ', romaji: 'bo', korean: '보' },
  ],
]

// 반탁음 (Handakuon)
export const HANDAKUON_KANA: KanaChar[][] = [
  // ぱ행 (pa-row)
  [
    { hiragana: 'ぱ', katakana: 'パ', romaji: 'pa', korean: '파' },
    { hiragana: 'ぴ', katakana: 'ピ', romaji: 'pi', korean: '피' },
    { hiragana: 'ぷ', katakana: 'プ', romaji: 'pu', korean: '푸' },
    { hiragana: 'ぺ', katakana: 'ペ', romaji: 'pe', korean: '페' },
    { hiragana: 'ぽ', katakana: 'ポ', romaji: 'po', korean: '포' },
  ],
]

// 열 헤더
export const COLUMN_HEADERS = ['あ단', 'い단', 'う단', 'え단', 'お단']
export const COLUMN_HEADERS_KATAKANA = ['ア단', 'イ단', 'ウ단', 'エ단', 'オ단']

// 행 헤더
export const ROW_HEADERS = [
  'あ행', 'か행', 'さ행', 'た행', 'な행',
  'は행', 'ま행', 'や행', 'ら행', 'わ행', 'ん',
]
export const ROW_HEADERS_KATAKANA = [
  'ア행', 'カ행', 'サ행', 'タ행', 'ナ행',
  'ハ행', 'マ행', 'ヤ행', 'ラ행', 'ワ행', 'ン',
]

export const DAKUON_ROW_HEADERS = ['が행', 'ざ행', 'だ행', 'ば행']
export const HANDAKUON_ROW_HEADERS = ['ぱ행']
