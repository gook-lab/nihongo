# nihongo

[한국어](README.md) | **English**

Japanese-learning PWA that pairs a mascot companion with a structured review schedule.

[Demo](https://nihan-go-test.netlify.app/) · [Architecture](docs/ARCHITECTURE.md) · [Project status](docs/PROJECT_STATUS.md)

<img src="docs/screenshots/cover.png" alt="nihongo Japanese learning screen" width="100%">

SM-2 spaced repetition determines when material should return for review. Kana, kanji, conversation, reading, and JLPT practice share one learning flow. A Gemini-based tutor supports conversation and writing feedback, while pronunciation audio is stored in IndexedDB for replay on unreliable networks.

## Learning flow

- **Learn**: study kana, kanji, vocabulary, and grammar with immediate answer feedback.
- **Review**: schedule the next review from answer history and bring weak material back sooner.
- **Practice**: apply learned expressions through conversation, reading, and JLPT exercises.
- **AI tutor**: write and speak in Japanese, then receive conversational and writing feedback.
- **Offline playback**: reuse downloaded pronunciation audio and fall back to browser speech when external TTS is unavailable.

## From problem to verification

| Stage | Details |
|---|---|
| Problem | When learning, review, and conversation tools are disconnected, learners must decide what to study next on their own. |
| Decision | Use answer history to schedule reviews, then bring learned expressions back through conversation, reading, and tests. |
| Implementation | Keep SM-2 scheduling, wrong-answer history, the Gemini tutor, and IndexedDB audio caching in separate modules. |
| Verification | Test learning state and pure search and answer-matching logic with Vitest, and confirm that core study flows survive external integration failures. |
| Retrospective | Connecting each learning record to the next useful action mattered more than adding another isolated feature. |

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

Core learning remains available through local storage when external integrations are not configured. AI screens show setup guidance when a Gemini key is unavailable.

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

## Development notes

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
