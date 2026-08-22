// 독해(읽기) 콘텐츠 데이터
// 출처:
//   - Tatoeba Project (CC BY 2.0 FR) https://tatoeba.org/
//   - Aozora Bunko (Public Domain - 저작권 만료 작품) https://www.aozora.gr.jp/
//   - 일부는 학습 목적 큐레이션 (자작)

export interface ReadingParagraph {
  ja: string        // 일본어 원문
  reading: string   // 후리가나 (띄어쓰기로 단어 분리)
  ko: string        // 한국어 번역
}

export interface ReadingVocabulary {
  kanji: string
  reading: string
  meaning: string
}

export type ReadingSource = 'tatoeba' | 'aozora' | 'curated' | 'ai'

export interface ReadingPiece {
  id: string
  title: string
  titleKo: string
  level: 'N5' | 'N4' | 'N3'
  source: ReadingSource
  sourceLabel: string         // UI 노출용 짧은 라벨 (예: "Tatoeba", "夏目漱石「坊っちゃん」")
  sourceUrl?: string
  estimatedMinutes: number    // 예상 읽기 시간 (분)
  description: string         // 1줄 미리보기
  paragraphs: ReadingParagraph[]
  vocabulary: ReadingVocabulary[]
}

const BASE_READING_PIECES: ReadingPiece[] = [
  // ─── N5 (4개) ─────────────────────────────────────────
  {
    id: 'n5-daily-morning',
    title: '朝のじかん',
    titleKo: '아침의 시간',
    level: 'N5',
    source: 'curated',
    sourceLabel: '학습 큐레이션',
    estimatedMinutes: 1,
    description: '하루를 시작하는 아침의 짧은 일기',
    paragraphs: [
      {
        ja: '私は 毎朝 七時に 起きます。',
        reading: 'わたしは まいあさ しちじに おきます。',
        ko: '나는 매일 아침 7시에 일어납니다.',
      },
      {
        ja: 'まず 顔を 洗って、コーヒーを 飲みます。',
        reading: 'まず かおを あらって、コーヒーを のみます。',
        ko: '먼저 얼굴을 씻고, 커피를 마십니다.',
      },
      {
        ja: 'それから 新聞を 読みます。',
        reading: 'それから しんぶんを よみます。',
        ko: '그리고 신문을 읽습니다.',
      },
      {
        ja: '八時に 家を 出ます。',
        reading: 'はちじに いえを でます。',
        ko: '8시에 집을 나섭니다.',
      },
    ],
    vocabulary: [
      { kanji: '毎朝', reading: 'まいあさ', meaning: '매일 아침' },
      { kanji: '起きる', reading: 'おきる', meaning: '일어나다' },
      { kanji: '顔', reading: 'かお', meaning: '얼굴' },
      { kanji: '洗う', reading: 'あらう', meaning: '씻다' },
      { kanji: '新聞', reading: 'しんぶん', meaning: '신문' },
    ],
  },
  {
    id: 'n5-family',
    title: 'わたしの 家族',
    titleKo: '나의 가족',
    level: 'N5',
    source: 'curated',
    sourceLabel: '학습 큐레이션',
    estimatedMinutes: 1,
    description: '가족 구성원을 소개하는 글',
    paragraphs: [
      {
        ja: '私の 家族は 四人です。',
        reading: 'わたしの かぞくは よにんです。',
        ko: '우리 가족은 네 명입니다.',
      },
      {
        ja: '父と 母と 妹と 私です。',
        reading: 'ちちと ははと いもうとと わたしです。',
        ko: '아빠와 엄마와 여동생과 저입니다.',
      },
      {
        ja: '父は 会社員で、母は 先生です。',
        reading: 'ちちは かいしゃいんで、ははは せんせいです。',
        ko: '아빠는 회사원이고, 엄마는 선생님입니다.',
      },
      {
        ja: '妹は 学生で、犬が 大好きです。',
        reading: 'いもうとは がくせいで、いぬが だいすきです。',
        ko: '여동생은 학생이고, 강아지를 매우 좋아합니다.',
      },
    ],
    vocabulary: [
      { kanji: '家族', reading: 'かぞく', meaning: '가족' },
      { kanji: '父', reading: 'ちち', meaning: '아빠 (자신의)' },
      { kanji: '母', reading: 'はは', meaning: '엄마 (자신의)' },
      { kanji: '妹', reading: 'いもうと', meaning: '여동생' },
      { kanji: '会社員', reading: 'かいしゃいん', meaning: '회사원' },
      { kanji: '大好き', reading: 'だいすき', meaning: '매우 좋아함' },
    ],
  },
  {
    id: 'n5-cafe',
    title: 'カフェで',
    titleKo: '카페에서',
    level: 'N5',
    source: 'tatoeba',
    sourceLabel: 'Tatoeba (CC BY 2.0 FR)',
    sourceUrl: 'https://tatoeba.org/',
    estimatedMinutes: 1,
    description: 'Tatoeba 예문을 묶은 짧은 카페 대화',
    paragraphs: [
      {
        ja: 'すみません、コーヒーを 一つ ください。',
        reading: 'すみません、コーヒーを ひとつ ください。',
        ko: '실례합니다, 커피 하나 주세요.',
      },
      {
        ja: 'はい、すぐに お持ちします。',
        reading: 'はい、すぐに おもちします。',
        ko: '네, 곧 가져다 드리겠습니다.',
      },
      {
        ja: 'おいしいですね。ありがとうございます。',
        reading: 'おいしいですね。ありがとうございます。',
        ko: '맛있네요. 감사합니다.',
      },
    ],
    vocabulary: [
      { kanji: 'コーヒー', reading: 'こーひー', meaning: '커피' },
      { kanji: '一つ', reading: 'ひとつ', meaning: '하나' },
      { kanji: '持つ', reading: 'もつ', meaning: '들다, 가지다' },
    ],
  },
  {
    id: 'n5-weather-today',
    title: '今日の 天気',
    titleKo: '오늘의 날씨',
    level: 'N5',
    source: 'curated',
    sourceLabel: '학습 큐레이션',
    estimatedMinutes: 1,
    description: '날씨를 보고 하루 계획을 세우는 글',
    paragraphs: [
      {
        ja: '今日は とても いい 天気です。',
        reading: 'きょうは とても いい てんきです。',
        ko: '오늘은 정말 좋은 날씨입니다.',
      },
      {
        ja: '空は 青くて、風が すずしいです。',
        reading: 'そらは あおくて、かぜが すずしいです。',
        ko: '하늘은 푸르고, 바람이 시원합니다.',
      },
      {
        ja: '友だちと 公園で 遊びます。',
        reading: 'ともだちと こうえんで あそびます。',
        ko: '친구와 공원에서 놉니다.',
      },
    ],
    vocabulary: [
      { kanji: '天気', reading: 'てんき', meaning: '날씨' },
      { kanji: '空', reading: 'そら', meaning: '하늘' },
      { kanji: '青い', reading: 'あおい', meaning: '파랗다' },
      { kanji: '風', reading: 'かぜ', meaning: '바람' },
      { kanji: '涼しい', reading: 'すずしい', meaning: '시원하다' },
      { kanji: '公園', reading: 'こうえん', meaning: '공원' },
    ],
  },

  // ─── N4 (3개) ─────────────────────────────────────────
  {
    id: 'n4-train-station',
    title: '駅で 会った 人',
    titleKo: '역에서 만난 사람',
    level: 'N4',
    source: 'curated',
    sourceLabel: '학습 큐레이션',
    estimatedMinutes: 2,
    description: '우연한 만남에 관한 짧은 이야기',
    paragraphs: [
      {
        ja: '昨日、駅で 高校の 友だちに 会いました。',
        reading: 'きのう、えきで こうこうの ともだちに あいました。',
        ko: '어제, 역에서 고등학교 친구를 만났습니다.',
      },
      {
        ja: '五年ぶりだったので、最初は 分かりませんでした。',
        reading: 'ごねんぶりだったので、さいしょは わかりませんでした。',
        ko: '5년 만이라서, 처음에는 알아보지 못했습니다.',
      },
      {
        ja: '彼は 大学を 卒業して、今は 銀行で 働いています。',
        reading: 'かれは だいがくを そつぎょうして、いまは ぎんこうで はたらいています。',
        ko: '그는 대학을 졸업하고, 지금은 은행에서 일하고 있습니다.',
      },
      {
        ja: '今度 一緒に お酒を 飲む 約束を しました。',
        reading: 'こんど いっしょに おさけを のむ やくそくを しました。',
        ko: '다음에 함께 술을 마실 약속을 했습니다.',
      },
    ],
    vocabulary: [
      { kanji: '駅', reading: 'えき', meaning: '역' },
      { kanji: '高校', reading: 'こうこう', meaning: '고등학교' },
      { kanji: '〜ぶり', reading: '〜ぶり', meaning: '~만에' },
      { kanji: '卒業', reading: 'そつぎょう', meaning: '졸업' },
      { kanji: '銀行', reading: 'ぎんこう', meaning: '은행' },
      { kanji: '約束', reading: 'やくそく', meaning: '약속' },
    ],
  },
  {
    id: 'n4-cooking',
    title: '母の カレー',
    titleKo: '엄마의 카레',
    level: 'N4',
    source: 'curated',
    sourceLabel: '학습 큐레이션',
    estimatedMinutes: 2,
    description: '추억과 음식에 관한 짧은 에세이',
    paragraphs: [
      {
        ja: '子どもの 時、母が 作る カレーが 一番 好きでした。',
        reading: 'こどもの とき、ははが つくる カレーが いちばん すきでした。',
        ko: '어릴 적, 엄마가 만드는 카레가 가장 좋았습니다.',
      },
      {
        ja: '日曜日の 夜には、いつも カレーの においが 家の 中に 広がりました。',
        reading: 'にちようびの よるには、いつも カレーの においが いえの なかに ひろがりました。',
        ko: '일요일 밤에는, 항상 카레 냄새가 집 안에 퍼졌습니다.',
      },
      {
        ja: '私が 一人暮らしを 始めてから、母の カレーの 味が 恋しくなりました。',
        reading: 'わたしが ひとりぐらしを はじめてから、ははの カレーの あじが こいしくなりました。',
        ko: '내가 자취를 시작하고 나서, 엄마의 카레 맛이 그리워졌습니다.',
      },
    ],
    vocabulary: [
      { kanji: '作る', reading: 'つくる', meaning: '만들다' },
      { kanji: '一番', reading: 'いちばん', meaning: '가장, 제일' },
      { kanji: '匂い', reading: 'におい', meaning: '냄새' },
      { kanji: '広がる', reading: 'ひろがる', meaning: '퍼지다' },
      { kanji: '一人暮らし', reading: 'ひとりぐらし', meaning: '자취, 혼자 살기' },
      { kanji: '恋しい', reading: 'こいしい', meaning: '그립다' },
    ],
  },
  {
    id: 'n4-rainy-day',
    title: '雨の 日の 図書館',
    titleKo: '비 오는 날의 도서관',
    level: 'N4',
    source: 'curated',
    sourceLabel: '학습 큐레이션',
    estimatedMinutes: 2,
    description: '비 오는 날 도서관에서 보낸 하루',
    paragraphs: [
      {
        ja: '今朝から ずっと 雨が 降っています。',
        reading: 'けさから ずっと あめが ふっています。',
        ko: '오늘 아침부터 계속 비가 내리고 있습니다.',
      },
      {
        ja: '出かける 予定でしたが、図書館で 本を 読むことに しました。',
        reading: 'でかける よていでしたが、としょかんで ほんを よむことに しました。',
        ko: '외출할 예정이었지만, 도서관에서 책을 읽기로 했습니다.',
      },
      {
        ja: '静かな 場所で 読書を するのは とても 気持ちが いいです。',
        reading: 'しずかな ばしょで どくしょを するのは とても きもちが いいです。',
        ko: '조용한 곳에서 독서를 하는 것은 매우 기분이 좋습니다.',
      },
    ],
    vocabulary: [
      { kanji: '今朝', reading: 'けさ', meaning: '오늘 아침' },
      { kanji: '降る', reading: 'ふる', meaning: '내리다' },
      { kanji: '予定', reading: 'よてい', meaning: '예정' },
      { kanji: '図書館', reading: 'としょかん', meaning: '도서관' },
      { kanji: '静か', reading: 'しずか', meaning: '조용함' },
      { kanji: '読書', reading: 'どくしょ', meaning: '독서' },
    ],
  },

  // ─── N3 (3개) ─────────────────────────────────────────
  {
    id: 'n3-soseki-botchan',
    title: '坊っちゃん (発췌)',
    titleKo: '도련님 (발췌)',
    level: 'N3',
    source: 'aozora',
    sourceLabel: '夏目漱石「坊っちゃん」 (1906) · Aozora Bunko',
    sourceUrl: 'https://www.aozora.gr.jp/cards/000148/card752.html',
    estimatedMinutes: 3,
    description: '나츠메 소세키의 명작 첫 문장. 일본 근대문학의 상징적 도입부.',
    paragraphs: [
      {
        ja: '親譲りの 無鉄砲で 子供の 時から 損ばかりしている。',
        reading: 'おやゆずりの むてっぽうで こどもの ときから そんばかりしている。',
        ko: '부모에게 물려받은 무모함 때문에 어릴 적부터 손해만 보고 있다.',
      },
      {
        ja: '小学校に 居る 時分 学校の 二階から 飛び降りて 一週間ほど 腰を 抜かした 事がある。',
        reading: 'しょうがっこうに いる じぶん がっこうの にかいから とびおりて いっしゅうかんほど こしを ぬかした ことがある。',
        ko: '초등학교 시절 학교 2층에서 뛰어내려 일주일 정도 허리를 못 쓰게 된 적이 있다.',
      },
      {
        ja: 'なぜ そんな 無闇を したと 聞く 人が あるかも 知れぬ。別段 深い 理由でもない。',
        reading: 'なぜ そんな むやみを したと きく ひとが あるかも しれぬ。べつだん ふかい りゆうでもない。',
        ko: '왜 그런 무모한 짓을 했냐고 묻는 사람이 있을지도 모른다. 딱히 깊은 이유는 없다.',
      },
    ],
    vocabulary: [
      { kanji: '親譲り', reading: 'おやゆずり', meaning: '부모에게 물려받음' },
      { kanji: '無鉄砲', reading: 'むてっぽう', meaning: '무모함' },
      { kanji: '損', reading: 'そん', meaning: '손해' },
      { kanji: '飛び降りる', reading: 'とびおりる', meaning: '뛰어내리다' },
      { kanji: '腰を抜かす', reading: 'こしをぬかす', meaning: '허리를 못 쓰다 (관용구)' },
      { kanji: '無闇', reading: 'むやみ', meaning: '무턱대고, 무모하게' },
      { kanji: '理由', reading: 'りゆう', meaning: '이유' },
    ],
  },
  {
    id: 'n3-kenji-restaurant',
    title: '注文の多い料理店 (発췌)',
    titleKo: '주문이 많은 요리점 (발췌)',
    level: 'N3',
    source: 'aozora',
    sourceLabel: '宮沢賢治「注文の多い料理店」(1924) · Aozora Bunko',
    sourceUrl: 'https://www.aozora.gr.jp/cards/000081/card43754.html',
    estimatedMinutes: 3,
    description: '미야자와 켄지의 유명한 단편 동화 도입부. 신비롭고 으스스한 분위기.',
    paragraphs: [
      {
        ja: '二人の 若い 紳士が、すっかり イギリスの 兵隊の かたちをして、ぴかぴかする 鉄砲を かついで、白熊のような 犬を 二疋つれて、だいぶ 山奥の、木の葉の かさかさした ところを、こんなことを 云いながら、あるいておりました。',
        reading: 'ふたりの わかい しんしが、すっかり イギリスの へいたいの かたちをして、ぴかぴかする てっぽうを かついで、しろくまのような いぬを にひきつれて、だいぶ やまおくの、このはの かさかさした ところを、こんなことを いいながら、あるいておりました。',
        ko: '두 명의 젊은 신사가, 완전히 영국 군인 차림으로, 반짝이는 총을 메고, 백곰 같은 개 두 마리를 데리고, 꽤 산속의, 낙엽이 바스락거리는 곳을, 이런 이야기를 하면서, 걷고 있었습니다.',
      },
      {
        ja: '「ぜんたい、ここらの 山は けしからんね。鳥も 獣も 一疋も 居やがらん。」',
        reading: '「ぜんたい、ここらの やまは けしからんね。とりも けものも いっぴきも いやがらん。」',
        ko: '"대체, 이쪽 산은 괘씸하군. 새도 짐승도 한 마리도 없잖아."',
      },
    ],
    vocabulary: [
      { kanji: '紳士', reading: 'しんし', meaning: '신사' },
      { kanji: '兵隊', reading: 'へいたい', meaning: '군인, 병사' },
      { kanji: '鉄砲', reading: 'てっぽう', meaning: '총' },
      { kanji: '山奥', reading: 'やまおく', meaning: '산속 깊은 곳' },
      { kanji: '木の葉', reading: 'このは', meaning: '나뭇잎' },
      { kanji: '獣', reading: 'けもの', meaning: '짐승' },
    ],
  },
  {
    id: 'n3-modern-essay',
    title: '電車の 中の 風景',
    titleKo: '전철 안의 풍경',
    level: 'N3',
    source: 'curated',
    sourceLabel: '학습 큐레이션',
    estimatedMinutes: 2,
    description: '도시 생활의 한 단면을 그린 짧은 에세이',
    paragraphs: [
      {
        ja: '朝の 通勤電車は いつも 混んでいる。',
        reading: 'あさの つうきんでんしゃは いつも こんでいる。',
        ko: '아침 출근 전철은 항상 붐빈다.',
      },
      {
        ja: 'みんな スマートフォンを 見ていて、誰も 周りを 見ていない。',
        reading: 'みんな スマートフォンを みていて、だれも まわりを みていない。',
        ko: '모두 스마트폰을 보고 있고, 누구도 주변을 보지 않는다.',
      },
      {
        ja: 'ある 日、隣の おばあさんが 私に 席を ゆずってくれた。',
        reading: 'あるひ、となりの おばあさんが わたしに せきを ゆずってくれた。',
        ko: '어느 날, 옆의 할머니가 나에게 자리를 양보해 주셨다.',
      },
      {
        ja: 'こんな 小さな 親切が、忙しい 一日を 明るく してくれる。',
        reading: 'こんな ちいさな しんせつが、いそがしい いちにちを あかるく してくれる。',
        ko: '이런 작은 친절이, 바쁜 하루를 밝게 해 준다.',
      },
    ],
    vocabulary: [
      { kanji: '通勤', reading: 'つうきん', meaning: '통근' },
      { kanji: '混む', reading: 'こむ', meaning: '붐비다' },
      { kanji: '周り', reading: 'まわり', meaning: '주변, 주위' },
      { kanji: '隣', reading: 'となり', meaning: '옆, 이웃' },
      { kanji: '譲る', reading: 'ゆずる', meaning: '양보하다' },
      { kanji: '親切', reading: 'しんせつ', meaning: '친절' },
    ],
  },
]

import { EXTRA_READING_PIECES } from './reading-ext'

// base 10편 + ext 10편 = 총 20편
export const READING_PIECES: ReadingPiece[] = [
  ...BASE_READING_PIECES,
  ...EXTRA_READING_PIECES,
]

export function getReadingById(id: string): ReadingPiece | undefined {
  return READING_PIECES.find((p) => p.id === id)
}

export function getReadingByLevel(level: 'all' | 'N5' | 'N4' | 'N3'): ReadingPiece[] {
  if (level === 'all') return READING_PIECES
  return READING_PIECES.filter((p) => p.level === level)
}
