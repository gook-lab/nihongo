# Nihongo App

[한국어](README.md) | **English**

Learn Japanese a little every day with a cute mascot companion. It's a learning app built around spaced repetition.

We've built the core around SM-2 spaced repetition (SRS), and added kana/kanji drills, conversation and reading libraries, JLPT mock tests, and Gemini-powered AI tutoring (chat, writing correction, story generation). Audio gets cached offline in IndexedDB so you can listen to pronunciation without network. React 19 + Vite + Firebase.

---

## Screenshots

| Home (Mascot) | Learning | AI Tutor Chat |
|---|---|---|
| <img src="homepage-with-mascot.png" width="240"> | <img src="learning-with-mascot.png" width="240"> | <img src="chat-with-mascot.png" width="240"> |

| Wrong Answer Feedback | Voice Mode | Mascot Selection |
|---|---|---|
| <img src="learning-wrong-answer.png" width="240"> | <img src="voice-mode-listening.png" width="240"> | <img src="settings-mascot-selection.png" width="240"> |

---

## Running It

```bash
npm install
npm run dev        # Dev server (http://localhost:5000)
npm run build      # tsc -b && vite build
npm run lint
npm test           # Vitest
npm run test:ui    # Vitest UI
```

### Environment Variables

```
VITE_GEMINI_API_KEY=      # Google Gemini (AI chat, writing correction, story generation)
VITE_FIREBASE_*=          # Firebase (Auth, Firestore)
VITE_SENTRY_DSN=          # Sentry (auto no-op if unset)
```

**All external integrations are optional — the app won't crash if they're unset.** Without Firebase, you'll just save locally. Without a Gemini key, the AI screens show a setup message instead.

---

## Tech Stack

| Area | Technology |
|---|---|
| Framework | React 19 + Vite 7 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (`@theme` based — no `tailwind.config.js`) |
| UI | shadcn/ui (manually installed) |
| State | Zustand + persist (localStorage) |
| Routing | React Router DOM v7 |
| Animation | Framer Motion, Lottie |
| Auth | Firebase Auth (Google, Kakao/Naver OIDC, email) |
| Data | Firestore (4-doc split sync) + IndexedDB (`idb`) |
| AI | Google Gemini (`@google/genai`) |
| TTS | Murf.ai (2-layer cache) + browser TTS fallback |
| Error Tracking | Sentry + react-error-boundary |
| Deployment | Netlify (`netlify.toml`) / Firebase Hosting |

---

## Key Features

| Area | Details |
|---|---|
| **Learning Core** | SM-2 spaced repetition (SRS), wrong-answer notebook, daily missions, learning streak, XP/levels |
| **Content** | Word dictionary (N5–N1 levels + extension files merged), kana chart/game/practice, kanji (auto-extracted from words)/practice, grammar, idioms, conversations (by category), reading, songs, roleplay scenarios |
| **AI** | Tutor chat (streaming), writing correction, AI reading passage generation, AI conversation |
| **Testing** | JLPT mock tests, JLPT proficiency charts, weakness analysis |
| **Customization** | 3 mascots (Kotaro/Yuki/Sora) + costumes, 7 themes, 4 home layouts, dark mode |
| **Stats** | Heatmap calendar, weekly calendar, achievement badges |
| **Offline** | TTS audio cached in IndexedDB, PWA install, online status toast |
| **Search** | ⌘K quick search (unified word + conversation phrase index, `lib/quickSearch.ts`) |

---

## Project Structure

```
src/
├── App.tsx              Router + auth guard
├── store.ts             Zustand (persist, resume learning)
├── constants.ts         Levels, XP rules
├── lib/
│   ├── firebase.ts      Auth (social + email)
│   ├── firestore.ts     4-doc split sync (profile / state / srs / library)
│   ├── srs.ts           SuperMemo-2 algorithm
│   ├── murf.ts          TTS API — 2-layer cache (memory → IndexedDB → API) + prefetch
│   ├── audioCache.ts    TTS audio IndexedDB persistence (graceful fallback on failure)
│   ├── gemini.ts        Gemini (chat, writing, stories)
│   ├── quickSearch.ts   ⌘K search pure logic
│   ├── answerMatcher.ts Answer matching (typo tolerance)
│   ├── missions.ts · notifications.ts · themes.ts · hiraganaToRomaji.ts
│   └── sentry/          Domain-specific error reporting helpers (8 kinds)
├── data/                Pure content — words(+n1/n2/ext) · kana · kanji · grammar · idioms
│                        conversations(+ext) · reading(+ext) · songs(+ext)
│                        dialogues · roleplay-scenarios · mascots · achievementBadges
├── hooks/               useTTS, useAIChat
├── components/          ui(shadcn) · chat · conversation · home
│                        ErrorBoundary · CustomToast · ConfirmDialog · many widgets
└── pages/               ~40 pages (learning · dictionary · stats · settings · conversation · reading · testing …)
plans/                   Work planning documents
docs/                    PROJECT_STATUS.md, etc.
```

Each directory (`lib/`, `components/`, `hooks/`, `data/`, `pages/`) has a module-specific `CLAUDE.md`.

---

## Architecture

See **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** for details. Quick overview:

1. **Content is pure data in code.** `src/data/*.ts` holds words, conversations, readings, songs. We merge base and `-ext` files. Adding content is just data editing.
2. **Firestore is split into 4 docs** (profile / state / srs / library) — things change at different rates. Splitting keeps write costs and conflicts down.
3. **TTS uses 3-layer caching** — memory → IndexedDB → API. If any cache layer fails, we gracefully fall back to the next.
4. **Every catch block reports to both the user and Sentry.** We have 8 domain-specific helpers. User cancellations (closing popups, wrong password, `AbortError`) skip reporting — they're normal flow, not bugs.

---

## Docs

| Document | Content |
|---|---|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Architecture — 3-layer storage · SRS · Firestore 4-doc · TTS caching |
| [docs/PROJECT_STATUS.md](docs/PROJECT_STATUS.md) | Feature completion checklist |
| [TODOS.md](TODOS.md) | Remaining work |
| [CLAUDE.md](CLAUDE.md) | Work rules (+ module-specific `CLAUDE.md` in each directory) |
| [docs/mascot-costume-prompts.md](docs/mascot-costume-prompts.md) | Mascot costume generation prompts |
| `plans/` | Feature work plans — 1 in progress + 12 in `completed/`. **Local only** (`.gitignore`), not in this repo |

## Project Rules

Organized in `.claude/rules/`:

| File | Content |
|---|---|
| `error-handling.md` | catch patterns, helper mapping, reporting exceptions |
| `design-system.md` | Color tokens, 7 themes, Japanese text display rules, Framer Motion notes |
| `data-patterns.md` | Conversation ext split, Firestore 4-doc, persist keys, user-isolated data |

---

## Known Gotchas

- **Tailwind v4 doesn't use `tailwind.config.js`** — it uses `@theme` in `src/index.css`. Since shadcn CLI doesn't support v4, we manually installed components.
- **Framer Motion + Tailwind width**: Width classes like `w-full` or `max-w-sm` on `motion.div` inside a `flex items-center justify-center` parent can be ignored. You'll see **text stacking vertically, one letter per line** (width shrinking to ~0). Use inline styles instead.
  ```tsx
  // ❌ <motion.div className="w-full max-w-sm">
  // ✅ <motion.div style={{ width: '100%', maxWidth: '24rem' }}>
  ```
- Every Dialog needs a `DialogTitle` for accessibility.

---

## License

**Source-available — this is not open source.** The code is readable, but you don't have permission to use it. To use this code in another project, redistribute it, or use it commercially, you need written permission first. See [LICENSE](LICENSE) for full terms and [LICENSE.ko.md](LICENSE.ko.md) for Korean guidance.
