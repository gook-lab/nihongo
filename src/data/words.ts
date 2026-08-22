import type { Word } from '@/types'
import { useAppStore } from '@/store'
import { N2_WORDS } from './words-n2'
import { N1_WORDS } from './words-n1'
import { extractWordsFromConversations } from './words-from-conversations'

// ============================================
// N5 레벨 단어 (120개) - 한국어 번역 + 예문 포함
// ============================================
const N5_WORDS: Word[] = [
  { id: 'n5-001', kanji: '学校', hiragana: 'がっこう', meaning: '학교', level: 5, example: { japanese: '私は学校に行きます。', korean: '나는 학교에 갑니다.', targetWord: '学校', reading: 'わたしは がっこうに いきます。' } },
  { id: 'n5-002', kanji: '先生', hiragana: 'せんせい', meaning: '선생님', level: 5, example: { japanese: '先生は優しいです。', korean: '선생님은 친절합니다.', targetWord: '先生', reading: 'せんせいは やさしいです。' } },
  { id: 'n5-003', kanji: '友達', hiragana: 'ともだち', meaning: '친구', level: 5, example: { japanese: '友達と遊びます。', korean: '친구와 놉니다.', targetWord: '友達', reading: 'ともだちと あそびます。' } },
  { id: 'n5-004', kanji: '食べる', hiragana: 'たべる', meaning: '먹다', level: 5, example: { japanese: 'ご飯を食べます。', korean: '밥을 먹습니다.', targetWord: '食べ', reading: 'ごはんを たべます。' } },
  { id: 'n5-005', kanji: '飲む', hiragana: 'のむ', meaning: '마시다', level: 5, example: { japanese: '水を飲みます。', korean: '물을 마십니다.', targetWord: '飲み', reading: 'みずを のみます。' } },
  { id: 'n5-006', kanji: '見る', hiragana: 'みる', meaning: '보다', level: 5, example: { japanese: 'テレビを見ます。', korean: 'TV를 봅니다.', targetWord: '見', reading: 'てれびを みます。' } },
  { id: 'n5-007', kanji: '聞く', hiragana: 'きく', meaning: '듣다', level: 5, example: { japanese: '音楽を聞きます。', korean: '음악을 듣습니다.', targetWord: '聞き', reading: 'おんがくを ききます。' } },
  { id: 'n5-008', kanji: '話す', hiragana: 'はなす', meaning: '말하다', level: 5, example: { japanese: '日本語を話します。', korean: '일본어를 말합니다.', targetWord: '話し', reading: 'にほんごを はなします。' } },
  { id: 'n5-009', kanji: '読む', hiragana: 'よむ', meaning: '읽다', level: 5, example: { japanese: '本を読みます。', korean: '책을 읽습니다.', targetWord: '読み', reading: 'ほんを よみます。' } },
  { id: 'n5-010', kanji: '書く', hiragana: 'かく', meaning: '쓰다', level: 5, example: { japanese: '手紙を書きます。', korean: '편지를 씁니다.', targetWord: '書き', reading: 'てがみを かきます。' } },
  { id: 'n5-011', kanji: '行く', hiragana: 'いく', meaning: '가다', level: 5, example: { japanese: '駅に行きます。', korean: '역에 갑니다.', targetWord: '行き', reading: 'えきに いきます。' } },
  { id: 'n5-012', kanji: '来る', hiragana: 'くる', meaning: '오다', level: 5, example: { japanese: '友達が来ます。', korean: '친구가 옵니다.', targetWord: '来', reading: 'ともだちが きます。' } },
  { id: 'n5-013', kanji: '帰る', hiragana: 'かえる', meaning: '돌아가다', level: 5, example: { japanese: '家に帰ります。', korean: '집에 돌아갑니다.', targetWord: '帰り', reading: 'いえに かえります。' } },
  { id: 'n5-014', kanji: '買う', hiragana: 'かう', meaning: '사다', level: 5, example: { japanese: '本を買います。', korean: '책을 삽니다.', targetWord: '買い', reading: 'ほんを かいます。' } },
  { id: 'n5-015', kanji: '使う', hiragana: 'つかう', meaning: '사용하다', level: 5, example: { japanese: 'パソコンを使います。', korean: '컴퓨터를 사용합니다.', targetWord: '使い', reading: 'ぱそこんを つかいます。' } },
  { id: 'n5-016', kanji: '大きい', hiragana: 'おおきい', meaning: '크다', level: 5, example: { japanese: 'この家は大きいです。', korean: '이 집은 큽니다.', targetWord: '大きい', reading: 'このいえは おおきいです。' } },
  { id: 'n5-017', kanji: '小さい', hiragana: 'ちいさい', meaning: '작다', level: 5, example: { japanese: 'その猫は小さいです。', korean: '그 고양이는 작습니다.', targetWord: '小さい', reading: 'そのねこは ちいさいです。' } },
  { id: 'n5-018', kanji: '新しい', hiragana: 'あたらしい', meaning: '새롭다', level: 5, example: { japanese: '新しい車を買いました。', korean: '새 차를 샀습니다.', targetWord: '新しい', reading: 'あたらしいくるまを かいました。' } },
  { id: 'n5-019', kanji: '古い', hiragana: 'ふるい', meaning: '오래되다', level: 5, example: { japanese: 'この建物は古いです。', korean: '이 건물은 오래됐습니다.', targetWord: '古い', reading: 'このたてものは ふるいです。' } },
  { id: 'n5-020', kanji: '高い', hiragana: 'たかい', meaning: '높다, 비싸다', level: 5, example: { japanese: 'あの山は高いです。', korean: '저 산은 높습니다.', targetWord: '高い', reading: 'あのやまは たかいです。' } },
  { id: 'n5-021', kanji: '安い', hiragana: 'やすい', meaning: '싸다', level: 5, example: { japanese: 'このりんごは安いです。', korean: '이 사과는 쌉니다.', targetWord: '安い', reading: 'このりんごは やすいです。' } },
  { id: 'n5-022', kanji: '今日', hiragana: 'きょう', meaning: '오늘', level: 5, example: { japanese: '今日は暑いです。', korean: '오늘은 덥습니다.', targetWord: '今日', reading: 'きょうは あついです。' } },
  { id: 'n5-023', kanji: '明日', hiragana: 'あした', meaning: '내일', level: 5, example: { japanese: '明日会いましょう。', korean: '내일 만나요.', targetWord: '明日', reading: 'あした あいましょう。' } },
  { id: 'n5-024', kanji: '昨日', hiragana: 'きのう', meaning: '어제', level: 5, example: { japanese: '昨日は寒かったです。', korean: '어제는 추웠습니다.', targetWord: '昨日', reading: 'きのうは さむかったです。' } },
  { id: 'n5-025', kanji: '電車', hiragana: 'でんしゃ', meaning: '전철', level: 5, example: { japanese: '電車に乗ります。', korean: '전철을 탑니다.', targetWord: '電車', reading: 'でんしゃに のります。' } },
  { id: 'n5-026', kanji: '毎朝', hiragana: 'まいあさ', meaning: '매일 아침', level: 5, example: { japanese: '毎朝コーヒーを飲みます。', korean: '매일 아침 커피를 마십니다.', targetWord: '毎朝', reading: 'まいあさ こーひーを のみます。' } },
  { id: 'n5-027', kanji: '問題', hiragana: 'もんだい', meaning: '문제', level: 5, example: { japanese: 'この問題は難しいです。', korean: '이 문제는 어렵습니다.', targetWord: '問題', reading: 'このもんだいは むずかしいです。' } },
  { id: 'n5-028', kanji: 'お茶', hiragana: 'おちゃ', meaning: '녹차, 차', level: 5, example: { japanese: 'お茶を飲みませんか。', korean: '차 마실래요?', targetWord: 'お茶', reading: 'おちゃを のみませんか。' } },
  { id: 'n5-029', kanji: '黒', hiragana: 'くろ', meaning: '검정', level: 5, example: { japanese: '黒い猫がいます。', korean: '검은 고양이가 있습니다.', targetWord: '黒', reading: 'くろいねこが います。' } },
  { id: 'n5-030', kanji: '台所', hiragana: 'だいどころ', meaning: '부엌', level: 5, example: { japanese: '台所で料理します。', korean: '부엌에서 요리합니다.', targetWord: '台所', reading: 'だいどころで りょうりします。' } },
  { id: 'n5-031', kanji: '引く', hiragana: 'ひく', meaning: '당기다', level: 5, example: { japanese: 'ドアを引いてください。', korean: '문을 당겨주세요.', targetWord: '引', reading: 'どあを ひいてください。' } },
  { id: 'n5-032', kanji: '押す', hiragana: 'おす', meaning: '밀다, 누르다', level: 5, example: { japanese: 'ボタンを押してください。', korean: '버튼을 눌러주세요.', targetWord: '押', reading: 'ぼたんを おしてください。' } },
  { id: 'n5-033', kanji: '売る', hiragana: 'うる', meaning: '팔다', level: 5, example: { japanese: 'この店で本を売っています。', korean: '이 가게에서 책을 팝니다.', targetWord: '売', reading: 'このみせで ほんを うっています。' } },
  { id: 'n5-034', kanji: '電気', hiragana: 'でんき', meaning: '전기', level: 5, example: { japanese: '電気をつけてください。', korean: '불을 켜주세요.', targetWord: '電気', reading: 'でんきを つけてください。' } },
  { id: 'n5-035', kanji: '病気', hiragana: 'びょうき', meaning: '병, 아픔', level: 5, example: { japanese: '病気で学校を休みました。', korean: '아파서 학교를 쉬었습니다.', targetWord: '病気', reading: 'びょうきで がっこうを やすみました。' } },
  { id: 'n5-036', kanji: '頭', hiragana: 'あたま', meaning: '머리', level: 5, example: { japanese: '頭が痛いです。', korean: '머리가 아픕니다.', targetWord: '頭', reading: 'あたまが いたいです。' } },
  { id: 'n5-037', kanji: '英語', hiragana: 'えいご', meaning: '영어', level: 5, example: { japanese: '英語を勉強しています。', korean: '영어를 공부하고 있습니다.', targetWord: '英語', reading: 'えいごを べんきょうしています。' } },
  { id: 'n5-038', kanji: '家', hiragana: 'いえ', meaning: '집', level: 5, example: { japanese: '家に帰ります。', korean: '집에 돌아갑니다.', targetWord: '家', reading: 'いえに かえります。' } },
  { id: 'n5-039', kanji: '暑い', hiragana: 'あつい', meaning: '덥다', level: 5, example: { japanese: '今日は暑いですね。', korean: '오늘 덥네요.', targetWord: '暑い', reading: 'きょうは あついですね。' } },
  { id: 'n5-040', kanji: '遊ぶ', hiragana: 'あそぶ', meaning: '놀다', level: 5, example: { japanese: '公園で遊びます。', korean: '공원에서 놉니다.', targetWord: '遊び', reading: 'こうえんで あそびます。' } },
  { id: 'n5-041', kanji: '取る', hiragana: 'とる', meaning: '잡다, 가져가다', level: 5, example: { japanese: '写真を取ります。', korean: '사진을 찍습니다.', targetWord: '取り', reading: 'しゃしんを とります。' } },
  { id: 'n5-042', kanji: '閉める', hiragana: 'しめる', meaning: '닫다', level: 5, example: { japanese: '窓を閉めてください。', korean: '창문을 닫아주세요.', targetWord: '閉め', reading: 'まどを しめてください。' } },
  { id: 'n5-043', kanji: '便利', hiragana: 'べんり', meaning: '편리하다', level: 5, example: { japanese: 'この駅は便利です。', korean: '이 역은 편리합니다.', targetWord: '便利', reading: 'このえきは べんりです。' } },
  { id: 'n5-044', kanji: '右', hiragana: 'みぎ', meaning: '오른쪽', level: 5, example: { japanese: '右に曲がってください。', korean: '오른쪽으로 도세요.', targetWord: '右', reading: 'みぎに まがってください。' } },
  { id: 'n5-045', kanji: '寒い', hiragana: 'さむい', meaning: '춥다', level: 5, example: { japanese: '今日は寒いです。', korean: '오늘은 춥습니다.', targetWord: '寒い', reading: 'きょうは さむいです。' } },
  { id: 'n5-046', kanji: '中', hiragana: 'なか', meaning: '안, 중간', level: 5, example: { japanese: '箱の中にあります。', korean: '상자 안에 있습니다.', targetWord: '中', reading: 'はこの なかに あります。' } },
  { id: 'n5-047', kanji: '消す', hiragana: 'けす', meaning: '끄다, 지우다', level: 5, example: { japanese: '電気を消してください。', korean: '불을 꺼주세요.', targetWord: '消', reading: 'でんきを けしてください。' } },
  { id: 'n5-048', kanji: '近く', hiragana: 'ちかく', meaning: '근처', level: 5, example: { japanese: '駅の近くに住んでいます。', korean: '역 근처에 살고 있습니다.', targetWord: '近く', reading: 'えきの ちかくに すんでいます。' } },
  { id: 'n5-049', kanji: '目', hiragana: 'め', meaning: '눈', level: 5, example: { japanese: '目が疲れました。', korean: '눈이 피곤합니다.', targetWord: '目', reading: 'めが つかれました。' } },
  { id: 'n5-050', kanji: '空', hiragana: 'そら', meaning: '하늘', level: 5, example: { japanese: '空がきれいです。', korean: '하늘이 예쁩니다.', targetWord: '空', reading: 'そらが きれいです。' } },
  { id: 'n5-051', kanji: '座る', hiragana: 'すわる', meaning: '앉다', level: 5, example: { japanese: 'ここに座ってください。', korean: '여기 앉아주세요.', targetWord: '座', reading: 'ここに すわってください。' } },
  { id: 'n5-052', kanji: '年', hiragana: 'とし', meaning: '해, 나이', level: 5, example: { japanese: '今年は忙しいです。', korean: '올해는 바쁩니다.', targetWord: '年', reading: 'ことしは いそがしいです。' } },
  { id: 'n5-053', kanji: '狭い', hiragana: 'せまい', meaning: '좁다', level: 5, example: { japanese: 'この部屋は狭いです。', korean: '이 방은 좁습니다.', targetWord: '狭い', reading: 'このへやは せまいです。' } },
  { id: 'n5-054', kanji: '冷蔵庫', hiragana: 'れいぞうこ', meaning: '냉장고', level: 5, example: { japanese: '冷蔵庫に牛乳があります。', korean: '냉장고에 우유가 있습니다.', targetWord: '冷蔵庫', reading: 'れいぞうこに ぎゅうにゅうが あります。' } },
  { id: 'n5-055', kanji: '玄関', hiragana: 'げんかん', meaning: '현관', level: 5, example: { japanese: '玄関で靴を脱ぎます。', korean: '현관에서 신발을 벗습니다.', targetWord: '玄関', reading: 'げんかんで くつを ぬぎます。' } },
  { id: 'n5-056', kanji: '違う', hiragana: 'ちがう', meaning: '다르다', level: 5, example: { japanese: 'それは違います。', korean: '그것은 다릅니다.', targetWord: '違', reading: 'それは ちがいます。' } },
  { id: 'n5-057', kanji: '危ない', hiragana: 'あぶない', meaning: '위험하다', level: 5, example: { japanese: 'ここは危ないです。', korean: '여기는 위험합니다.', targetWord: '危ない', reading: 'ここは あぶないです。' } },
  { id: 'n5-058', kanji: '分かる', hiragana: 'わかる', meaning: '알다, 이해하다', level: 5, example: { japanese: '日本語が分かりますか。', korean: '일본어를 알아요?', targetWord: '分かり', reading: 'にほんごが わかりますか。' } },
  { id: 'n5-059', kanji: '言う', hiragana: 'いう', meaning: '말하다', level: 5, example: { japanese: '先生が言いました。', korean: '선생님이 말했습니다.', targetWord: '言', reading: 'せんせいが いいました。' } },
  { id: 'n5-060', kanji: '練習', hiragana: 'れんしゅう', meaning: '연습', level: 5, example: { japanese: '毎日練習します。', korean: '매일 연습합니다.', targetWord: '練習', reading: 'まいにち れんしゅうします。' } },
  { id: 'n5-061', kanji: '何', hiragana: 'なに', meaning: '무엇', level: 5, example: { japanese: 'これは何ですか。', korean: '이것은 무엇입니까?', targetWord: '何', reading: 'これは なんですか。' } },
  { id: 'n5-062', kanji: '脱ぐ', hiragana: 'ぬぐ', meaning: '벗다', level: 5, example: { japanese: '靴を脱いでください。', korean: '신발을 벗어주세요.', targetWord: '脱', reading: 'くつを ぬいでください。' } },
  { id: 'n5-063', kanji: '登る', hiragana: 'のぼる', meaning: '오르다', level: 5, example: { japanese: '山に登ります。', korean: '산에 오릅니다.', targetWord: '登り', reading: 'やまに のぼります。' } },
  { id: 'n5-064', kanji: '雨', hiragana: 'あめ', meaning: '비', level: 5, example: { japanese: '雨が降っています。', korean: '비가 내리고 있습니다.', targetWord: '雨', reading: 'あめが ふっています。' } },
  { id: 'n5-065', kanji: '速い', hiragana: 'はやい', meaning: '빠르다', level: 5, example: { japanese: 'この電車は速いです。', korean: '이 전철은 빠릅니다.', targetWord: '速い', reading: 'このでんしゃは はやいです。' } },
  { id: 'n5-066', kanji: 'お風呂', hiragana: 'おふろ', meaning: '목욕탕', level: 5, example: { japanese: 'お風呂に入ります。', korean: '목욕합니다.', targetWord: 'お風呂', reading: 'おふろに はいります。' } },
  { id: 'n5-067', kanji: '手紙', hiragana: 'てがみ', meaning: '편지', level: 5, example: { japanese: '手紙を書きます。', korean: '편지를 씁니다.', targetWord: '手紙', reading: 'てがみを かきます。' } },
  { id: 'n5-068', kanji: '時々', hiragana: 'ときどき', meaning: '가끔', level: 5, example: { japanese: '時々映画を見ます。', korean: '가끔 영화를 봅니다.', targetWord: '時々', reading: 'ときどき えいがを みます。' } },
  { id: 'n5-069', kanji: '傘', hiragana: 'かさ', meaning: '우산', level: 5, example: { japanese: '傘を持っていきます。', korean: '우산을 가져갑니다.', targetWord: '傘', reading: 'かさを もっていきます。' } },
  { id: 'n5-070', kanji: '電話', hiragana: 'でんわ', meaning: '전화', level: 5, example: { japanese: '電話をかけます。', korean: '전화를 겁니다.', targetWord: '電話', reading: 'でんわを かけます。' } },
  { id: 'n5-071', kanji: '道', hiragana: 'みち', meaning: '길', level: 5, example: { japanese: '道を歩きます。', korean: '길을 걸어갑니다.', targetWord: '道', reading: 'みちを あるきます。' } },
  { id: 'n5-072', kanji: '新聞', hiragana: 'しんぶん', meaning: '신문', level: 5, example: { japanese: '新聞を読みます。', korean: '신문을 읽습니다.', targetWord: '新聞', reading: 'しんぶんを よみます。' } },
  { id: 'n5-073', kanji: '庭', hiragana: 'にわ', meaning: '정원', level: 5, example: { japanese: '庭に花があります。', korean: '정원에 꽃이 있습니다.', targetWord: '庭', reading: 'にわに はなが あります。' } },
  { id: 'n5-074', kanji: '番号', hiragana: 'ばんごう', meaning: '번호', level: 5, example: { japanese: '電話番号を教えてください。', korean: '전화번호를 알려주세요.', targetWord: '番号', reading: 'でんわばんごうを おしえてください。' } },
  { id: 'n5-075', kanji: '家族', hiragana: 'かぞく', meaning: '가족', level: 5, example: { japanese: '家族は四人です。', korean: '가족은 4명입니다.', targetWord: '家族', reading: 'かぞくは よにんです。' } },
  { id: 'n5-076', kanji: '上手', hiragana: 'じょうず', meaning: '잘하다', level: 5, example: { japanese: '日本語が上手ですね。', korean: '일본어를 잘하시네요.', targetWord: '上手', reading: 'にほんごが じょうずですね。' } },
  { id: 'n5-077', kanji: '下手', hiragana: 'へた', meaning: '서투르다', level: 5, example: { japanese: '歌が下手です。', korean: '노래를 못합니다.', targetWord: '下手', reading: 'うたが へたです。' } },
  { id: 'n5-078', kanji: '左', hiragana: 'ひだり', meaning: '왼쪽', level: 5, example: { japanese: '左に曲がってください。', korean: '왼쪽으로 도세요.', targetWord: '左', reading: 'ひだりに まがってください。' } },
  { id: 'n5-079', kanji: '白', hiragana: 'しろ', meaning: '하얀색', level: 5, example: { japanese: '白い雲が見えます。', korean: '하얀 구름이 보입니다.', targetWord: '白', reading: 'しろいくもが みえます。' } },
  { id: 'n5-080', kanji: '赤', hiragana: 'あか', meaning: '빨간색', level: 5, example: { japanese: '赤い花が好きです。', korean: '빨간 꽃을 좋아합니다.', targetWord: '赤', reading: 'あかいはなが すきです。' } },
  { id: 'n5-081', kanji: '青', hiragana: 'あお', meaning: '파란색', level: 5, example: { japanese: '空が青いです。', korean: '하늘이 파랗습니다.', targetWord: '青', reading: 'そらが あおいです。' } },
  { id: 'n5-082', kanji: '窓', hiragana: 'まど', meaning: '창문', level: 5, example: { japanese: '窓を開けてください。', korean: '창문을 열어주세요.', targetWord: '窓', reading: 'まどを あけてください。' } },
  { id: 'n5-083', kanji: '外', hiragana: 'そと', meaning: '밖', level: 5, example: { japanese: '外で遊びます。', korean: '밖에서 놉니다.', targetWord: '外', reading: 'そとで あそびます。' } },
  { id: 'n5-084', kanji: '会社', hiragana: 'かいしゃ', meaning: '회사', level: 5, example: { japanese: '会社に行きます。', korean: '회사에 갑니다.', targetWord: '会社', reading: 'かいしゃに いきます。' } },
  { id: 'n5-085', kanji: '映画', hiragana: 'えいが', meaning: '영화', level: 5, example: { japanese: '映画を見ます。', korean: '영화를 봅니다.', targetWord: '映画', reading: 'えいがを みます。' } },
  { id: 'n5-086', kanji: '駅', hiragana: 'えき', meaning: '역', level: 5, example: { japanese: '駅まで歩きます。', korean: '역까지 걸어갑니다.', targetWord: '駅', reading: 'えきまで あるきます。' } },
  { id: 'n5-087', kanji: '銀行', hiragana: 'ぎんこう', meaning: '은행', level: 5, example: { japanese: '銀行でお金を下ろします。', korean: '은행에서 돈을 찾습니다.', targetWord: '銀行', reading: 'ぎんこうで おかねを おろします。' } },
  { id: 'n5-088', kanji: '病院', hiragana: 'びょういん', meaning: '병원', level: 5, example: { japanese: '病院に行きます。', korean: '병원에 갑니다.', targetWord: '病院', reading: 'びょういんに いきます。' } },
  { id: 'n5-089', kanji: '図書館', hiragana: 'としょかん', meaning: '도서관', level: 5, example: { japanese: '図書館で勉強します。', korean: '도서관에서 공부합니다.', targetWord: '図書館', reading: 'としょかんで べんきょうします。' } },
  { id: 'n5-090', kanji: '公園', hiragana: 'こうえん', meaning: '공원', level: 5, example: { japanese: '公園で散歩します。', korean: '공원에서 산책합니다.', targetWord: '公園', reading: 'こうえんで さんぽします。' } },
  { id: 'n5-091', kanji: '朝', hiragana: 'あさ', meaning: '아침', level: 5, example: { japanese: '朝ご飯を食べます。', korean: '아침밥을 먹습니다.', targetWord: '朝', reading: 'あさごはんを たべます。' } },
  { id: 'n5-092', kanji: '昼', hiragana: 'ひる', meaning: '낮, 점심', level: 5, example: { japanese: '昼ご飯を食べます。', korean: '점심을 먹습니다.', targetWord: '昼', reading: 'ひるごはんを たべます。' } },
  { id: 'n5-093', kanji: '夜', hiragana: 'よる', meaning: '밤', level: 5, example: { japanese: '夜は静かです。', korean: '밤은 조용합니다.', targetWord: '夜', reading: 'よるは しずかです。' } },
  { id: 'n5-094', kanji: '週末', hiragana: 'しゅうまつ', meaning: '주말', level: 5, example: { japanese: '週末は何をしますか。', korean: '주말에 뭐 해요?', targetWord: '週末', reading: 'しゅうまつは なにを しますか。' } },
  { id: 'n5-095', kanji: '来週', hiragana: 'らいしゅう', meaning: '다음 주', level: 5, example: { japanese: '来週会いましょう。', korean: '다음 주에 만나요.', targetWord: '来週', reading: 'らいしゅう あいましょう。' } },
  { id: 'n5-096', kanji: '先週', hiragana: 'せんしゅう', meaning: '지난 주', level: 5, example: { japanese: '先週は忙しかったです。', korean: '지난 주는 바빴습니다.', targetWord: '先週', reading: 'せんしゅうは いそがしかったです。' } },
  { id: 'n5-097', kanji: '来月', hiragana: 'らいげつ', meaning: '다음 달', level: 5, example: { japanese: '来月日本に行きます。', korean: '다음 달에 일본에 갑니다.', targetWord: '来月', reading: 'らいげつ にほんに いきます。' } },
  { id: 'n5-098', kanji: '来年', hiragana: 'らいねん', meaning: '내년', level: 5, example: { japanese: '来年は大学に入ります。', korean: '내년에 대학에 들어갑니다.', targetWord: '来年', reading: 'らいねんは だいがくに はいります。' } },
  { id: 'n5-099', kanji: '水', hiragana: 'みず', meaning: '물', level: 5, example: { japanese: '水を飲みます。', korean: '물을 마십니다.', targetWord: '水', reading: 'みずを のみます。' } },
  { id: 'n5-100', kanji: '花', hiragana: 'はな', meaning: '꽃', level: 5, example: { japanese: '花がきれいです。', korean: '꽃이 예쁩니다.', targetWord: '花', reading: 'はなが きれいです。' } },
]

// ============================================
// N4 레벨 단어 (200개) - 영어/한국어 번역
// ============================================
const N4_WORDS: Word[] = [
  { id: 'n4-001', kanji: '雲', hiragana: 'くも', meaning: '구름', level: 4 },
  { id: 'n4-002', kanji: '故障', hiragana: 'こしょう', meaning: '고장', level: 4 },
  { id: 'n4-003', kanji: '怖い', hiragana: 'こわい', meaning: '무섭다', level: 4 },
  { id: 'n4-004', kanji: '運ぶ', hiragana: 'はこぶ', meaning: '운반하다', level: 4 },
  { id: 'n4-005', kanji: '受ける', hiragana: 'うける', meaning: '받다, 시험을 보다', level: 4 },
  { id: 'n4-006', kanji: '首', hiragana: 'くび', meaning: '목', level: 4 },
  { id: 'n4-007', kanji: '市民', hiragana: 'しみん', meaning: '시민', level: 4 },
  { id: 'n4-008', kanji: '付く', hiragana: 'つく', meaning: '붙다', level: 4 },
  { id: 'n4-009', kanji: '訪ねる', hiragana: 'たずねる', meaning: '방문하다', level: 4 },
  { id: 'n4-010', kanji: 'お祝い', hiragana: 'おいわい', meaning: '축하', level: 4 },
  { id: 'n4-011', kanji: '一生懸命', hiragana: 'いっしょうけんめい', meaning: '열심히', level: 4 },
  { id: 'n4-012', kanji: '済む', hiragana: 'すむ', meaning: '끝나다', level: 4 },
  { id: 'n4-013', kanji: '復習', hiragana: 'ふくしゅう', meaning: '복습', level: 4 },
  { id: 'n4-014', kanji: '急', hiragana: 'きゅう', meaning: '급한', level: 4 },
  { id: 'n4-015', kanji: '指輪', hiragana: 'ゆびわ', meaning: '반지', level: 4 },
  { id: 'n4-016', kanji: '美しい', hiragana: 'うつくしい', meaning: '아름답다', level: 4 },
  { id: 'n4-017', kanji: '直る', hiragana: 'なおる', meaning: '고쳐지다', level: 4 },
  { id: 'n4-018', kanji: '水泳', hiragana: 'すいえい', meaning: '수영', level: 4 },
  { id: 'n4-019', kanji: '発音', hiragana: 'はつおん', meaning: '발음', level: 4 },
  { id: 'n4-020', kanji: '手伝う', hiragana: 'てつだう', meaning: '돕다', level: 4 },
  { id: 'n4-021', kanji: '折れる', hiragana: 'おれる', meaning: '부러지다', level: 4 },
  { id: 'n4-022', kanji: '一度', hiragana: 'いちど', meaning: '한 번', level: 4 },
  { id: 'n4-023', kanji: '高等学校', hiragana: 'こうとうがっこう', meaning: '고등학교', level: 4 },
  { id: 'n4-024', kanji: '最初', hiragana: 'さいしょ', meaning: '처음', level: 4 },
  { id: 'n4-025', kanji: '投げる', hiragana: 'なげる', meaning: '던지다', level: 4 },
  { id: 'n4-026', kanji: '変える', hiragana: 'かえる', meaning: '바꾸다', level: 4 },
  { id: 'n4-027', kanji: '昼間', hiragana: 'ひるま', meaning: '낮 시간', level: 4 },
  { id: 'n4-028', kanji: '神社', hiragana: 'じんじゃ', meaning: '신사', level: 4 },
  { id: 'n4-029', kanji: '丁寧', hiragana: 'ていねい', meaning: '정중한', level: 4 },
  { id: 'n4-030', kanji: '規則', hiragana: 'きそく', meaning: '규칙', level: 4 },
  { id: 'n4-031', kanji: '怒る', hiragana: 'おこる', meaning: '화내다', level: 4 },
  { id: 'n4-032', kanji: '海岸', hiragana: 'かいがん', meaning: '해안', level: 4 },
  { id: 'n4-033', kanji: '経済', hiragana: 'けいざい', meaning: '경제', level: 4 },
  { id: 'n4-034', kanji: '以上', hiragana: 'いじょう', meaning: '이상', level: 4 },
  { id: 'n4-035', kanji: '届ける', hiragana: 'とどける', meaning: '배달하다', level: 4 },
  { id: 'n4-036', kanji: '適当', hiragana: 'てきとう', meaning: '적당한', level: 4 },
  { id: 'n4-037', kanji: '祖父', hiragana: 'そふ', meaning: '할아버지', level: 4 },
  { id: 'n4-038', kanji: '文学', hiragana: 'ぶんがく', meaning: '문학', level: 4 },
  { id: 'n4-039', kanji: '生きる', hiragana: 'いきる', meaning: '살다', level: 4 },
  { id: 'n4-040', kanji: '続く', hiragana: 'つづく', meaning: '계속되다', level: 4 },
  { id: 'n4-041', kanji: '受付', hiragana: 'うけつけ', meaning: '접수', level: 4 },
  { id: 'n4-042', kanji: '残る', hiragana: 'のこる', meaning: '남다', level: 4 },
  { id: 'n4-043', kanji: '会話', hiragana: 'かいわ', meaning: '회화', level: 4 },
  { id: 'n4-044', kanji: '増える', hiragana: 'ふえる', meaning: '늘다', level: 4 },
  { id: 'n4-045', kanji: '紹介', hiragana: 'しょうかい', meaning: '소개', level: 4 },
  { id: 'n4-046', kanji: '季節', hiragana: 'きせつ', meaning: '계절', level: 4 },
  { id: 'n4-047', kanji: '虫', hiragana: 'むし', meaning: '벌레', level: 4 },
  { id: 'n4-048', kanji: '祖母', hiragana: 'そぼ', meaning: '할머니', level: 4 },
  { id: 'n4-049', kanji: '変', hiragana: 'へん', meaning: '이상한', level: 4 },
  { id: 'n4-050', kanji: '直す', hiragana: 'なおす', meaning: '고치다', level: 4 },
  { id: 'n4-051', kanji: '世界', hiragana: 'せかい', meaning: '세계', level: 4 },
  { id: 'n4-052', kanji: '食事', hiragana: 'しょくじ', meaning: '식사', level: 4 },
  { id: 'n4-053', kanji: '合う', hiragana: 'あう', meaning: '맞다', level: 4 },
  { id: 'n4-054', kanji: '星', hiragana: 'ほし', meaning: '별', level: 4 },
  { id: 'n4-055', kanji: '失敗', hiragana: 'しっぱい', meaning: '실패', level: 4 },
  { id: 'n4-056', kanji: '思う', hiragana: 'おもう', meaning: '생각하다', level: 4 },
  { id: 'n4-057', kanji: '機会', hiragana: 'きかい', meaning: '기회', level: 4 },
  { id: 'n4-058', kanji: '皆', hiragana: 'みな', meaning: '모두', level: 4 },
  { id: 'n4-059', kanji: '苦い', hiragana: 'にがい', meaning: '쓰다', level: 4 },
  { id: 'n4-060', kanji: '特に', hiragana: 'とくに', meaning: '특히', level: 4 },
  { id: 'n4-061', kanji: '乾く', hiragana: 'かわく', meaning: '마르다', level: 4 },
  { id: 'n4-062', kanji: '葉', hiragana: 'は', meaning: '잎', level: 4 },
  { id: 'n4-063', kanji: '以下', hiragana: 'いか', meaning: '이하', level: 4 },
  { id: 'n4-064', kanji: '彼ら', hiragana: 'かれら', meaning: '그들', level: 4 },
  { id: 'n4-065', kanji: '字', hiragana: 'じ', meaning: '글자', level: 4 },
  { id: 'n4-066', kanji: '厳しい', hiragana: 'きびしい', meaning: '엄격하다', level: 4 },
  { id: 'n4-067', kanji: '優しい', hiragana: 'やさしい', meaning: '상냥하다', level: 4 },
  { id: 'n4-068', kanji: '花見', hiragana: 'はなみ', meaning: '꽃놀이', level: 4 },
  { id: 'n4-069', kanji: '注射', hiragana: 'ちゅうしゃ', meaning: '주사', level: 4 },
  { id: 'n4-070', kanji: '景色', hiragana: 'けしき', meaning: '경치', level: 4 },
  { id: 'n4-071', kanji: '日記', hiragana: 'にっき', meaning: '일기', level: 4 },
  { id: 'n4-072', kanji: 'お礼', hiragana: 'おれい', meaning: '감사', level: 4 },
  { id: 'n4-073', kanji: '集る', hiragana: 'あつまる', meaning: '모이다', level: 4 },
  { id: 'n4-074', kanji: '公務員', hiragana: 'こうむいん', meaning: '공무원', level: 4 },
  { id: 'n4-075', kanji: '警察', hiragana: 'けいさつ', meaning: '경찰', level: 4 },
  { id: 'n4-076', kanji: '空気', hiragana: 'くうき', meaning: '공기', level: 4 },
  { id: 'n4-077', kanji: '周り', hiragana: 'まわり', meaning: '주변', level: 4 },
  { id: 'n4-078', kanji: '約束', hiragana: 'やくそく', meaning: '약속', level: 4 },
  { id: 'n4-079', kanji: '砂', hiragana: 'すな', meaning: '모래', level: 4 },
  { id: 'n4-080', kanji: '笑う', hiragana: 'わらう', meaning: '웃다', level: 4 },
  { id: 'n4-081', kanji: '住所', hiragana: 'じゅうしょ', meaning: '주소', level: 4 },
  { id: 'n4-082', kanji: '注意', hiragana: 'ちゅうい', meaning: '주의', level: 4 },
  { id: 'n4-083', kanji: '無理', hiragana: 'むり', meaning: '무리', level: 4 },
  { id: 'n4-084', kanji: '触る', hiragana: 'さわる', meaning: '만지다', level: 4 },
  { id: 'n4-085', kanji: '歯医者', hiragana: 'はいしゃ', meaning: '치과', level: 4 },
  { id: 'n4-086', kanji: '知らせる', hiragana: 'しらせる', meaning: '알리다', level: 4 },
  { id: 'n4-087', kanji: '点', hiragana: 'てん', meaning: '점', level: 4 },
  { id: 'n4-088', kanji: '予定', hiragana: 'よてい', meaning: '예정', level: 4 },
  { id: 'n4-089', kanji: '火事', hiragana: 'かじ', meaning: '화재', level: 4 },
  { id: 'n4-090', kanji: '出席', hiragana: 'しゅっせき', meaning: '출석', level: 4 },
  { id: 'n4-091', kanji: '壁', hiragana: 'かべ', meaning: '벽', level: 4 },
  { id: 'n4-092', kanji: '植える', hiragana: 'うえる', meaning: '심다', level: 4 },
  { id: 'n4-093', kanji: '生産', hiragana: 'せいさん', meaning: '생산', level: 4 },
  { id: 'n4-094', kanji: '法律', hiragana: 'ほうりつ', meaning: '법률', level: 4 },
  { id: 'n4-095', kanji: '港', hiragana: 'みなと', meaning: '항구', level: 4 },
  { id: 'n4-096', kanji: '連れる', hiragana: 'つれる', meaning: '데려가다', level: 4 },
  { id: 'n4-097', kanji: '辞典', hiragana: 'じてん', meaning: '사전', level: 4 },
  { id: 'n4-098', kanji: '理由', hiragana: 'りゆう', meaning: '이유', level: 4 },
  { id: 'n4-099', kanji: '運動', hiragana: 'うんどう', meaning: '운동', level: 4 },
  { id: 'n4-100', kanji: '見える', hiragana: 'みえる', meaning: '보이다', level: 4 },
  { id: 'n4-101', kanji: '痩せる', hiragana: 'やせる', meaning: '마르다', level: 4 },
  { id: 'n4-102', kanji: 'お土産', hiragana: 'おみやげ', meaning: '기념품', level: 4 },
  { id: 'n4-103', kanji: '泥棒', hiragana: 'どろぼう', meaning: '도둑', level: 4 },
  { id: 'n4-104', kanji: 'お祭り', hiragana: 'おまつり', meaning: '축제', level: 4 },
  { id: 'n4-105', kanji: '浅い', hiragana: 'あさい', meaning: '얕다', level: 4 },
  { id: 'n4-106', kanji: '輸入', hiragana: 'ゆにゅう', meaning: '수입', level: 4 },
  { id: 'n4-107', kanji: '人口', hiragana: 'じんこう', meaning: '인구', level: 4 },
  { id: 'n4-108', kanji: '興味', hiragana: 'きょうみ', meaning: '흥미', level: 4 },
  { id: 'n4-109', kanji: '時代', hiragana: 'じだい', meaning: '시대', level: 4 },
  { id: 'n4-110', kanji: '腕', hiragana: 'うで', meaning: '팔', level: 4 },
  { id: 'n4-111', kanji: '気分', hiragana: 'きぶん', meaning: '기분', level: 4 },
  { id: 'n4-112', kanji: '泊まる', hiragana: 'とまる', meaning: '묵다', level: 4 },
  { id: 'n4-113', kanji: '盗む', hiragana: 'ぬすむ', meaning: '훔치다', level: 4 },
  { id: 'n4-114', kanji: '坂', hiragana: 'さか', meaning: '언덕', level: 4 },
  { id: 'n4-115', kanji: '技術', hiragana: 'ぎじゅつ', meaning: '기술', level: 4 },
  { id: 'n4-116', kanji: '小説', hiragana: 'しょうせつ', meaning: '소설', level: 4 },
  { id: 'n4-117', kanji: '調べる', hiragana: 'しらべる', meaning: '조사하다', level: 4 },
  { id: 'n4-118', kanji: '趣味', hiragana: 'しゅみ', meaning: '취미', level: 4 },
  { id: 'n4-119', kanji: '深い', hiragana: 'ふかい', meaning: '깊다', level: 4 },
  { id: 'n4-120', kanji: '林', hiragana: 'はやし', meaning: '숲', level: 4 },
  { id: 'n4-121', kanji: '小学校', hiragana: 'しょうがっこう', meaning: '초등학교', level: 4 },
  { id: 'n4-122', kanji: '気持ち', hiragana: 'きもち', meaning: '기분', level: 4 },
  { id: 'n4-123', kanji: '思い出す', hiragana: 'おもいだす', meaning: '떠올리다', level: 4 },
  { id: 'n4-124', kanji: '必要', hiragana: 'ひつよう', meaning: '필요', level: 4 },
  { id: 'n4-125', kanji: '参加', hiragana: 'さんか', meaning: '참가', level: 4 },
  { id: 'n4-126', kanji: '説明', hiragana: 'せつめい', meaning: '설명', level: 4 },
  { id: 'n4-127', kanji: '準備', hiragana: 'じゅんび', meaning: '준비', level: 4 },
  { id: 'n4-128', kanji: '相談', hiragana: 'そうだん', meaning: '상담', level: 4 },
  { id: 'n4-129', kanji: '決める', hiragana: 'きめる', meaning: '정하다', level: 4 },
  { id: 'n4-130', kanji: '届く', hiragana: 'とどく', meaning: '도착하다', level: 4 },
  { id: 'n4-131', kanji: '落ちる', hiragana: 'おちる', meaning: '떨어지다', level: 4 },
  { id: 'n4-132', kanji: '建てる', hiragana: 'たてる', meaning: '세우다', level: 4 },
  { id: 'n4-133', kanji: '込む', hiragana: 'こむ', meaning: '붐비다', level: 4 },
  { id: 'n4-134', kanji: '間違える', hiragana: 'まちがえる', meaning: '틀리다', level: 4 },
  { id: 'n4-135', kanji: '片付ける', hiragana: 'かたづける', meaning: '정리하다', level: 4 },
  { id: 'n4-136', kanji: '育てる', hiragana: 'そだてる', meaning: '기르다', level: 4 },
  { id: 'n4-137', kanji: '比べる', hiragana: 'くらべる', meaning: '비교하다', level: 4 },
  { id: 'n4-138', kanji: '集める', hiragana: 'あつめる', meaning: '모으다', level: 4 },
  { id: 'n4-139', kanji: '捨てる', hiragana: 'すてる', meaning: '버리다', level: 4 },
  { id: 'n4-140', kanji: '慣れる', hiragana: 'なれる', meaning: '익숙해지다', level: 4 },
  { id: 'n4-141', kanji: '起こす', hiragana: 'おこす', meaning: '깨우다', level: 4 },
  { id: 'n4-142', kanji: '泣く', hiragana: 'なく', meaning: '울다', level: 4 },
  { id: 'n4-143', kanji: '勝つ', hiragana: 'かつ', meaning: '이기다', level: 4 },
  { id: 'n4-144', kanji: '負ける', hiragana: 'まける', meaning: '지다', level: 4 },
  { id: 'n4-145', kanji: '驚く', hiragana: 'おどろく', meaning: '놀라다', level: 4 },
  { id: 'n4-146', kanji: '困る', hiragana: 'こまる', meaning: '곤란하다', level: 4 },
  { id: 'n4-147', kanji: '喜ぶ', hiragana: 'よろこぶ', meaning: '기뻐하다', level: 4 },
  { id: 'n4-148', kanji: '信じる', hiragana: 'しんじる', meaning: '믿다', level: 4 },
  { id: 'n4-149', kanji: '逃げる', hiragana: 'にげる', meaning: '도망가다', level: 4 },
  { id: 'n4-150', kanji: '払う', hiragana: 'はらう', meaning: '지불하다', level: 4 },
  { id: 'n4-151', kanji: '売り場', hiragana: 'うりば', meaning: '매장', level: 4 },
  { id: 'n4-152', kanji: '交換', hiragana: 'こうかん', meaning: '교환', level: 4 },
  { id: 'n4-153', kanji: '予習', hiragana: 'よしゅう', meaning: '예습', level: 4 },
  { id: 'n4-154', kanji: '文化', hiragana: 'ぶんか', meaning: '문화', level: 4 },
  { id: 'n4-155', kanji: '歴史', hiragana: 'れきし', meaning: '역사', level: 4 },
  { id: 'n4-156', kanji: '地理', hiragana: 'ちり', meaning: '지리', level: 4 },
  { id: 'n4-157', kanji: '数学', hiragana: 'すうがく', meaning: '수학', level: 4 },
  { id: 'n4-158', kanji: '科学', hiragana: 'かがく', meaning: '과학', level: 4 },
  { id: 'n4-159', kanji: '政治', hiragana: 'せいじ', meaning: '정치', level: 4 },
  { id: 'n4-160', kanji: '社会', hiragana: 'しゃかい', meaning: '사회', level: 4 },
  { id: 'n4-161', kanji: '国際', hiragana: 'こくさい', meaning: '국제', level: 4 },
  { id: 'n4-162', kanji: '産業', hiragana: 'さんぎょう', meaning: '산업', level: 4 },
  { id: 'n4-163', kanji: '農業', hiragana: 'のうぎょう', meaning: '농업', level: 4 },
  { id: 'n4-164', kanji: '工業', hiragana: 'こうぎょう', meaning: '공업', level: 4 },
  { id: 'n4-165', kanji: '商業', hiragana: 'しょうぎょう', meaning: '상업', level: 4 },
  { id: 'n4-166', kanji: '貿易', hiragana: 'ぼうえき', meaning: '무역', level: 4 },
  { id: 'n4-167', kanji: '輸出', hiragana: 'ゆしゅつ', meaning: '수출', level: 4 },
  { id: 'n4-168', kanji: '原因', hiragana: 'げんいん', meaning: '원인', level: 4 },
  { id: 'n4-169', kanji: '結果', hiragana: 'けっか', meaning: '결과', level: 4 },
  { id: 'n4-170', kanji: '関係', hiragana: 'かんけい', meaning: '관계', level: 4 },
  { id: 'n4-171', kanji: '意見', hiragana: 'いけん', meaning: '의견', level: 4 },
  { id: 'n4-172', kanji: '感想', hiragana: 'かんそう', meaning: '감상', level: 4 },
  { id: 'n4-173', kanji: '印象', hiragana: 'いんしょう', meaning: '인상', level: 4 },
  { id: 'n4-174', kanji: '経験', hiragana: 'けいけん', meaning: '경험', level: 4 },
  { id: 'n4-175', kanji: '習慣', hiragana: 'しゅうかん', meaning: '습관', level: 4 },
  { id: 'n4-176', kanji: '伝統', hiragana: 'でんとう', meaning: '전통', level: 4 },
  { id: 'n4-177', kanji: '将来', hiragana: 'しょうらい', meaning: '장래', level: 4 },
  { id: 'n4-178', kanji: '目的', hiragana: 'もくてき', meaning: '목적', level: 4 },
  { id: 'n4-179', kanji: '計画', hiragana: 'けいかく', meaning: '계획', level: 4 },
  { id: 'n4-180', kanji: '方法', hiragana: 'ほうほう', meaning: '방법', level: 4 },
  { id: 'n4-181', kanji: '代わり', hiragana: 'かわり', meaning: '대신', level: 4 },
  { id: 'n4-182', kanji: '途中', hiragana: 'とちゅう', meaning: '도중', level: 4 },
  { id: 'n4-183', kanji: '反対', hiragana: 'はんたい', meaning: '반대', level: 4 },
  { id: 'n4-184', kanji: '賛成', hiragana: 'さんせい', meaning: '찬성', level: 4 },
  { id: 'n4-185', kanji: '正直', hiragana: 'しょうじき', meaning: '정직', level: 4 },
  { id: 'n4-186', kanji: '親切', hiragana: 'しんせつ', meaning: '친절', level: 4 },
  { id: 'n4-187', kanji: '丁寧', hiragana: 'ていねい', meaning: '정중', level: 4 },
  { id: 'n4-188', kanji: '熱心', hiragana: 'ねっしん', meaning: '열심', level: 4 },
  { id: 'n4-189', kanji: '真面目', hiragana: 'まじめ', meaning: '성실', level: 4 },
  { id: 'n4-190', kanji: '素直', hiragana: 'すなお', meaning: '순수한', level: 4 },
  { id: 'n4-191', kanji: '立派', hiragana: 'りっぱ', meaning: '훌륭한', level: 4 },
  { id: 'n4-192', kanji: '複雑', hiragana: 'ふくざつ', meaning: '복잡', level: 4 },
  { id: 'n4-193', kanji: '簡単', hiragana: 'かんたん', meaning: '간단', level: 4 },
  { id: 'n4-194', kanji: '自由', hiragana: 'じゆう', meaning: '자유', level: 4 },
  { id: 'n4-195', kanji: '平和', hiragana: 'へいわ', meaning: '평화', level: 4 },
  { id: 'n4-196', kanji: '安全', hiragana: 'あんぜん', meaning: '안전', level: 4 },
  { id: 'n4-197', kanji: '危険', hiragana: 'きけん', meaning: '위험', level: 4 },
  { id: 'n4-198', kanji: '普通', hiragana: 'ふつう', meaning: '보통', level: 4 },
  { id: 'n4-199', kanji: '特別', hiragana: 'とくべつ', meaning: '특별', level: 4 },
  { id: 'n4-200', kanji: '急ぐ', hiragana: 'いそぐ', meaning: '서두르다', level: 4 },
]

// ============================================
// N3 레벨 단어 (300개) - 동사, 형용사, 명사
// ============================================
const N3_WORDS: Word[] = [
  // 동사 (1-100)
  { id: 'n3-001', kanji: '決める', hiragana: 'きめる', meaning: '결정하다', level: 3 },
  { id: 'n3-002', kanji: '伝える', hiragana: 'つたえる', meaning: '전하다', level: 3 },
  { id: 'n3-005', kanji: '組む', hiragana: 'くむ', meaning: '조직하다', level: 3 },
  { id: 'n3-006', kanji: '含む', hiragana: 'ふくむ', meaning: '포함하다', level: 3 },
  { id: 'n3-007', kanji: '向かう', hiragana: 'むかう', meaning: '향하다', level: 3 },
  { id: 'n3-008', kanji: '求める', hiragana: 'もとめる', meaning: '구하다', level: 3 },
  { id: 'n3-009', kanji: '得る', hiragana: 'える', meaning: '얻다', level: 3 },
  { id: 'n3-010', kanji: '確かめる', hiragana: 'たしかめる', meaning: '확인하다', level: 3 },
  { id: 'n3-011', kanji: '認める', hiragana: 'みとめる', meaning: '인정하다', level: 3 },
  { id: 'n3-012', kanji: '示す', hiragana: 'しめす', meaning: '보여주다', level: 3 },
  { id: 'n3-013', kanji: '表す', hiragana: 'あらわす', meaning: '나타내다', level: 3 },
  { id: 'n3-014', kanji: '現れる', hiragana: 'あらわれる', meaning: '나타나다', level: 3 },
  { id: 'n3-015', kanji: '生じる', hiragana: 'しょうじる', meaning: '생기다', level: 3 },
  { id: 'n3-016', kanji: '応じる', hiragana: 'おうじる', meaning: '응하다', level: 3 },
  { id: 'n3-017', kanji: '通じる', hiragana: 'つうじる', meaning: '통하다', level: 3 },
  { id: 'n3-018', kanji: '感じる', hiragana: 'かんじる', meaning: '느끼다', level: 3 },
  { id: 'n3-019', kanji: '論じる', hiragana: 'ろんじる', meaning: '논하다', level: 3 },
  { id: 'n3-020', kanji: '投じる', hiragana: 'とうじる', meaning: '던지다', level: 3 },
  { id: 'n3-021', kanji: '保つ', hiragana: 'たもつ', meaning: '유지하다', level: 3 },
  { id: 'n3-022', kanji: '持つ', hiragana: 'もつ', meaning: '가지다', level: 3 },
  { id: 'n3-023', kanji: '待つ', hiragana: 'まつ', meaning: '기다리다', level: 3 },
  { id: 'n3-024', kanji: '立つ', hiragana: 'たつ', meaning: '서다', level: 3 },
  { id: 'n3-025', kanji: '建つ', hiragana: 'たつ', meaning: '세워지다', level: 3 },
  { id: 'n3-026', kanji: '経つ', hiragana: 'たつ', meaning: '지나다', level: 3 },
  { id: 'n3-027', kanji: '役立つ', hiragana: 'やくだつ', meaning: '도움이 되다', level: 3 },
  { id: 'n3-028', kanji: '目立つ', hiragana: 'めだつ', meaning: '눈에 띄다', level: 3 },
  { id: 'n3-029', kanji: '打つ', hiragana: 'うつ', meaning: '치다', level: 3 },
  { id: 'n3-030', kanji: '撃つ', hiragana: 'うつ', meaning: '쏘다', level: 3 },
  { id: 'n3-031', kanji: '移す', hiragana: 'うつす', meaning: '옮기다', level: 3 },
  { id: 'n3-032', kanji: '写す', hiragana: 'うつす', meaning: '베끼다', level: 3 },
  { id: 'n3-033', kanji: '映す', hiragana: 'うつす', meaning: '비추다', level: 3 },
  { id: 'n3-034', kanji: '移る', hiragana: 'うつる', meaning: '옮겨가다', level: 3 },
  { id: 'n3-035', kanji: '映る', hiragana: 'うつる', meaning: '비치다', level: 3 },
  { id: 'n3-036', kanji: '渡す', hiragana: 'わたす', meaning: '건네주다', level: 3 },
  { id: 'n3-037', kanji: '渡る', hiragana: 'わたる', meaning: '건너다', level: 3 },
  { id: 'n3-038', kanji: '返す', hiragana: 'かえす', meaning: '돌려주다', level: 3 },
  { id: 'n3-039', kanji: '返る', hiragana: 'かえる', meaning: '돌아오다', level: 3 },
  { id: 'n3-040', kanji: '戻す', hiragana: 'もどす', meaning: '되돌리다', level: 3 },
  { id: 'n3-041', kanji: '戻る', hiragana: 'もどる', meaning: '돌아가다', level: 3 },
  { id: 'n3-042', kanji: '通す', hiragana: 'とおす', meaning: '통과시키다', level: 3 },
  { id: 'n3-043', kanji: '通る', hiragana: 'とおる', meaning: '지나가다', level: 3 },
  { id: 'n3-044', kanji: '送る', hiragana: 'おくる', meaning: '보내다', level: 3 },
  { id: 'n3-046', kanji: '受ける', hiragana: 'うける', meaning: '받다', level: 3 },
  { id: 'n3-047', kanji: '授ける', hiragana: 'さずける', meaning: '수여하다', level: 3 },
  { id: 'n3-048', kanji: '付ける', hiragana: 'つける', meaning: '붙이다', level: 3 },
  { id: 'n3-049', kanji: '分ける', hiragana: 'わける', meaning: '나누다', level: 3 },
  { id: 'n3-050', kanji: '避ける', hiragana: 'さける', meaning: '피하다', level: 3 },
  { id: 'n3-051', kanji: '続ける', hiragana: 'つづける', meaning: '계속하다', level: 3 },
  { id: 'n3-052', kanji: '助ける', hiragana: 'たすける', meaning: '돕다', level: 3 },
  { id: 'n3-053', kanji: '預ける', hiragana: 'あずける', meaning: '맡기다', level: 3 },
  { id: 'n3-054', kanji: '預かる', hiragana: 'あずかる', meaning: '맡다', level: 3 },
  { id: 'n3-055', kanji: '掛ける', hiragana: 'かける', meaning: '걸다', level: 3 },
  { id: 'n3-056', kanji: '掛かる', hiragana: 'かかる', meaning: '걸리다', level: 3 },
  { id: 'n3-057', kanji: '架かる', hiragana: 'かかる', meaning: '놓이다', level: 3 },
  { id: 'n3-058', kanji: '向ける', hiragana: 'むける', meaning: '향하게 하다', level: 3 },
  { id: 'n3-059', kanji: '向く', hiragana: 'むく', meaning: '향하다', level: 3 },
  { id: 'n3-060', kanji: '進める', hiragana: 'すすめる', meaning: '진행시키다', level: 3 },
  { id: 'n3-061', kanji: '進む', hiragana: 'すすむ', meaning: '나아가다', level: 3 },
  { id: 'n3-062', kanji: '勧める', hiragana: 'すすめる', meaning: '권하다', level: 3 },
  { id: 'n3-063', kanji: '決まる', hiragana: 'きまる', meaning: '정해지다', level: 3 },
  { id: 'n3-064', kanji: '定まる', hiragana: 'さだまる', meaning: '정해지다', level: 3 },
  { id: 'n3-065', kanji: '集まる', hiragana: 'あつまる', meaning: '모이다', level: 3 },
  { id: 'n3-067', kanji: '広まる', hiragana: 'ひろまる', meaning: '퍼지다', level: 3 },
  { id: 'n3-068', kanji: '広める', hiragana: 'ひろめる', meaning: '퍼뜨리다', level: 3 },
  { id: 'n3-069', kanji: '深まる', hiragana: 'ふかまる', meaning: '깊어지다', level: 3 },
  { id: 'n3-070', kanji: '深める', hiragana: 'ふかめる', meaning: '깊게 하다', level: 3 },
  { id: 'n3-071', kanji: '高まる', hiragana: 'たかまる', meaning: '높아지다', level: 3 },
  { id: 'n3-072', kanji: '高める', hiragana: 'たかめる', meaning: '높이다', level: 3 },
  { id: 'n3-073', kanji: '強まる', hiragana: 'つよまる', meaning: '강해지다', level: 3 },
  { id: 'n3-074', kanji: '強める', hiragana: 'つよめる', meaning: '강화하다', level: 3 },
  { id: 'n3-075', kanji: '弱まる', hiragana: 'よわまる', meaning: '약해지다', level: 3 },
  { id: 'n3-076', kanji: '弱める', hiragana: 'よわめる', meaning: '약화시키다', level: 3 },
  { id: 'n3-077', kanji: '暖まる', hiragana: 'あたたまる', meaning: '따뜻해지다', level: 3 },
  { id: 'n3-078', kanji: '暖める', hiragana: 'あたためる', meaning: '데우다', level: 3 },
  { id: 'n3-079', kanji: '固まる', hiragana: 'かたまる', meaning: '굳어지다', level: 3 },
  { id: 'n3-080', kanji: '固める', hiragana: 'かためる', meaning: '굳히다', level: 3 },
  { id: 'n3-081', kanji: '纏まる', hiragana: 'まとまる', meaning: '정리되다', level: 3 },
  { id: 'n3-082', kanji: '纏める', hiragana: 'まとめる', meaning: '정리하다', level: 3 },
  { id: 'n3-083', kanji: '治まる', hiragana: 'おさまる', meaning: '가라앉다', level: 3 },
  { id: 'n3-084', kanji: '治める', hiragana: 'おさめる', meaning: '다스리다', level: 3 },
  { id: 'n3-085', kanji: '収まる', hiragana: 'おさまる', meaning: '들어맞다', level: 3 },
  { id: 'n3-086', kanji: '収める', hiragana: 'おさめる', meaning: '거두다', level: 3 },
  { id: 'n3-087', kanji: '抑える', hiragana: 'おさえる', meaning: '억제하다', level: 3 },
  { id: 'n3-088', kanji: '押さえる', hiragana: 'おさえる', meaning: '누르다', level: 3 },
  { id: 'n3-089', kanji: '捕まえる', hiragana: 'つかまえる', meaning: '잡다', level: 3 },
  { id: 'n3-090', kanji: '捕まる', hiragana: 'つかまる', meaning: '잡히다', level: 3 },
  { id: 'n3-091', kanji: '握る', hiragana: 'にぎる', meaning: '쥐다', level: 3 },
  { id: 'n3-092', kanji: '掴む', hiragana: 'つかむ', meaning: '움켜쥐다', level: 3 },
  { id: 'n3-093', kanji: '挟む', hiragana: 'はさむ', meaning: '끼우다', level: 3 },
  { id: 'n3-094', kanji: '刺す', hiragana: 'さす', meaning: '찌르다', level: 3 },
  { id: 'n3-095', kanji: '指す', hiragana: 'さす', meaning: '가리키다', level: 3 },
  { id: 'n3-096', kanji: '差す', hiragana: 'さす', meaning: '비추다', level: 3 },
  { id: 'n3-097', kanji: '注ぐ', hiragana: 'そそぐ', meaning: '붓다', level: 3 },
  { id: 'n3-098', kanji: '注ぐ', hiragana: 'つぐ', meaning: '따르다', level: 3 },
  { id: 'n3-099', kanji: '防ぐ', hiragana: 'ふせぐ', meaning: '막다', level: 3 },
  { id: 'n3-100', kanji: '塞ぐ', hiragana: 'ふさぐ', meaning: '막다', level: 3 },
  // 형용사 (101-150)
  { id: 'n3-101', kanji: '厳しい', hiragana: 'きびしい', meaning: '엄격한', level: 3 },
  { id: 'n3-102', kanji: '激しい', hiragana: 'はげしい', meaning: '격렬한', level: 3 },
  { id: 'n3-103', kanji: '珍しい', hiragana: 'めずらしい', meaning: '드문', level: 3 },
  { id: 'n3-104', kanji: '恐ろしい', hiragana: 'おそろしい', meaning: '무서운', level: 3 },
  { id: 'n3-105', kanji: '悔しい', hiragana: 'くやしい', meaning: '분한', level: 3 },
  { id: 'n3-106', kanji: '恥ずかしい', hiragana: 'はずかしい', meaning: '부끄러운', level: 3 },
  { id: 'n3-107', kanji: '懐かしい', hiragana: 'なつかしい', meaning: '그리운', level: 3 },
  { id: 'n3-108', kanji: '羨ましい', hiragana: 'うらやましい', meaning: '부러운', level: 3 },
  { id: 'n3-109', kanji: '喧しい', hiragana: 'やかましい', meaning: '시끄러운', level: 3 },
  { id: 'n3-110', kanji: '煩い', hiragana: 'うるさい', meaning: '시끄러운', level: 3 },
  { id: 'n3-111', kanji: '詳しい', hiragana: 'くわしい', meaning: '자세한', level: 3 },
  { id: 'n3-112', kanji: '正しい', hiragana: 'ただしい', meaning: '올바른', level: 3 },
  { id: 'n3-113', kanji: '等しい', hiragana: 'ひとしい', meaning: '같은', level: 3 },
  { id: 'n3-114', kanji: '親しい', hiragana: 'したしい', meaning: '친한', level: 3 },
  { id: 'n3-115', kanji: '貧しい', hiragana: 'まずしい', meaning: '가난한', level: 3 },
  { id: 'n3-116', kanji: '乏しい', hiragana: 'とぼしい', meaning: '부족한', level: 3 },
  { id: 'n3-117', kanji: '賢い', hiragana: 'かしこい', meaning: '현명한', level: 3 },
  { id: 'n3-118', kanji: '鋭い', hiragana: 'するどい', meaning: '날카로운', level: 3 },
  { id: 'n3-119', kanji: '鈍い', hiragana: 'にぶい', meaning: '둔한', level: 3 },
  { id: 'n3-120', kanji: '怪しい', hiragana: 'あやしい', meaning: '수상한', level: 3 },
  { id: 'n3-121', kanji: '著しい', hiragana: 'いちじるしい', meaning: '현저한', level: 3 },
  { id: 'n3-122', kanji: '眩しい', hiragana: 'まぶしい', meaning: '눈부신', level: 3 },
  { id: 'n3-123', kanji: '忙しい', hiragana: 'いそがしい', meaning: '바쁜', level: 3 },
  { id: 'n3-124', kanji: '苦しい', hiragana: 'くるしい', meaning: '괴로운', level: 3 },
  { id: 'n3-125', kanji: '楽しい', hiragana: 'たのしい', meaning: '즐거운', level: 3 },
  { id: 'n3-126', kanji: '嬉しい', hiragana: 'うれしい', meaning: '기쁜', level: 3 },
  { id: 'n3-127', kanji: '悲しい', hiragana: 'かなしい', meaning: '슬픈', level: 3 },
  { id: 'n3-128', kanji: '寂しい', hiragana: 'さびしい', meaning: '쓸쓸한', level: 3 },
  { id: 'n3-129', kanji: '淋しい', hiragana: 'さみしい', meaning: '외로운', level: 3 },
  { id: 'n3-130', kanji: '素晴らしい', hiragana: 'すばらしい', meaning: '훌륭한', level: 3 },
  { id: 'n3-131', kanji: '相応しい', hiragana: 'ふさわしい', meaning: '어울리는', level: 3 },
  { id: 'n3-132', kanji: '望ましい', hiragana: 'のぞましい', meaning: '바람직한', level: 3 },
  { id: 'n3-133', kanji: '好ましい', hiragana: 'このましい', meaning: '호감이 가는', level: 3 },
  { id: 'n3-134', kanji: '疑わしい', hiragana: 'うたがわしい', meaning: '의심스러운', level: 3 },
  { id: 'n3-135', kanji: '頼もしい', hiragana: 'たのもしい', meaning: '믿음직한', level: 3 },
  { id: 'n3-136', kanji: '逞しい', hiragana: 'たくましい', meaning: '건장한', level: 3 },
  { id: 'n3-137', kanji: '甚だしい', hiragana: 'はなはだしい', meaning: '심한', level: 3 },
  { id: 'n3-138', kanji: '物凄い', hiragana: 'ものすごい', meaning: '엄청난', level: 3 },
  { id: 'n3-139', kanji: '凄い', hiragana: 'すごい', meaning: '대단한', level: 3 },
  { id: 'n3-140', kanji: '偉い', hiragana: 'えらい', meaning: '대단한', level: 3 },
  { id: 'n3-141', kanji: '酷い', hiragana: 'ひどい', meaning: '심한', level: 3 },
  { id: 'n3-142', kanji: '辛い', hiragana: 'からい', meaning: '매운', level: 3 },
  { id: 'n3-143', kanji: '辛い', hiragana: 'つらい', meaning: '힘든', level: 3 },
  { id: 'n3-144', kanji: '堅い', hiragana: 'かたい', meaning: '단단한', level: 3 },
  { id: 'n3-145', kanji: '柔らかい', hiragana: 'やわらかい', meaning: '부드러운', level: 3 },
  { id: 'n3-146', kanji: '温かい', hiragana: 'あたたかい', meaning: '따뜻한', level: 3 },
  { id: 'n3-147', kanji: '冷たい', hiragana: 'つめたい', meaning: '차가운', level: 3 },
  { id: 'n3-148', kanji: '涼しい', hiragana: 'すずしい', meaning: '시원한', level: 3 },
  { id: 'n3-149', kanji: '蒸し暑い', hiragana: 'むしあつい', meaning: '무더운', level: 3 },
  { id: 'n3-150', kanji: '生温い', hiragana: 'なまぬるい', meaning: '미지근한', level: 3 },
  // 명사 (151-300)
  { id: 'n3-153', kanji: '環境', hiragana: 'かんきょう', meaning: '환경', level: 3 },
  { id: 'n3-156', kanji: '医学', hiragana: 'いがく', meaning: '의학', level: 3 },
  { id: 'n3-157', kanji: '心理', hiragana: 'しんり', meaning: '심리', level: 3 },
  { id: 'n3-158', kanji: '哲学', hiragana: 'てつがく', meaning: '철학', level: 3 },
  { id: 'n3-159', kanji: '宗教', hiragana: 'しゅうきょう', meaning: '종교', level: 3 },
  { id: 'n3-160', kanji: '芸術', hiragana: 'げいじゅつ', meaning: '예술', level: 3 },
  { id: 'n3-161', kanji: '建築', hiragana: 'けんちく', meaning: '건축', level: 3 },
  { id: 'n3-162', kanji: '設計', hiragana: 'せっけい', meaning: '설계', level: 3 },
  { id: 'n3-163', kanji: '製造', hiragana: 'せいぞう', meaning: '제조', level: 3 },
  { id: 'n3-164', kanji: '開発', hiragana: 'かいはつ', meaning: '개발', level: 3 },
  { id: 'n3-165', kanji: '研究', hiragana: 'けんきゅう', meaning: '연구', level: 3 },
  { id: 'n3-166', kanji: '調査', hiragana: 'ちょうさ', meaning: '조사', level: 3 },
  { id: 'n3-167', kanji: '実験', hiragana: 'じっけん', meaning: '실험', level: 3 },
  { id: 'n3-168', kanji: '分析', hiragana: 'ぶんせき', meaning: '분석', level: 3 },
  { id: 'n3-169', kanji: '結論', hiragana: 'けつろん', meaning: '결론', level: 3 },
  { id: 'n3-170', kanji: '理論', hiragana: 'りろん', meaning: '이론', level: 3 },
  { id: 'n3-171', kanji: '根拠', hiragana: 'こんきょ', meaning: '근거', level: 3 },
  { id: 'n3-172', kanji: '証拠', hiragana: 'しょうこ', meaning: '증거', level: 3 },
  { id: 'n3-173', kanji: '事実', hiragana: 'じじつ', meaning: '사실', level: 3 },
  { id: 'n3-174', kanji: '現実', hiragana: 'げんじつ', meaning: '현실', level: 3 },
  { id: 'n3-175', kanji: '理想', hiragana: 'りそう', meaning: '이상', level: 3 },
  { id: 'n3-176', kanji: '目標', hiragana: 'もくひょう', meaning: '목표', level: 3 },
  { id: 'n3-177', kanji: '課題', hiragana: 'かだい', meaning: '과제', level: 3 },
  { id: 'n3-179', kanji: '解決', hiragana: 'かいけつ', meaning: '해결', level: 3 },
  { id: 'n3-180', kanji: '対策', hiragana: 'たいさく', meaning: '대책', level: 3 },
  { id: 'n3-181', kanji: '方針', hiragana: 'ほうしん', meaning: '방침', level: 3 },
  { id: 'n3-182', kanji: '戦略', hiragana: 'せんりゃく', meaning: '전략', level: 3 },
  { id: 'n3-183', kanji: '戦術', hiragana: 'せんじゅつ', meaning: '전술', level: 3 },
  { id: 'n3-184', kanji: '作戦', hiragana: 'さくせん', meaning: '작전', level: 3 },
  { id: 'n3-185', kanji: '競争', hiragana: 'きょうそう', meaning: '경쟁', level: 3 },
  { id: 'n3-186', kanji: '協力', hiragana: 'きょうりょく', meaning: '협력', level: 3 },
  { id: 'n3-187', kanji: '連携', hiragana: 'れんけい', meaning: '연계', level: 3 },
  { id: 'n3-188', kanji: '交流', hiragana: 'こうりゅう', meaning: '교류', level: 3 },
  { id: 'n3-189', kanji: '貢献', hiragana: 'こうけん', meaning: '공헌', level: 3 },
  { id: 'n3-190', kanji: '奉仕', hiragana: 'ほうし', meaning: '봉사', level: 3 },
  { id: 'n3-191', kanji: '犠牲', hiragana: 'ぎせい', meaning: '희생', level: 3 },
  { id: 'n3-192', kanji: '努力', hiragana: 'どりょく', meaning: '노력', level: 3 },
  { id: 'n3-193', kanji: '挑戦', hiragana: 'ちょうせん', meaning: '도전', level: 3 },
  { id: 'n3-194', kanji: '冒険', hiragana: 'ぼうけん', meaning: '모험', level: 3 },
  { id: 'n3-195', kanji: '成功', hiragana: 'せいこう', meaning: '성공', level: 3 },
  { id: 'n3-197', kanji: '勝利', hiragana: 'しょうり', meaning: '승리', level: 3 },
  { id: 'n3-198', kanji: '敗北', hiragana: 'はいぼく', meaning: '패배', level: 3 },
  { id: 'n3-199', kanji: '記録', hiragana: 'きろく', meaning: '기록', level: 3 },
  { id: 'n3-204', kanji: '風習', hiragana: 'ふうしゅう', meaning: '풍습', level: 3 },
  { id: 'n3-205', kanji: '儀式', hiragana: 'ぎしき', meaning: '의식', level: 3 },
  { id: 'n3-206', kanji: '行事', hiragana: 'ぎょうじ', meaning: '행사', level: 3 },
  { id: 'n3-207', kanji: '催し', hiragana: 'もよおし', meaning: '행사', level: 3 },
  { id: 'n3-208', kanji: '祭り', hiragana: 'まつり', meaning: '축제', level: 3 },
  { id: 'n3-209', kanji: '式典', hiragana: 'しきてん', meaning: '식전', level: 3 },
  { id: 'n3-210', kanji: '典礼', hiragana: 'てんれい', meaning: '전례', level: 3 },
  { id: 'n3-211', kanji: '地域', hiragana: 'ちいき', meaning: '지역', level: 3 },
  { id: 'n3-212', kanji: '地区', hiragana: 'ちく', meaning: '지구', level: 3 },
  { id: 'n3-213', kanji: '地方', hiragana: 'ちほう', meaning: '지방', level: 3 },
  { id: 'n3-214', kanji: '都市', hiragana: 'とし', meaning: '도시', level: 3 },
  { id: 'n3-215', kanji: '首都', hiragana: 'しゅと', meaning: '수도', level: 3 },
  { id: 'n3-216', kanji: '国家', hiragana: 'こっか', meaning: '국가', level: 3 },
  { id: 'n3-217', kanji: '政府', hiragana: 'せいふ', meaning: '정부', level: 3 },
  { id: 'n3-218', kanji: '議会', hiragana: 'ぎかい', meaning: '의회', level: 3 },
  { id: 'n3-219', kanji: '内閣', hiragana: 'ないかく', meaning: '내각', level: 3 },
  { id: 'n3-220', kanji: '大臣', hiragana: 'だいじん', meaning: '장관', level: 3 },
  { id: 'n3-221', kanji: '議員', hiragana: 'ぎいん', meaning: '의원', level: 3 },
  { id: 'n3-222', kanji: '選挙', hiragana: 'せんきょ', meaning: '선거', level: 3 },
  { id: 'n3-223', kanji: '投票', hiragana: 'とうひょう', meaning: '투표', level: 3 },
  { id: 'n3-224', kanji: '政党', hiragana: 'せいとう', meaning: '정당', level: 3 },
  { id: 'n3-225', kanji: '野党', hiragana: 'やとう', meaning: '야당', level: 3 },
  { id: 'n3-226', kanji: '与党', hiragana: 'よとう', meaning: '여당', level: 3 },
  { id: 'n3-227', kanji: '世論', hiragana: 'よろん', meaning: '여론', level: 3 },
  { id: 'n3-228', kanji: '報道', hiragana: 'ほうどう', meaning: '보도', level: 3 },
  { id: 'n3-229', kanji: '出版', hiragana: 'しゅっぱん', meaning: '출판', level: 3 },
  { id: 'n3-230', kanji: '雑誌', hiragana: 'ざっし', meaning: '잡지', level: 3 },
  { id: 'n3-231', kanji: '記事', hiragana: 'きじ', meaning: '기사', level: 3 },
  { id: 'n3-232', kanji: '番組', hiragana: 'ばんぐみ', meaning: '프로그램', level: 3 },
  { id: 'n3-233', kanji: '放送', hiragana: 'ほうそう', meaning: '방송', level: 3 },
  { id: 'n3-234', kanji: '通信', hiragana: 'つうしん', meaning: '통신', level: 3 },
  { id: 'n3-235', kanji: '情報', hiragana: 'じょうほう', meaning: '정보', level: 3 },
  { id: 'n3-236', kanji: '資料', hiragana: 'しりょう', meaning: '자료', level: 3 },
  { id: 'n3-237', kanji: '書類', hiragana: 'しょるい', meaning: '서류', level: 3 },
  { id: 'n3-238', kanji: '文書', hiragana: 'ぶんしょ', meaning: '문서', level: 3 },
  { id: 'n3-239', kanji: '契約', hiragana: 'けいやく', meaning: '계약', level: 3 },
  { id: 'n3-240', kanji: '条件', hiragana: 'じょうけん', meaning: '조건', level: 3 },
  { id: 'n3-243', kanji: '制度', hiragana: 'せいど', meaning: '제도', level: 3 },
  { id: 'n3-244', kanji: '組織', hiragana: 'そしき', meaning: '조직', level: 3 },
  { id: 'n3-245', kanji: '機構', hiragana: 'きこう', meaning: '기구', level: 3 },
  { id: 'n3-246', kanji: '構造', hiragana: 'こうぞう', meaning: '구조', level: 3 },
  { id: 'n3-247', kanji: '仕組み', hiragana: 'しくみ', meaning: '구조', level: 3 },
  { id: 'n3-248', kanji: '体制', hiragana: 'たいせい', meaning: '체제', level: 3 },
  { id: 'n3-249', kanji: '態勢', hiragana: 'たいせい', meaning: '태세', level: 3 },
  { id: 'n3-250', kanji: '姿勢', hiragana: 'しせい', meaning: '자세', level: 3 },
  { id: 'n3-251', kanji: '態度', hiragana: 'たいど', meaning: '태도', level: 3 },
  { id: 'n3-252', kanji: '行動', hiragana: 'こうどう', meaning: '행동', level: 3 },
  { id: 'n3-253', kanji: '活動', hiragana: 'かつどう', meaning: '활동', level: 3 },
  { id: 'n3-255', kanji: '動作', hiragana: 'どうさ', meaning: '동작', level: 3 },
  { id: 'n3-256', kanji: '操作', hiragana: 'そうさ', meaning: '조작', level: 3 },
  { id: 'n3-257', kanji: '作業', hiragana: 'さぎょう', meaning: '작업', level: 3 },
  { id: 'n3-258', kanji: '仕事', hiragana: 'しごと', meaning: '일', level: 3 },
  { id: 'n3-259', kanji: '任務', hiragana: 'にんむ', meaning: '임무', level: 3 },
  { id: 'n3-260', kanji: '義務', hiragana: 'ぎむ', meaning: '의무', level: 3 },
  { id: 'n3-261', kanji: '責任', hiragana: 'せきにん', meaning: '책임', level: 3 },
  { id: 'n3-262', kanji: '権利', hiragana: 'けんり', meaning: '권리', level: 3 },
  { id: 'n3-264', kanji: '平等', hiragana: 'びょうどう', meaning: '평등', level: 3 },
  { id: 'n3-265', kanji: '公平', hiragana: 'こうへい', meaning: '공평', level: 3 },
  { id: 'n3-266', kanji: '正義', hiragana: 'せいぎ', meaning: '정의', level: 3 },
  { id: 'n3-267', kanji: '道徳', hiragana: 'どうとく', meaning: '도덕', level: 3 },
  { id: 'n3-268', kanji: '倫理', hiragana: 'りんり', meaning: '윤리', level: 3 },
  { id: 'n3-269', kanji: '価値', hiragana: 'かち', meaning: '가치', level: 3 },
  { id: 'n3-270', kanji: '意義', hiragana: 'いぎ', meaning: '의의', level: 3 },
  { id: 'n3-271', kanji: '意味', hiragana: 'いみ', meaning: '의미', level: 3 },
  { id: 'n3-272', kanji: '概念', hiragana: 'がいねん', meaning: '개념', level: 3 },
  { id: 'n3-273', kanji: '定義', hiragana: 'ていぎ', meaning: '정의', level: 3 },
  { id: 'n3-274', kanji: '範囲', hiragana: 'はんい', meaning: '범위', level: 3 },
  { id: 'n3-275', kanji: '程度', hiragana: 'ていど', meaning: '정도', level: 3 },
  { id: 'n3-276', kanji: '基準', hiragana: 'きじゅん', meaning: '기준', level: 3 },
  { id: 'n3-277', kanji: '標準', hiragana: 'ひょうじゅん', meaning: '표준', level: 3 },
  { id: 'n3-278', kanji: '水準', hiragana: 'すいじゅん', meaning: '수준', level: 3 },
  { id: 'n3-279', kanji: '段階', hiragana: 'だんかい', meaning: '단계', level: 3 },
  { id: 'n3-280', kanji: '過程', hiragana: 'かてい', meaning: '과정', level: 3 },
  { id: 'n3-281', kanji: '経過', hiragana: 'けいか', meaning: '경과', level: 3 },
  { id: 'n3-282', kanji: '進行', hiragana: 'しんこう', meaning: '진행', level: 3 },
  { id: 'n3-283', kanji: '発展', hiragana: 'はってん', meaning: '발전', level: 3 },
  { id: 'n3-284', kanji: '成長', hiragana: 'せいちょう', meaning: '성장', level: 3 },
  { id: 'n3-285', kanji: '変化', hiragana: 'へんか', meaning: '변화', level: 3 },
  { id: 'n3-286', kanji: '影響', hiragana: 'えいきょう', meaning: '영향', level: 3 },
  { id: 'n3-287', kanji: '効果', hiragana: 'こうか', meaning: '효과', level: 3 },
  { id: 'n3-289', kanji: '成果', hiragana: 'せいか', meaning: '성과', level: 3 },
  { id: 'n3-290', kanji: '業績', hiragana: 'ぎょうせき', meaning: '업적', level: 3 },
  { id: 'n3-291', kanji: '実績', hiragana: 'じっせき', meaning: '실적', level: 3 },
  { id: 'n3-292', kanji: '評価', hiragana: 'ひょうか', meaning: '평가', level: 3 },
  { id: 'n3-293', kanji: '批判', hiragana: 'ひはん', meaning: '비판', level: 3 },
  { id: 'n3-295', kanji: '提案', hiragana: 'ていあん', meaning: '제안', level: 3 },
  { id: 'n3-296', kanji: '企画', hiragana: 'きかく', meaning: '기획', level: 3 },
  { id: 'n3-298', kanji: '予算', hiragana: 'よさん', meaning: '예산', level: 3 },
  { id: 'n3-299', kanji: '費用', hiragana: 'ひよう', meaning: '비용', level: 3 },
  { id: 'n3-300', kanji: '収入', hiragana: 'しゅうにゅう', meaning: '수입', level: 3 },
]

// ============================================
// 전체 단어 배열 (N5 100개 + N4 200개 + N3 300개 = 600개)
// N4/N3 일부는 ext 파일에서 예문을 머지
// ============================================
import { WORD_EXAMPLES_EXT } from './words-ext'

function mergeExamples(words: Word[]): Word[] {
  return words.map((w) => {
    if (w.example) return w
    const ext = WORD_EXAMPLES_EXT[w.id]
    return ext ? { ...w, example: ext } : w
  })
}

// JLPT 단어 우선 + 회화 토큰 자동 추가(중복 제거).
// 회화 단어가 JLPT 사전과 (kanji, hiragana)가 같으면 JLPT 단어를 유지.
const JLPT_WORDS = mergeExamples([...N5_WORDS, ...N4_WORDS, ...N3_WORDS, ...N2_WORDS, ...N1_WORDS])
const jlptKeys = new Set(JLPT_WORDS.map((w) => `${w.kanji}|${w.hiragana}`))
const CONV_WORDS = extractWordsFromConversations().filter(
  (w) => !jlptKeys.has(`${w.kanji}|${w.hiragana}`),
)
export const WORDS: Word[] = [...JLPT_WORDS, ...CONV_WORDS]

// 랜덤 셔플 함수
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// 단어 ID로 단어 찾기
export function getWordById(id: string): Word | undefined {
  return WORDS.find((w) => w.id === id)
}

// 레벨별 단어 가져오기
export function getWordsByLevel(level: number): Word[] {
  return WORDS.filter((w) => w.level === level)
}

// 학습용 단어 가져오기
// 우선순위: SRS due 단어 → 오답노트 단어 → 신규 단어 (대략 40/20/40 비율)
// favoritesOnly=true면 즐겨찾기 단어 풀에서만 학습
// weakOnly=true면 약점(오답률 높거나 ease 낮은) 단어만 풀로 사용
export function getLearningWords(
  count: number = 20,
  favoritesOnly = false,
  weakOnly = false,
): Word[] {
  const { wrongWordIds, getDueWordIds, favoriteWords, wordSrs } = useAppStore.getState()

  // 즐겨찾기 전용 모드 — favoriteWords 풀에서만 추출
  if (favoritesOnly) {
    const favPool = favoriteWords
      .map((id) => getWordById(id))
      .filter((w): w is Word => !!w)
    return shuffleArray(favPool).slice(0, count)
  }

  // 약점 전용 모드 — wrongWordIds + SRS에서 ease<2.0 또는 wrongCount>correctCount
  if (weakOnly) {
    const weakIds = new Set<string>(wrongWordIds)
    for (const s of Object.values(wordSrs)) {
      if (s.ease < 2.0 || s.wrongCount > s.correctCount) {
        weakIds.add(s.wordId)
      }
    }
    const weakPool = Array.from(weakIds)
      .map((id) => getWordById(id))
      .filter((w): w is Word => !!w)
    if (weakPool.length === 0) {
      // 약점 없으면 일반 학습으로 폴백
      return getLearningWords(count, false, false)
    }
    return shuffleArray(weakPool).slice(0, count)
  }

  const selected: Word[] = []
  const used = new Set<string>()
  const pushWord = (w: Word | undefined) => {
    if (!w || used.has(w.id)) return
    selected.push(w)
    used.add(w.id)
  }

  // 1) SRS 만기 단어 (최대 count의 40%)
  const dueIds = getDueWordIds()
  const dueQuota = Math.floor(count * 0.4)
  for (const id of dueIds) {
    if (selected.length >= dueQuota) break
    pushWord(getWordById(id))
  }

  // 2) 오답노트 단어 (최대 count의 20% — SRS 미포함분)
  const wrongQuota = selected.length + Math.floor(count * 0.2)
  for (const id of shuffleArray(wrongWordIds)) {
    if (selected.length >= wrongQuota) break
    pushWord(getWordById(id))
  }

  // 3) 나머지는 신규 단어로 채움
  const remainingCount = count - selected.length
  if (remainingCount > 0) {
    const newPool = WORDS.filter((w) => !used.has(w.id))
    const picked = shuffleArray(newPool).slice(0, remainingCount)
    picked.forEach(pushWord)
  }

  return shuffleArray(selected)
}

// 저장된 학습 세션 복원용 — 단어 id를 현재 WORDS에서 다시 조회.
// 객체를 얼려 저장하지 않으므로, 단어 데이터 수정이 이어하기 세션에도 반영된다.
// 해석 안 되는 id(삭제된 단어 등)는 제외 — 호출부가 길이를 검사해 무효화 판단.
export function resolveWordsByIds(ids: string[]): Word[] {
  const byId = new Map(WORDS.map((w) => [w.id, w]))
  return ids
    .map((id) => byId.get(id))
    .filter((w): w is Word => w !== undefined)
}

// 오답노트 단어 가져오기
export function getWrongWords(): Word[] {
  const { wrongWordIds } = useAppStore.getState()
  return wrongWordIds
    .map((id) => getWordById(id))
    .filter((w): w is Word => w !== undefined)
}

// 통계
export const WORD_STATS = {
  total: WORDS.length,
  n5: N5_WORDS.length,
  n4: N4_WORDS.length,
  n3: N3_WORDS.length,
  n2: N2_WORDS.length,
  n1: N1_WORDS.length,
}
