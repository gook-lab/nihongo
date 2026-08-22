// firebase/auth를 dynamic import로 lazy 로드 — 첫 진입 78KB 청크 + iframe 90KB를 LCP에서 제외.
// firebase/app은 가볍게 sync 유지 (Firestore 등도 같은 app 인스턴스 공유).
import { initializeApp, type FirebaseApp } from 'firebase/app'
import type {
  Auth,
  User as FirebaseUser,
  GoogleAuthProvider as GoogleAuthProviderType,
  OAuthProvider as OAuthProviderType,
} from 'firebase/auth'
import type { User } from '@/types'
import { reportError } from './sentry'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

let app: FirebaseApp | null = null
let auth: Auth | null = null
let authModulePromise: Promise<typeof import('firebase/auth')> | null = null

const isConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)

if (isConfigured) {
  try {
    app = initializeApp(firebaseConfig)
  } catch (error) {
    console.warn('Firebase 초기화 실패:', error)
    reportError(error, {
      type: 'auth',
      level: 'fatal',
      tags: { operation: 'init' },
    })
  }
}

// firebase/auth 모듈을 lazy 로드 + auth 인스턴스 생성. 첫 호출 후 캐시.
async function loadAuth(): Promise<{ mod: typeof import('firebase/auth'); auth: Auth }> {
  if (!app) throw new Error('Firebase app not initialized')
  if (!authModulePromise) {
    authModulePromise = import('firebase/auth')
  }
  const mod = await authModulePromise
  if (!auth) {
    auth = mod.getAuth(app)
  }
  return { mod, auth }
}

// Firebase User를 앱 User로 변환 — sync 유지 (firebase/auth 타입만 필요)
export function firebaseUserToAppUser(
  firebaseUser: FirebaseUser,
  provider: User['provider'],
): User {
  return {
    id: firebaseUser.uid,
    provider,
    nickname: firebaseUser.displayName || '학습자',
    email: firebaseUser.email || undefined,
    profileImage: firebaseUser.photoURL || undefined,
  }
}

// Google 로그인
export async function signInWithGoogle(): Promise<User> {
  const { mod, auth } = await loadAuth()
  const provider = new mod.GoogleAuthProvider()
  const result = await mod.signInWithPopup(auth, provider)
  return firebaseUserToAppUser(result.user, 'google')
}

// 이메일/비밀번호 회원가입
export async function signUpWithEmail(
  email: string,
  password: string,
  nickname: string,
): Promise<User> {
  const { mod, auth } = await loadAuth()
  const result = await mod.createUserWithEmailAndPassword(auth, email, password)
  if (nickname.trim()) {
    await mod.updateProfile(result.user, { displayName: nickname.trim() })
  }
  return firebaseUserToAppUser(
    { ...result.user, displayName: nickname.trim() || result.user.displayName } as FirebaseUser,
    'email',
  )
}

// 이메일/비밀번호 로그인
export async function signInWithEmail(email: string, password: string): Promise<User> {
  const { mod, auth } = await loadAuth()
  const result = await mod.signInWithEmailAndPassword(auth, email, password)
  return firebaseUserToAppUser(result.user, 'email')
}

// 이메일 사용자 비밀번호 재인증
export async function reauthenticateWithPassword(password: string): Promise<void> {
  const { mod, auth } = await loadAuth()
  if (!auth.currentUser?.email) {
    throw new Error('이메일 정보가 없습니다.')
  }
  const credential = mod.EmailAuthProvider.credential(auth.currentUser.email, password)
  await mod.reauthenticateWithCredential(auth.currentUser, credential)
}

// 카카오 로그인
export async function signInWithKakao(): Promise<User> {
  const { mod, auth } = await loadAuth()
  const kakaoProvider = new mod.OAuthProvider('oidc.kakao')
  const result = await mod.signInWithPopup(auth, kakaoProvider)
  return firebaseUserToAppUser(result.user, 'kakao')
}

// 네이버 로그인
export async function signInWithNaver(): Promise<User> {
  const { mod, auth } = await loadAuth()
  const naverProvider = new mod.OAuthProvider('oidc.naver')
  const result = await mod.signInWithPopup(auth, naverProvider)
  return firebaseUserToAppUser(result.user, 'naver')
}

// 로그아웃
export async function firebaseSignOut(): Promise<void> {
  if (!auth) return // 한 번도 로드 안 됐으면 그냥 리턴 (로그인 상태일 수 없음)
  const { mod } = await loadAuth()
  await mod.signOut(auth)
}

// 인증 상태 감시 — 첫 호출 시 firebase/auth lazy 로드 후 구독.
// 반환은 Promise<unsubscribe>. callback은 firebase/auth 로드 후 첫 fire.
export function onAuthChange(
  callback: (user: FirebaseUser | null) => void,
): () => void {
  if (!isConfigured || !app) {
    callback(null)
    return () => {}
  }
  let unsub: (() => void) | null = null
  let cancelled = false
  loadAuth()
    .then(({ mod, auth }) => {
      if (cancelled) return
      unsub = mod.onAuthStateChanged(auth, callback)
    })
    .catch((e) => {
      console.warn('firebase/auth load failed:', e)
      callback(null)
    })
  return () => {
    cancelled = true
    if (unsub) unsub()
  }
}

// Firebase 설정 여부 확인 — env 기반 sync 유지
export function isFirebaseConfigured(): boolean {
  return isConfigured && app !== null
}

// Firebase App 인스턴스 (Firestore에서 재사용)
export function getFirebaseApp(): FirebaseApp | null {
  return app
}

// 현재 로그인된 user uid — auth가 로드된 후에만 유효. 미로드 시 null.
export function getCurrentUid(): string | null {
  return auth?.currentUser?.uid ?? null
}

// displayName 업데이트
export async function updateUserDisplayName(name: string): Promise<void> {
  const { mod, auth } = await loadAuth()
  if (!auth.currentUser) {
    throw new Error('로그인된 사용자가 없습니다.')
  }
  await mod.updateProfile(auth.currentUser, { displayName: name })
}

// 탈퇴 전 재인증
export async function reauthenticateCurrent(): Promise<void> {
  const { mod, auth } = await loadAuth()
  if (!auth.currentUser) {
    throw new Error('로그인된 사용자가 없습니다.')
  }
  const providerId = auth.currentUser.providerData[0]?.providerId ?? ''
  let provider: GoogleAuthProviderType | OAuthProviderType
  if (providerId === 'google.com') {
    provider = new mod.GoogleAuthProvider()
  } else if (providerId.includes('kakao')) {
    provider = new mod.OAuthProvider('oidc.kakao')
  } else if (providerId.includes('naver')) {
    provider = new mod.OAuthProvider('oidc.naver')
  } else {
    throw new Error(`지원하지 않는 provider: ${providerId}`)
  }
  await mod.reauthenticateWithPopup(auth.currentUser, provider)
}

// Auth user 삭제
export async function deleteCurrentAuthUser(): Promise<void> {
  const { mod, auth } = await loadAuth()
  if (!auth.currentUser) {
    throw new Error('로그인된 사용자가 없습니다.')
  }
  await mod.deleteUser(auth.currentUser)
}

// 현재 로그인 provider 추출 — auth 로드된 후에만 유효
export function getCurrentProvider(): User['provider'] | null {
  const providerId = auth?.currentUser?.providerData[0]?.providerId ?? ''
  if (providerId === 'google.com') return 'google'
  if (providerId === 'password') return 'email'
  if (providerId.includes('kakao')) return 'kakao'
  if (providerId.includes('naver')) return 'naver'
  return null
}

// Auth user의 가입 타임스탬프
export function getCreationTimestamp(): number | null {
  const t = auth?.currentUser?.metadata.creationTime
  if (!t) return null
  return new Date(t).getTime()
}
