import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: "build",
    target: "es2022",
    minify: "esbuild",
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // 큰 라이브러리만 vendor chunk로 분리 — 캐시 효율 + 첫 진입 LCP
        // 작은 라이브러리는 Vite 기본 분리에 맡김 (manualChunks return undefined)
        // ⚠️ vendor-misc 같은 광범위 묶기는 TDZ/초기화 순서 문제를 일으킬 수 있어 제거
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return undefined
          // React 코어 — 가장 자주 import되므로 한 청크로 묶음
          if (
            id.includes('react-dom') ||
            id.match(/[\\/]react[\\/]/) ||
            id.includes('react-router') ||
            id.includes('scheduler/')
          ) {
            return 'vendor-react'
          }
          // Firebase 분리 — Auth와 Firestore를 별도 청크로 (캐시 효율 + 미래 lazy 가능)
          if (id.includes('@firebase/firestore') || id.includes('firebase/firestore'))
            return 'vendor-firebase-firestore'
          if (id.includes('@firebase/auth') || id.includes('firebase/auth'))
            return 'vendor-firebase-auth'
          if (id.includes('@firebase') || id.includes('firebase/')) return 'vendor-firebase-core'
          if (id.includes('@google/genai')) return 'vendor-genai'
          if (id.includes('lottie-web')) return 'vendor-lottie'
          if (id.includes('framer-motion') || id.includes('motion-dom') || id.includes('motion-utils')) {
            return 'vendor-motion'
          }
          if (id.includes('@sentry')) return 'vendor-sentry'
          // 그 외 작은 vendor (lucide/zustand/toast 등)는 Vite 기본 분리에 맡김
          return undefined
        },
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // prompt 모드: 새 SW install 후 waiting 상태 — 사용자가 SWUpdatePrompt 컴포넌트의
      // "업데이트" 버튼 클릭 시 활성 + reload. skipWaiting/clientsClaim 자동 해제됨.
      // 이전 autoUpdate 모드는 silent update 후 다음 reload 때 적용이라 청크 mismatch 화이트스크린 빈발.
      registerType: "prompt",
      includeAssets: ["favicon.ico"],
      manifest: {
        name: "니혼고 앱",
        short_name: "니혼고",
        description: "매일 조금씩 일본어를 배우는 학습 앱",
        theme_color: "#FF5A5F",
        background_color: "#FFFFFF",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        lang: "ko",
        categories: ["education", "lifestyle"],
        icons: [
          {
            src: "/icons/icon-192.svg",
            sizes: "192x192",
            type: "image/svg+xml",
            purpose: "any",
          },
          {
            src: "/icons/icon-512.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
        // 안드로이드: 홈 아이콘 길게 누르면 보이는 바로가기 메뉴
        // iOS는 현재 shortcuts 미지원 — 향후 지원 시 자동으로 동작
        shortcuts: [
          {
            name: "오늘 학습",
            short_name: "학습",
            description: "단어 학습 바로 시작",
            url: "/learn",
            icons: [{ src: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml" }],
          },
          {
            name: "회화",
            short_name: "회화",
            description: "상황별 일본어 회화",
            url: "/conversation",
            icons: [{ src: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml" }],
          },
          {
            name: "사전",
            short_name: "사전",
            description: "단어 사전 검색",
            url: "/dictionary",
            icons: [{ src: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml" }],
          },
          {
            name: "오답노트",
            short_name: "오답",
            description: "틀린 단어 복습",
            url: "/wrong-words",
            icons: [{ src: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml" }],
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2,webp}"],
        navigateFallbackDenylist: [/^\/api/, /^\/__/],
        // prompt 모드 — 사용자 명시 컨펌으로만 새 SW 활성.
        // 활성 시 cleanupOutdatedCaches가 옛 precache 일괄 삭제.
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            // Google Fonts
            urlPattern: /^https:\/\/fonts\.(?:gstatic|googleapis)\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts",
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            // KanjiVG stroke order SVG — 한자 학습 시 매번 fetch 방지
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/gh\/KanjiVG\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "kanjivg-svg",
              expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 90 },
            },
          },
          {
            // 마스코트 이미지 (정적, 거의 안 바뀜)
            urlPattern: /\/mascots\/.*\.(png|jpg|jpeg|webp)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "mascot-images",
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            // Murf TTS 응답 (Base64 audio) — 자체 메모리 캐시에 의존, SW 캐싱 제외
            // Firebase Firestore API는 SDK가 IndexedDB로 오프라인 처리 → SW 캐시 X
            // GlitchTip 에러 전송도 캐싱하면 안 됨 (오프라인 이벤트는 SDK가 버퍼)
            urlPattern: /^https:\/\/(?!api\.murf\.ai|firestore\.googleapis\.com|securetoken\.googleapis\.com|identitytoolkit\.googleapis\.com|app\.glitchtip\.com)/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "external-fallback",
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
        ],
      },
      devOptions: {
        enabled: false, // dev에선 비활성 (HMR 충돌 방지)
      },
    }),
  ],

  server: {
    host: true,
    //host: 'localhost',
    port: 5000,
  },

  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@images": path.resolve(__dirname, "./src/assets/images"),
    },
  },
});
