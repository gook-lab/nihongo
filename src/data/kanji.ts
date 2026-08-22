// 한자 메타 데이터 — JLPT N5 핵심 한자의 음독/훈독/획수/부수
// `buildKanjiList()` (WORDS에서 자동 추출)와 결합해서 카드에 표시
//
// 데이터 소스: 일반 JLPT 한자 표 + 표준 음훈독.
// 첫 릴리즈는 N5에 집중 (40자). N4/N3는 추후 확장.

export interface KanjiMeta {
  kanji: string
  onyomi: string[]     // 음독 (가타카나 표기, 한어 유래)
  kunyomi: string[]    // 훈독 (히라가나 표기, 일본 고유)
  meaning: string      // 한국어 뜻
  strokes: number      // 획수
  level: 'N5' | 'N4' | 'N3'
  radical?: string     // 대표 부수 (선택)
}

export const KANJI_META: Record<string, KanjiMeta> = {
  // 숫자
  '一': { kanji: '一', onyomi: ['イチ', 'イツ'], kunyomi: ['ひと'], meaning: '하나', strokes: 1, level: 'N5', radical: '一' },
  '二': { kanji: '二', onyomi: ['ニ'], kunyomi: ['ふた'], meaning: '둘', strokes: 2, level: 'N5', radical: '二' },
  '三': { kanji: '三', onyomi: ['サン'], kunyomi: ['みっ'], meaning: '셋', strokes: 3, level: 'N5', radical: '一' },
  '四': { kanji: '四', onyomi: ['シ'], kunyomi: ['よん', 'よっ'], meaning: '넷', strokes: 5, level: 'N5', radical: '囗' },
  '五': { kanji: '五', onyomi: ['ゴ'], kunyomi: ['いつ'], meaning: '다섯', strokes: 4, level: 'N5', radical: '二' },
  '六': { kanji: '六', onyomi: ['ロク'], kunyomi: ['むっ'], meaning: '여섯', strokes: 4, level: 'N5', radical: '八' },
  '七': { kanji: '七', onyomi: ['シチ'], kunyomi: ['なな'], meaning: '일곱', strokes: 2, level: 'N5', radical: '一' },
  '八': { kanji: '八', onyomi: ['ハチ'], kunyomi: ['やっ'], meaning: '여덟', strokes: 2, level: 'N5', radical: '八' },
  '九': { kanji: '九', onyomi: ['キュウ', 'ク'], kunyomi: ['ここの'], meaning: '아홉', strokes: 2, level: 'N5', radical: '乙' },
  '十': { kanji: '十', onyomi: ['ジュウ'], kunyomi: ['とお'], meaning: '열', strokes: 2, level: 'N5', radical: '十' },
  '百': { kanji: '百', onyomi: ['ヒャク'], kunyomi: [], meaning: '백', strokes: 6, level: 'N5', radical: '白' },
  '千': { kanji: '千', onyomi: ['セン'], kunyomi: ['ち'], meaning: '천', strokes: 3, level: 'N5', radical: '十' },
  '万': { kanji: '万', onyomi: ['マン', 'バン'], kunyomi: [], meaning: '만', strokes: 3, level: 'N5', radical: '一' },

  // 시간
  '円': { kanji: '円', onyomi: ['エン'], kunyomi: ['まる'], meaning: '엔, 원', strokes: 4, level: 'N5', radical: '冂' },
  '時': { kanji: '時', onyomi: ['ジ'], kunyomi: ['とき'], meaning: '시간, 때', strokes: 10, level: 'N5', radical: '日' },
  '分': { kanji: '分', onyomi: ['ブン', 'フン', 'プン'], kunyomi: ['わ'], meaning: '분, 나누다', strokes: 4, level: 'N5', radical: '刀' },
  '日': { kanji: '日', onyomi: ['ニチ', 'ジツ'], kunyomi: ['ひ', 'か'], meaning: '날, 해', strokes: 4, level: 'N5', radical: '日' },
  '月': { kanji: '月', onyomi: ['ゲツ', 'ガツ'], kunyomi: ['つき'], meaning: '달, 월', strokes: 4, level: 'N5', radical: '月' },
  '年': { kanji: '年', onyomi: ['ネン'], kunyomi: ['とし'], meaning: '해, 년', strokes: 6, level: 'N5', radical: '干' },

  // 자연·요일
  '火': { kanji: '火', onyomi: ['カ'], kunyomi: ['ひ'], meaning: '불', strokes: 4, level: 'N5', radical: '火' },
  '水': { kanji: '水', onyomi: ['スイ'], kunyomi: ['みず'], meaning: '물', strokes: 4, level: 'N5', radical: '水' },
  '木': { kanji: '木', onyomi: ['モク', 'ボク'], kunyomi: ['き'], meaning: '나무', strokes: 4, level: 'N5', radical: '木' },
  '金': { kanji: '金', onyomi: ['キン', 'コン'], kunyomi: ['かね'], meaning: '돈, 금', strokes: 8, level: 'N5', radical: '金' },
  '土': { kanji: '土', onyomi: ['ド', 'ト'], kunyomi: ['つち'], meaning: '흙, 땅', strokes: 3, level: 'N5', radical: '土' },
  '山': { kanji: '山', onyomi: ['サン'], kunyomi: ['やま'], meaning: '산', strokes: 3, level: 'N5', radical: '山' },
  '川': { kanji: '川', onyomi: ['セン'], kunyomi: ['かわ'], meaning: '강', strokes: 3, level: 'N5', radical: '川' },
  '田': { kanji: '田', onyomi: ['デン'], kunyomi: ['た'], meaning: '논, 밭', strokes: 5, level: 'N5', radical: '田' },
  '雨': { kanji: '雨', onyomi: ['ウ'], kunyomi: ['あめ'], meaning: '비', strokes: 8, level: 'N5', radical: '雨' },
  '天': { kanji: '天', onyomi: ['テン'], kunyomi: ['あめ'], meaning: '하늘', strokes: 4, level: 'N5', radical: '大' },
  '空': { kanji: '空', onyomi: ['クウ'], kunyomi: ['そら', 'あ'], meaning: '하늘, 비다', strokes: 8, level: 'N5', radical: '穴' },

  // 방향·위치
  '上': { kanji: '上', onyomi: ['ジョウ'], kunyomi: ['うえ', 'あ', 'のぼ'], meaning: '위', strokes: 3, level: 'N5', radical: '一' },
  '下': { kanji: '下', onyomi: ['カ', 'ゲ'], kunyomi: ['した', 'さ', 'お'], meaning: '아래', strokes: 3, level: 'N5', radical: '一' },
  '左': { kanji: '左', onyomi: ['サ'], kunyomi: ['ひだり'], meaning: '왼쪽', strokes: 5, level: 'N5', radical: '工' },
  '右': { kanji: '右', onyomi: ['ウ', 'ユウ'], kunyomi: ['みぎ'], meaning: '오른쪽', strokes: 5, level: 'N5', radical: '口' },
  '中': { kanji: '中', onyomi: ['チュウ'], kunyomi: ['なか'], meaning: '가운데', strokes: 4, level: 'N5', radical: '丨' },

  // 크기·사람
  '大': { kanji: '大', onyomi: ['ダイ', 'タイ'], kunyomi: ['おお'], meaning: '크다', strokes: 3, level: 'N5', radical: '大' },
  '小': { kanji: '小', onyomi: ['ショウ'], kunyomi: ['ちい', 'こ'], meaning: '작다', strokes: 3, level: 'N5', radical: '小' },
  '人': { kanji: '人', onyomi: ['ジン', 'ニン'], kunyomi: ['ひと'], meaning: '사람', strokes: 2, level: 'N5', radical: '人' },
  '男': { kanji: '男', onyomi: ['ダン', 'ナン'], kunyomi: ['おとこ'], meaning: '남자', strokes: 7, level: 'N5', radical: '田' },
  '女': { kanji: '女', onyomi: ['ジョ', 'ニョ'], kunyomi: ['おんな'], meaning: '여자', strokes: 3, level: 'N5', radical: '女' },
  '子': { kanji: '子', onyomi: ['シ'], kunyomi: ['こ'], meaning: '아이', strokes: 3, level: 'N5', radical: '子' },

  // 학교
  '学': { kanji: '学', onyomi: ['ガク'], kunyomi: ['まな'], meaning: '배우다, 학문', strokes: 8, level: 'N5', radical: '子' },
  '校': { kanji: '校', onyomi: ['コウ'], kunyomi: [], meaning: '학교', strokes: 10, level: 'N5', radical: '木' },
  '生': { kanji: '生', onyomi: ['セイ', 'ショウ'], kunyomi: ['い', 'う', 'なま'], meaning: '나다, 살다, 학생', strokes: 5, level: 'N5', radical: '生' },
  '先': { kanji: '先', onyomi: ['セン'], kunyomi: ['さき'], meaning: '먼저, 앞', strokes: 6, level: 'N5', radical: '儿' },

  // 동사 (자주 나오는 N5 한자)
  '行': { kanji: '行', onyomi: ['コウ', 'ギョウ'], kunyomi: ['い', 'おこな'], meaning: '가다, 행하다', strokes: 6, level: 'N5', radical: '行' },
  '来': { kanji: '来', onyomi: ['ライ'], kunyomi: ['く', 'き'], meaning: '오다', strokes: 7, level: 'N5', radical: '木' },
  '見': { kanji: '見', onyomi: ['ケン'], kunyomi: ['み'], meaning: '보다', strokes: 7, level: 'N5', radical: '見' },
  '聞': { kanji: '聞', onyomi: ['ブン', 'モン'], kunyomi: ['き'], meaning: '듣다, 묻다', strokes: 14, level: 'N5', radical: '耳' },
  '食': { kanji: '食', onyomi: ['ショク'], kunyomi: ['た', 'く'], meaning: '먹다', strokes: 9, level: 'N5', radical: '食' },
  '飲': { kanji: '飲', onyomi: ['イン'], kunyomi: ['の'], meaning: '마시다', strokes: 12, level: 'N5', radical: '食' },
  '読': { kanji: '読', onyomi: ['ドク'], kunyomi: ['よ'], meaning: '읽다', strokes: 14, level: 'N5', radical: '言' },
  '書': { kanji: '書', onyomi: ['ショ'], kunyomi: ['か'], meaning: '쓰다, 책', strokes: 10, level: 'N5', radical: '曰' },
  '話': { kanji: '話', onyomi: ['ワ'], kunyomi: ['はな', 'はなし'], meaning: '말하다', strokes: 13, level: 'N5', radical: '言' },
  '言': { kanji: '言', onyomi: ['ゲン', 'ゴン'], kunyomi: ['い', 'こと'], meaning: '말, 말하다', strokes: 7, level: 'N5', radical: '言' },
  '買': { kanji: '買', onyomi: ['バイ'], kunyomi: ['か'], meaning: '사다', strokes: 12, level: 'N5', radical: '貝' },
  '出': { kanji: '出', onyomi: ['シュツ'], kunyomi: ['で', 'だ'], meaning: '나가다, 내다', strokes: 5, level: 'N5', radical: '凵' },
  '入': { kanji: '入', onyomi: ['ニュウ'], kunyomi: ['い', 'はい'], meaning: '들어가다', strokes: 2, level: 'N5', radical: '入' },

  // 가족
  '父': { kanji: '父', onyomi: ['フ'], kunyomi: ['ちち'], meaning: '아버지', strokes: 4, level: 'N5', radical: '父' },
  '母': { kanji: '母', onyomi: ['ボ'], kunyomi: ['はは'], meaning: '어머니', strokes: 5, level: 'N5', radical: '毋' },

  // 기타 자주 쓰는 N5
  '本': { kanji: '本', onyomi: ['ホン'], kunyomi: ['もと'], meaning: '책, 본래', strokes: 5, level: 'N5', radical: '木' },
  '名': { kanji: '名', onyomi: ['メイ', 'ミョウ'], kunyomi: ['な'], meaning: '이름', strokes: 6, level: 'N5', radical: '口' },
  '何': { kanji: '何', onyomi: ['カ'], kunyomi: ['なに', 'なん'], meaning: '무엇', strokes: 7, level: 'N5', radical: '人' },
  '車': { kanji: '車', onyomi: ['シャ'], kunyomi: ['くるま'], meaning: '차, 수레', strokes: 7, level: 'N5', radical: '車' },
  '駅': { kanji: '駅', onyomi: ['エキ'], kunyomi: [], meaning: '역', strokes: 14, level: 'N5', radical: '馬' },
  '国': { kanji: '国', onyomi: ['コク'], kunyomi: ['くに'], meaning: '나라', strokes: 8, level: 'N5', radical: '囗' },
  '語': { kanji: '語', onyomi: ['ゴ'], kunyomi: ['かた'], meaning: '말, 언어', strokes: 14, level: 'N5', radical: '言' },
  '電': { kanji: '電', onyomi: ['デン'], kunyomi: [], meaning: '전기', strokes: 13, level: 'N5', radical: '雨' },
  '気': { kanji: '気', onyomi: ['キ', 'ケ'], kunyomi: [], meaning: '기운, 기분', strokes: 6, level: 'N5', radical: '气' },
  '友': { kanji: '友', onyomi: ['ユウ'], kunyomi: ['とも'], meaning: '친구', strokes: 4, level: 'N5', radical: '又' },
}

export function getKanjiMeta(kanji: string): KanjiMeta | undefined {
  return KANJI_META[kanji]
}

// KanjiVG SVG URL — codepoint 5자리 16진수
// 예: '一' (U+4E00) → '04e00.svg'
export function getKanjiVgUrl(kanji: string): string | null {
  const cp = kanji.codePointAt(0)
  if (!cp) return null
  const hex = cp.toString(16).padStart(5, '0')
  return `https://cdn.jsdelivr.net/gh/KanjiVG/kanjivg/kanji/${hex}.svg`
}
