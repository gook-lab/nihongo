// 히라가나를 로마자(영문 발음)로 변환하는 유틸리티

const HIRAGANA_MAP: Record<string, string> = {
  // 기본 모음
  'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
  // か행
  'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
  // さ행
  'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
  // た행
  'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
  // な행
  'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
  // は행
  'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
  // ま행
  'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
  // や행
  'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
  // ら행
  'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
  // わ행
  'わ': 'wa', 'を': 'wo', 'ん': 'n',
  // 탁음 (가행)
  'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
  // 탁음 (さ행)
  'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
  // 탁음 (た행)
  'だ': 'da', 'ぢ': 'ji', 'づ': 'zu', 'で': 'de', 'ど': 'do',
  // 탁음 (は행)
  'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
  // 반탁음
  'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
  // 요음 (きゃ, etc.)
  'きゃ': 'kya', 'きゅ': 'kyu', 'きょ': 'kyo',
  'しゃ': 'sha', 'しゅ': 'shu', 'しょ': 'sho',
  'ちゃ': 'cha', 'ちゅ': 'chu', 'ちょ': 'cho',
  'にゃ': 'nya', 'にゅ': 'nyu', 'にょ': 'nyo',
  'ひゃ': 'hya', 'ひゅ': 'hyu', 'ひょ': 'hyo',
  'みゃ': 'mya', 'みゅ': 'myu', 'みょ': 'myo',
  'りゃ': 'rya', 'りゅ': 'ryu', 'りょ': 'ryo',
  'ぎゃ': 'gya', 'ぎゅ': 'gyu', 'ぎょ': 'gyo',
  'じゃ': 'ja', 'じゅ': 'ju', 'じょ': 'jo',
  'びゃ': 'bya', 'びゅ': 'byu', 'びょ': 'byo',
  'ぴゃ': 'pya', 'ぴゅ': 'pyu', 'ぴょ': 'pyo',
  // 촉음 (작은 つ)
  'っ': '',
  // 작은 모음
  'ゃ': 'ya', 'ゅ': 'yu', 'ょ': 'yo',
  'ぁ': 'a', 'ぃ': 'i', 'ぅ': 'u', 'ぇ': 'e', 'ぉ': 'o',
  // 장음
  'ー': '',
}

// 2문자 요음 패턴 (먼저 체크)
const TWO_CHAR_PATTERNS = [
  'きゃ', 'きゅ', 'きょ',
  'しゃ', 'しゅ', 'しょ',
  'ちゃ', 'ちゅ', 'ちょ',
  'にゃ', 'にゅ', 'にょ',
  'ひゃ', 'ひゅ', 'ひょ',
  'みゃ', 'みゅ', 'みょ',
  'りゃ', 'りゅ', 'りょ',
  'ぎゃ', 'ぎゅ', 'ぎょ',
  'じゃ', 'じゅ', 'じょ',
  'びゃ', 'びゅ', 'びょ',
  'ぴゃ', 'ぴゅ', 'ぴょ',
]

export function hiraganaToRomaji(hiragana: string): string {
  let result = ''
  let i = 0

  while (i < hiragana.length) {
    // 촉음 처리 (っ 다음 자음을 두 번 반복)
    if (hiragana[i] === 'っ' && i + 1 < hiragana.length) {
      const nextChar = hiragana[i + 1]
      const nextRomaji = HIRAGANA_MAP[nextChar]
      if (nextRomaji && nextRomaji.length > 0) {
        result += nextRomaji[0] // 다음 자음의 첫 글자를 추가
      }
      i++
      continue
    }

    // 2문자 패턴 체크 (요음)
    if (i + 1 < hiragana.length) {
      const twoChars = hiragana.slice(i, i + 2)
      if (TWO_CHAR_PATTERNS.includes(twoChars)) {
        result += HIRAGANA_MAP[twoChars] || twoChars
        i += 2
        continue
      }
    }

    // 1문자 변환
    const char = hiragana[i]
    result += HIRAGANA_MAP[char] || char
    i++
  }

  return result
}
