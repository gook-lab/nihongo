// 일본어 관용구 (慣用句) — JLPT 외 일상에서 자주 쓰는 비유적 표현.
// 한자 + 히라가나 + 한국어 직역 + 의미 + 예문.

export interface Idiom {
  id: string
  ja: string
  reading: string
  literalKo: string
  meaningKo: string
  example: {
    ja: string
    reading: string
    ko: string
  }
  category: 'mind' | 'body' | 'work' | 'relationship' | 'time'
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1'
}

export const IDIOMS: Idiom[] = [
  // ─── 신체 (body) ───
  {
    id: 'i-001',
    ja: '頭がいい',
    reading: 'あたまが いい',
    literalKo: '머리가 좋다',
    meaningKo: '똑똑하다 / 영리하다',
    example: {
      ja: '彼は本当に頭がいい。',
      reading: 'かれは ほんとうに あたまが いい。',
      ko: '그는 정말 똑똑하다.',
    },
    category: 'mind',
    level: 'N4',
  },
  {
    id: 'i-002',
    ja: '手が早い',
    reading: 'てが はやい',
    literalKo: '손이 빠르다',
    meaningKo: '일 처리가 빠르다 (or 손버릇이 나쁘다 — 맥락 주의)',
    example: {
      ja: '田中さんは仕事の手が早い。',
      reading: 'たなかさんは しごとの てが はやい。',
      ko: '다나카 씨는 일 처리가 빠르다.',
    },
    category: 'work',
    level: 'N3',
  },
  {
    id: 'i-003',
    ja: '口が軽い',
    reading: 'くちが かるい',
    literalKo: '입이 가볍다',
    meaningKo: '입싸다 / 비밀을 못 지킨다',
    example: {
      ja: '彼女に話さない方がいい。口が軽いから。',
      reading: 'かのじょに はなさない ほうが いい。くちが かるいから。',
      ko: '그녀에게 말하지 않는 게 좋아. 입이 가벼우니까.',
    },
    category: 'relationship',
    level: 'N3',
  },
  {
    id: 'i-004',
    ja: '目が高い',
    reading: 'めが たかい',
    literalKo: '눈이 높다',
    meaningKo: '안목이 있다 / 좋은 것을 알아본다',
    example: {
      ja: 'お目が高いですね、これは限定品です。',
      reading: 'おめが たかいですね、これは げんていひんです。',
      ko: '안목이 좋으시네요, 이건 한정품입니다.',
    },
    category: 'mind',
    level: 'N3',
  },
  {
    id: 'i-005',
    ja: '鼻が高い',
    reading: 'はなが たかい',
    literalKo: '코가 높다',
    meaningKo: '자랑스럽다 / 어깨가 으쓱하다',
    example: {
      ja: '息子が大学に合格して、鼻が高い。',
      reading: 'むすこが だいがくに ごうかくして、はなが たかい。',
      ko: '아들이 대학에 합격해서 자랑스럽다.',
    },
    category: 'mind',
    level: 'N3',
  },
  {
    id: 'i-006',
    ja: '腹が立つ',
    reading: 'はらが たつ',
    literalKo: '배가 일어선다',
    meaningKo: '화가 난다',
    example: {
      ja: '彼の態度に腹が立つ。',
      reading: 'かれの たいどに はらが たつ。',
      ko: '그의 태도에 화가 난다.',
    },
    category: 'mind',
    level: 'N4',
  },
  {
    id: 'i-007',
    ja: '気が短い',
    reading: 'きが みじかい',
    literalKo: '기가 짧다',
    meaningKo: '성격이 급하다',
    example: {
      ja: '父は気が短いから、待たせるとよくない。',
      reading: 'ちちは きが みじかいから、またせると よくない。',
      ko: '아버지는 성격이 급해서 기다리게 하면 안 좋다.',
    },
    category: 'mind',
    level: 'N3',
  },
  {
    id: 'i-008',
    ja: '猫の手も借りたい',
    reading: 'ねこの ても かりたい',
    literalKo: '고양이 손이라도 빌리고 싶다',
    meaningKo: '너무 바빠서 누구라도 도와줬으면 한다',
    example: {
      ja: '年末は猫の手も借りたいほど忙しい。',
      reading: 'ねんまつは ねこの ても かりたい ほど いそがしい。',
      ko: '연말은 너무 바빠서 누구라도 도와줬으면 한다.',
    },
    category: 'work',
    level: 'N2',
  },
  {
    id: 'i-009',
    ja: '一石二鳥',
    reading: 'いっせき にちょう',
    literalKo: '한 돌로 두 마리 새',
    meaningKo: '일거양득 / 일석이조',
    example: {
      ja: 'これは一石二鳥のアイデアだ。',
      reading: 'これは いっせき にちょうの あいでぁだ。',
      ko: '이건 일석이조 아이디어다.',
    },
    category: 'work',
    level: 'N2',
  },
  {
    id: 'i-010',
    ja: '七転び八起き',
    reading: 'ななころび やおき',
    literalKo: '일곱 번 넘어지고 여덟 번 일어남',
    meaningKo: '실패해도 포기하지 않고 다시 일어남',
    example: {
      ja: '人生は七転び八起きだ。',
      reading: 'じんせいは ななころび やおきだ。',
      ko: '인생은 칠전팔기다.',
    },
    category: 'mind',
    level: 'N2',
  },
  // ─── 시간 (time) ───
  {
    id: 'i-011',
    ja: '朝飯前',
    reading: 'あさめし まえ',
    literalKo: '아침 식사 전',
    meaningKo: '식은 죽 먹기 / 너무 쉬운 일',
    example: {
      ja: 'これくらいの仕事は朝飯前だ。',
      reading: 'これくらいの しごとは あさめしまえだ。',
      ko: '이 정도 일은 식은 죽 먹기다.',
    },
    category: 'work',
    level: 'N2',
  },
  {
    id: 'i-012',
    ja: '時間を潰す',
    reading: 'じかんを つぶす',
    literalKo: '시간을 부숨',
    meaningKo: '시간을 때우다 / 시간을 죽이다',
    example: {
      ja: 'カフェで時間を潰した。',
      reading: 'かふぇで じかんを つぶした。',
      ko: '카페에서 시간을 때웠다.',
    },
    category: 'time',
    level: 'N3',
  },
  // ─── 인간관계 (relationship) ───
  {
    id: 'i-013',
    ja: '気が合う',
    reading: 'きが あう',
    literalKo: '기가 맞는다',
    meaningKo: '마음이 잘 통한다 / 죽이 잘 맞는다',
    example: {
      ja: '彼とは気が合う。',
      reading: 'かれとは きが あう。',
      ko: '그와는 마음이 잘 맞는다.',
    },
    category: 'relationship',
    level: 'N3',
  },
  {
    id: 'i-014',
    ja: '世話になる',
    reading: 'せわに なる',
    literalKo: '신세를 진다',
    meaningKo: '신세지다 / 도움받다',
    example: {
      ja: 'いつもお世話になっております。',
      reading: 'いつも おせわに なって おります。',
      ko: '항상 신세 지고 있습니다.',
    },
    category: 'relationship',
    level: 'N4',
  },
  {
    id: 'i-015',
    ja: '顔が広い',
    reading: 'かおが ひろい',
    literalKo: '얼굴이 넓다',
    meaningKo: '발이 넓다 / 인맥이 많다',
    example: {
      ja: '彼は業界で顔が広い。',
      reading: 'かれは ぎょうかいで かおが ひろい。',
      ko: '그는 업계에서 발이 넓다.',
    },
    category: 'relationship',
    level: 'N3',
  },
  // ─── 마음 (mind) ───
  {
    id: 'i-016',
    ja: '気をつける',
    reading: 'きを つける',
    literalKo: '기를 붙인다',
    meaningKo: '조심하다',
    example: {
      ja: '車に気をつけて。',
      reading: 'くるまに きを つけて。',
      ko: '차 조심해.',
    },
    category: 'mind',
    level: 'N5',
  },
  {
    id: 'i-017',
    ja: '気持ちが伝わる',
    reading: 'きもちが つたわる',
    literalKo: '마음이 전해진다',
    meaningKo: '진심이 통하다 / 마음이 닿다',
    example: {
      ja: '手紙で気持ちが伝わった。',
      reading: 'てがみで きもちが つたわった。',
      ko: '편지로 마음이 전해졌다.',
    },
    category: 'mind',
    level: 'N3',
  },
  {
    id: 'i-018',
    ja: '胸が痛い',
    reading: 'むねが いたい',
    literalKo: '가슴이 아프다',
    meaningKo: '마음이 아프다 / 안타깝다',
    example: {
      ja: 'そのニュースを聞いて胸が痛い。',
      reading: 'その にゅーすを きいて むねが いたい。',
      ko: '그 뉴스를 듣고 가슴이 아프다.',
    },
    category: 'mind',
    level: 'N3',
  },
  {
    id: 'i-019',
    ja: '心を込める',
    reading: 'こころを こめる',
    literalKo: '마음을 담는다',
    meaningKo: '정성을 다하다',
    example: {
      ja: '心を込めて料理を作りました。',
      reading: 'こころを こめて りょうりを つくりました。',
      ko: '정성을 다해 요리를 만들었습니다.',
    },
    category: 'mind',
    level: 'N3',
  },
  {
    id: 'i-020',
    ja: '気にしない',
    reading: 'きに しない',
    literalKo: '신경에 하지 않는다',
    meaningKo: '신경 쓰지 않는다 / 괜찮다',
    example: {
      ja: '気にしないで、大丈夫だよ。',
      reading: 'きに しないで、だいじょうぶだよ。',
      ko: '신경 쓰지 마, 괜찮아.',
    },
    category: 'mind',
    level: 'N4',
  },
]

export const IDIOM_CATEGORIES: { id: Idiom['category']; nameKo: string; emoji: string }[] = [
  { id: 'mind', nameKo: '마음·기분', emoji: '💭' },
  { id: 'body', nameKo: '몸', emoji: '🫀' },
  { id: 'work', nameKo: '일', emoji: '💼' },
  { id: 'relationship', nameKo: '인간관계', emoji: '🤝' },
  { id: 'time', nameKo: '시간', emoji: '⏰' },
]

export function getIdiomById(id: string): Idiom | undefined {
  return IDIOMS.find((i) => i.id === id)
}

export function getIdiomsByCategory(category: Idiom['category']): Idiom[] {
  return IDIOMS.filter((i) => i.category === category)
}
