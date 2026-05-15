INSA UK Student Support Assistant — Complete Repository Analysis
High-Level System Summary
This is a purpose-built AI chatbot SPA (Single Page Application) for INSA UK — a not-for-profit organization supporting Indian students in the UK. The system allows students to ask questions and receive signposting to official resources (UKCISA, High Commission of India, university support offices, emergency services, INSA links).

Technology stack:

Layer	Technology
Frontend	React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui (Radix UI)
Backend / API	Supabase Edge Functions (Deno runtime)
Database	Supabase PostgreSQL (hosted)
AI Model	google/gemini-3-flash-preview via Lovable AI Gateway
Build Platform	Lovable.dev (AI-powered app builder)
Testing	Vitest + jsdom + @testing-library/react
The system is not a traditional client-server app — there is no custom backend. The entire "backend" is two Supabase-managed services: a hosted PostgreSQL database and a single Deno Edge Function deployed to Supabase's infrastructure.

1. Project Architecture

┌────────────────────────────────────────────────────────────────────┐
│  BROWSER (React SPA)                                               │
│                                                                    │
│  ┌──────────┐   ┌──────────────┐   ┌────────────────────────────┐ │
│  │  Header  │   │OnboardingFlow│   │     ChatContainer          │ │
│  │  Footer  │   │(3-step form) │   │  ┌──────────────────────┐  │ │
│  └──────────┘   └──────┬───────┘   │  │  QuickActionsMenu    │  │ │
│                         │ UserInfo  │  └──────────────────────┘  │ │
│                         ▼           │  ┌──────────────────────┐  │ │
│                   ┌─────────────┐   │  │  MessageItem (list)  │  │ │
│                   │  Index.tsx  │   │  │  (ReactMarkdown)     │  │ │
│                   │  (state)    │   │  └──────────────────────┘  │ │
│                   └─────────────┘   │  ┌──────────────────────┐  │ │
│                                     │  │  ChatInput           │  │ │
│                                     │  └──────────────────────┘  │ │
│                                     └───────────┬────────────────┘ │
│                                                 │ useChat hook      │
└─────────────────────────────────────────────────┼──────────────────┘
                                                  │
                    ┌─────────────────────────────┼─────────────────┐
                    │  SUPABASE INFRASTRUCTURE     │                 │
                    │                             │                 │
                    │  ┌──────────────────┐       │                 │
                    │  │  Edge Function   │◄──────┘ POST /chat      │
                    │  │  (Deno runtime)  │  streaming SSE          │
                    │  └────────┬─────────┘                        │
                    │           │ LOVABLE_API_KEY                   │
                    │           ▼                                   │
                    │  ┌────────────────────────────────────┐       │
                    │  │  Lovable AI Gateway                │       │
                    │  │  ai.gateway.lovable.dev/v1/...     │       │
                    │  │  model: google/gemini-3-flash-preview│     │
                    │  └────────────────────────────────────┘       │
                    │                                               │
                    │  ┌──────────────────────────────────────────┐ │
                    │  │  PostgreSQL (Supabase hosted)            │ │
                    │  │  Tables: chat_users, chat_messages       │ │
                    │  └──────────────────────────────────────────┘ │
                    └───────────────────────────────────────────────┘
2. Folder Structure and Directory Purposes

insa-navigators-main/
├── .env                          # Runtime secrets (Supabase URL + anon key)
├── .gitignore
├── README.md                     # Lovable.dev scaffolding README (placeholder URLs)
├── package.json                  # NPM dependencies and scripts
├── bun.lockb                     # Bun lockfile (project also works with npm)
├── index.html                    # Vite HTML entry point (mounts <div id="root">)
├── vite.config.ts                # Vite build config (port 8080, path alias @→src)
├── vitest.config.ts              # Test runner config (jsdom, global test APIs)
├── tailwind.config.ts            # Tailwind theme (CSS vars, dark mode)
├── postcss.config.js             # PostCSS (autoprefixer)
├── eslint.config.js              # ESLint (TS + React hooks rules)
├── tsconfig.json                 # Root TS config (references app + node)
├── tsconfig.app.json             # App TypeScript config
├── tsconfig.node.json            # Node/tooling TypeScript config
├── components.json               # shadcn/ui component registry config
│
├── public/                       # Static assets (served as-is)
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
│
├── src/
│   ├── main.tsx                  # React DOM entry point
│   ├── App.tsx                   # Root component: providers + router
│   ├── App.css                   # (minimal/unused CSS)
│   ├── index.css                 # Design system: CSS custom properties (HSL tokens)
│   ├── vite-env.d.ts             # Vite env type declarations
│   │
│   ├── pages/
│   │   ├── Index.tsx             # Main page: onboarding gate + chat layout
│   │   └── NotFound.tsx          # 404 fallback page
│   │
│   ├── components/
│   │   ├── NavLink.tsx           # React Router NavLink wrapper (active/pending classes)
│   │   ├── chat/                 # All chat-specific UI components
│   │   │   ├── Header.tsx        # Top bar (INSA logo, title, "Safe & Secure")
│   │   │   ├── Footer.tsx        # Bottom bar (INSA website link + social icons)
│   │   │   ├── OnboardingFlow.tsx# 3-step onboarding wizard
│   │   │   ├── ChatContainer.tsx # Orchestrates message list + input + quick actions
│   │   │   ├── ChatInput.tsx     # Auto-resize textarea + send button
│   │   │   ├── MessageItem.tsx   # Individual message bubble (Markdown for AI)
│   │   │   ├── QuickActionsMenu.tsx # Horizontal grid of 7 quick-action buttons
│   │   │   ├── QuickActionCard.tsx  # Individual quick-action card button
│   │   │   └── SocialIcons.tsx   # Facebook/Instagram/LinkedIn/YouTube/Twitter links
│   │   │
│   │   └── ui/                   # shadcn/ui primitive components (35+ components)
│   │       ├── button.tsx, input.tsx, textarea.tsx, card.tsx, ...
│   │       └── (standard Radix UI wrappers — not project-specific logic)
│   │
│   ├── hooks/
│   │   ├── useChat.ts            # Core chat state + API calls + DB writes
│   │   ├── use-mobile.tsx        # Media query hook (768px breakpoint)
│   │   └── use-toast.ts          # Toast notification state hook
│   │
│   ├── types/
│   │   └── chat.ts               # TypeScript interfaces: Message, UserInfo, QuickAction, ChatState
│   │
│   ├── lib/
│   │   └── utils.ts              # `cn()` utility (clsx + tailwind-merge)
│   │
│   ├── assets/
│   │   └── insa-uk-logo.png      # INSA UK organization logo (used in Header)
│   │
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts         # Supabase JS client singleton
│   │       └── types.ts          # Auto-generated DB type definitions
│   │
│   └── test/
│       ├── setup.ts              # Vitest setup file
│       └── example.test.ts       # Placeholder test (always passes)
│
└── supabase/
    ├── config.toml               # Supabase project ID reference
    ├── functions/
    │   └── chat/
    │       └── index.ts          # Deno Edge Function: AI gateway proxy
    └── migrations/
        └── 20260130000518_...sql # DB schema: chat_users + chat_messages tables
3. Key Files and Their Responsibilities
File	Responsibility
src/main.tsx	React DOM bootstrap — mounts App into #root
src/App.tsx	Provider composition (QueryClient, Tooltip, Toasters, Router) + route definitions
src/pages/Index.tsx	Application shell — owns userInfo state, gates onboarding vs. chat
src/hooks/useChat.ts	Core business logic — session management, SSE streaming, DB writes, quick actions
src/types/chat.ts	Shared TypeScript types for the entire chat domain
src/components/chat/OnboardingFlow.tsx	3-step user intake (intro → name/university → disclaimer)
src/components/chat/ChatContainer.tsx	Orchestrates the live chat UI, invokes useChat, auto-scrolls
src/components/chat/MessageItem.tsx	Renders message bubbles — plain text for user, ReactMarkdown for AI
src/components/chat/QuickActionsMenu.tsx	Declares all 7 quick actions, maps icon strings to components
supabase/functions/chat/index.ts	The only backend — Deno function that proxies requests to Lovable AI gateway with a hardcoded system prompt
supabase/migrations/…sql	Defines full DB schema + RLS policies + timestamp trigger
src/integrations/supabase/types.ts	Auto-generated Supabase type definitions for chat_users and chat_messages
src/index.css	Design token definitions as CSS custom properties (HSL color scale, dark/light modes)
vite.config.ts	Build tooling, path alias @ → src/, dev server on port 8080
4. Application Flow and Execution Lifecycle
Boot Sequence

index.html (browser loads)
  └─► src/main.tsx
        └─► createRoot('#root').render(<App />)
              └─► App.tsx
                    ├─ QueryClientProvider (TanStack Query)
                    ├─ TooltipProvider (Radix UI)
                    ├─ Toaster + Sonner (notification portals)
                    └─ BrowserRouter
                          └─ Route "/" → <Index />
User Journey (State Machine)

Index.tsx [isOnboarded=false]
  └─► <OnboardingFlow>
        Step 0: Welcome screen + INSA description + social icons
        Step 1: Name + University text inputs (both optional)
        Step 2: Disclaimer + Emergency info
        → onComplete(UserInfo) fires
              └─► Index.tsx [isOnboarded=true, userInfo set]
                    └─► <ChatContainer userInfo={...}>
                          ├─► useChat(userInfo) initializes:
                          │     ├─ getSessionId() — reads/creates UUID in localStorage
                          │     ├─ Supabase: upsert chat_users record
                          │     └─ setChatUserId(id)
                          ├─► addWelcomeMessage() — synthetic AI greeting (no API call)
                          ├─► Renders <QuickActionsMenu> (7 buttons)
                          └─► Renders <ChatInput>
Message Send Cycle

User types message → presses Enter or Send button
  └─► ChatInput.handleSubmit()
        └─► useChat.sendMessage(content)
              ├─ Append user message to local state
              ├─ Fire-and-forget: saveMessage("user", content) → Supabase INSERT
              ├─ POST to CHAT_URL (Supabase Edge Function)
              │     Headers: Authorization: Bearer <VITE_SUPABASE_PUBLISHABLE_KEY>
              │     Body: { messages, userName, university }
              │
              │     ┌─ Edge Function (Deno) ─────────────────────────────────┐
              │     │  1. Parse request body                                  │
              │     │  2. Build personalized system prompt (inject name/uni)  │
              │     │  3. POST to ai.gateway.lovable.dev/v1/chat/completions  │
              │     │     model: google/gemini-3-flash-preview                │
              │     │     Authorization: Bearer LOVABLE_API_KEY               │
              │     │     stream: true                                         │
              │     │  4. Pipe the SSE response body back as-is               │
              │     └────────────────────────────────────────────────────────┘
              │
              ├─ ReadableStream reader processes SSE chunks:
              │     textBuffer accumulates → split on newlines
              │     Each "data: {...}" line parsed as OpenAI-format delta
              │     delta.choices[0].delta.content accumulated
              │     React state updated token-by-token (streaming render)
              │
              └─ On stream complete:
                    saveMessage("assistant", fullContent) → Supabase INSERT
5. Core Business Logic
All substantive business logic lives in two files:

src/hooks/useChat.ts — client-side logic:

Session identity via localStorage UUID (insa_chat_session_id)
Supabase upsert pattern: check for existing user by session_id, create if absent, update name/university if present
Quick action → pre-written message mapping (quickActionMessages record)
SSE stream parsing (OpenAI-compatible format: data: {...}\n, [DONE] terminator)
Token-by-token React state accumulation for live streaming effect
Welcome message generation (purely local, no AI call)
supabase/functions/chat/index.ts — server-side logic:

Contains the entire SYSTEM PROMPT (103 lines) hardcoded inline
The system prompt defines: persona, safety rules (no legal/immigration/medical advice), tone, exact markdown formatting requirements, all canonical INSA URLs and contact info, university-specific URL pattern guidance, response logic rules
Personalizes the prompt at runtime: appends userName and university context dynamically
Handles 429 (rate limit) and 402 (payment required) as explicit error cases
Simply pipes the AI gateway streaming response body back to the client unchanged
6. Frontend / Backend Interaction
There is one HTTP interface between frontend and backend:


POST {VITE_SUPABASE_URL}/functions/v1/chat
Authorization: Bearer {VITE_SUPABASE_PUBLISHABLE_KEY}
Content-Type: application/json

Request body:
{
  "messages": [{ "role": "user"|"assistant", "content": "..." }, ...],
  "userName": "string | undefined",
  "university": "string | undefined"
}

Response: text/event-stream (SSE)
data: {"choices":[{"delta":{"content":"token"}}]}
data: [DONE]
The frontend also communicates with Supabase PostgreSQL directly via the Supabase JS client (REST/PostgREST) for:

chat_users — upsert on session init
chat_messages — INSERT after each turn
These DB writes are fire-and-forget (errors logged to console only, not surfaced to the user). The Supabase anon key in .env is passed as the Authorization header for both the Edge Function call and the PostgREST calls.

7. APIs, Services, and Integrations
Service	Purpose	Auth
Supabase Edge Function (/functions/v1/chat)	AI proxy + system prompt injection	Supabase anon key (JWT)
Supabase PostgreSQL (PostgREST)	Persist users + messages	Supabase anon key + RLS
Lovable AI Gateway (ai.gateway.lovable.dev)	LLM inference (Gemini)	LOVABLE_API_KEY Supabase secret
INSA UK Website (insauk.org)	External links in responses	None (user-facing links only)
No webhooks, no real-time subscriptions (onChannel), no storage buckets, no auth module.

8. Database Structure and Data Flow
Two tables in the public schema:


chat_users
├── id          UUID PRIMARY KEY (gen_random_uuid)
├── session_id  TEXT UNIQUE NOT NULL       ← localStorage UUID
├── name        TEXT NULL                  ← from onboarding
├── university  TEXT NULL                  ← from onboarding
├── created_at  TIMESTAMPTZ NOT NULL
└── updated_at  TIMESTAMPTZ NOT NULL       ← auto-updated by trigger

chat_messages
├── id          UUID PRIMARY KEY (gen_random_uuid)
├── user_id     UUID NOT NULL → chat_users(id) ON DELETE CASCADE
├── role        TEXT NOT NULL CHECK (IN ('user','assistant'))
├── content     TEXT NOT NULL
└── created_at  TIMESTAMPTZ NOT NULL
Indexes: chat_messages(user_id), chat_messages(created_at), chat_users(created_at)

RLS Policies: All four policies use WITH CHECK (true) / USING (true) — completely open, any anonymous client can read or write any row. This is intentional for the anonymous chat use case but means all conversation histories are globally readable by any client with the anon key.

Data flow direction:


localStorage → useChat → chat_users (upsert)
user message → chat_messages INSERT
AI response  → chat_messages INSERT
No data flows from database back to UI (no SELECT of messages — conversation state lives only in React component memory; refreshing the page loses history).

9. State Management and Event Handling
State architecture: Purely local React state — no Redux, no Zustand, no Context API for app state.


Index.tsx
  ├─ userInfo: UserInfo | null       (lifted to parent, passed down)
  └─ isOnboarded: boolean

useChat.ts (hook state)
  ├─ messages: Message[]             (entire conversation in memory)
  ├─ isLoading: boolean              (controls input disable + typing indicator)
  └─ chatUserId: string | null       (Supabase UUID, set after DB upsert)

OnboardingFlow.tsx (local state)
  ├─ step: 0 | 1 | 2
  ├─ name: string
  └─ university: string

ChatInput.tsx (local state)
  └─ input: string
TanStack Query (@tanstack/react-query) is installed and configured via QueryClientProvider in App.tsx, but it is not used anywhere in the current codebase. No useQuery or useMutation calls exist — all data fetching is done with raw fetch inside useChat.

Event flow for quick actions:


QuickActionsMenu → onAction(QuickAction)
  → useChat.handleQuickAction(action)
    → quickActionMessages[action.action]
      → sendMessage(prewritten string)
10. Authentication and Authorization Logic
There is no user authentication. The system uses:

A crypto.randomUUID() stored in localStorage as a session identifier
This session ID is used to look up or create a chat_users record in Supabase
The Supabase anon key (publishable, safe to expose) is used for all API calls
RLS policies allow unrestricted public read/write to both tables
The Edge Function does not verify the caller's identity beyond requiring a valid Supabase JWT (the anon key token satisfies this). There is no concept of "logged-in user" — the name and university entered in onboarding are stored only for context personalization, not identity.

Supabase anon key exposure: The key in .env is prefixed VITE_ meaning it is bundled into the browser JS. This is the intended design for Supabase — the anon key is meant to be public; security is enforced at the RLS layer.

11. Environment Configuration and Dependencies
Runtime environment variables (.env, available via import.meta.env.VITE_*):

Variable	Value	Purpose
VITE_SUPABASE_PROJECT_ID	bcimuouziddvtqcyasco	Project reference ID
VITE_SUPABASE_URL	https://bcimuouziddvtqcyasco.supabase.co	Supabase REST endpoint
VITE_SUPABASE_PUBLISHABLE_KEY	eyJ... (anon JWT)	Client auth token
Supabase secret (set in Supabase dashboard, NOT in .env):

Variable	Purpose
LOVABLE_API_KEY	API key for Lovable AI Gateway (accessed only in the Edge Function via Deno.env.get)
Key production dependencies:

@supabase/supabase-js ^2.93.3 — database + Edge Function client
react-markdown ^10.1.0 — renders AI responses as Markdown
@tanstack/react-query ^5.83.0 — installed but unused
react-router-dom ^6.30.1 — routing (only 2 routes exist)
All @radix-ui/* packages — Radix UI primitives wrapped by shadcn/ui
lucide-react ^0.462.0 — icon library
tailwindcss-animate — Tailwind CSS animation plugin
next-themes ^0.3.0 — dark/light mode support (installed, not wired up)
sonner ^1.7.4 — toast notifications (both sonner and @radix-ui/react-toast installed)
Key dev dependencies:

lovable-tagger ^1.1.13 — Lovable.dev component tagging (injected in dev mode via vite.config.ts)
@vitejs/plugin-react-swc — fast React transforms using SWC (not Babel)
vitest — test runner (minimal test coverage currently)
@tailwindcss/typography — Tailwind prose class for markdown rendering
12. Build, Deployment, and Runtime Setup
Development:


npm run dev    # vite dev server on port 8080, HMR enabled
Build:


npm run build        # production build → dist/
npm run build:dev    # development build (retains dev tooling)
npm run preview      # preview production build locally
Deployment: Via Lovable.dev platform — "Share → Publish" deploys the built SPA. The Edge Function is deployed to Supabase via supabase functions deploy chat. No CI/CD configuration files exist in the repository.

Runtime: The SPA runs entirely in the browser. The Supabase Edge Function runs on Deno in Supabase's infrastructure on each invocation (serverless, no cold-start optimization configured). The Edge Function imports from https://deno.land/std@0.168.0/http/server.ts — this is pinned to v0.168.0.

13. External Libraries / Framework Usage
Library	Usage Pattern
shadcn/ui	Component library pattern — copies source into src/components/ui/. components.json is the registry config.
Radix UI	Underlying primitive layer for all shadcn/ui components (Dialog, Sheet, Tooltip, etc.)
Tailwind CSS	Utility-first CSS. All colors defined as CSS custom properties in index.css, referenced in tailwind.config.ts via HSL vars.
React Router DOM v6	Hash-based SPA routing. Two routes: / and *.
ReactMarkdown	Renders AI response text as Markdown with custom component overrides (links open in new tab, styled bullet lists).
Lucide React	Icon set for UI elements and social icons.
TanStack Query	Installed, configured, but not used.
next-themes	Dark mode support — installed but no ThemeProvider is wired up in App.tsx.
sonner + @radix-ui/react-toast	Two toast libraries both present — Toaster (Radix) and Sonner both rendered in App.tsx.
class-variance-authority + clsx + tailwind-merge	cn() utility for conditional class composition.
14. Reusable Components / Modules
Domain-specific reusable components:

SocialIcons.tsx — used in both OnboardingFlow and Footer
QuickActionCard.tsx — generic card button with default | destructive variants
NavLink.tsx — React Router NavLink wrapper supporting activeClassName prop (unused in current routes)
Infrastructure-level reusable:

src/lib/utils.ts — cn() function used across all UI components
src/integrations/supabase/client.ts — singleton Supabase client (exported as supabase)
src/hooks/use-mobile.tsx — useIsMobile() hook (defined, not currently used in any component)
All src/components/ui/* — 35+ shadcn/ui primitives available for future use
15. Config Files and Their Roles
File	Role
vite.config.ts	Dev server (port 8080), path alias @→src/, React SWC plugin, Lovable tagger in dev
tailwind.config.ts	Tailwind theme: CSS var references for color tokens, custom keyframes, tailwindcss-animate plugin
tsconfig.json	Root TypeScript config, references tsconfig.app.json and tsconfig.node.json
tsconfig.app.json	App TypeScript: strict mode, @ path alias
components.json	shadcn/ui registry: style, Tailwind config path, aliases — used by shadcn CLI to scaffold components
eslint.config.js	ESLint: TS-ESLint recommended + React hooks rules. @typescript-eslint/no-unused-vars is OFF.
vitest.config.ts	Test runner: jsdom environment, global APIs, setup file
supabase/config.toml	Single-line: project_id = "bcimuouziddvtqcyasco" — used by Supabase CLI
.env	Runtime secrets (committed to repo — anon key exposure is intentional for Supabase)
postcss.config.js	PostCSS pipeline for Tailwind and Autoprefixer
16. Coding Patterns and Architectural Decisions
Custom hook encapsulation: All chat state and business logic is isolated in useChat.ts. Components are presentational-only. This is a clean separation.

Fire-and-forget DB writes: All Supabase INSERT calls use await but errors are only console.error'd. This is a deliberate tradeoff: if DB persistence fails, the user still gets their AI response.

as any type casts in useChat.ts: The comments explicitly note this is a workaround until types regenerate. The DB types (chat_users, chat_messages) are in types.ts but the Supabase client was generated before the migration ran. The casts bypass TypeScript's type safety for these tables.

Inline system prompt: The full 103-line system prompt is hardcoded in the Edge Function source. This makes it auditable and version-controlled, but updating it requires a function redeployment.

SSE streaming parser: The client implements a manual line-buffering SSE parser rather than using the browser EventSource API. This is necessary because EventSource doesn't support POST requests with custom headers.

Welcome message is client-side: The initial greeting is generated locally by addWelcomeMessage() — no AI call is made. It uses a template string with the user's name and university. This is fast and free but means the welcome message content is fixed in client code.

No global state library: Intentional simplicity — the app has only one screen and one stateful hook. React's built-in useState is sufficient.

Responsive grid for quick actions: grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 — collapses on mobile, full row on large screens.

17. Scalability and Maintainability Observations
Maintainability concerns (observation only):

The system prompt is duplicated across the Edge Function and the quick-action button labels in QuickActionsMenu.tsx. If INSA links change, both the Edge Function source and the quickActionMessages map in useChat.ts need updating.
The as any casts in useChat.ts will cause silent type errors if the DB schema changes.
@tanstack/react-query and next-themes are installed but unused — they add bundle weight without providing value currently.
The test suite is a placeholder (expect(true).toBe(true)) — no actual functionality is tested.
The README still contains Lovable scaffold placeholder text (REPLACE_WITH_PROJECT_ID).
Scalability characteristics:

The Supabase Edge Function is stateless/serverless — scales automatically.
The database grows unbounded as messages accumulate; no retention policy or pagination.
No message history is loaded on session resume — a refresh means the user starts fresh (the DB records are orphaned from the UX perspective).
Rate limiting is handled only at the AI gateway level (429 response), not at the application level.
18. Security-Sensitive Areas
Area	Detail
RLS policies	Both tables use USING (true) for SELECT — any client with the anon key can read all users' messages. This is the most significant security exposure.
Anon key in .env	VITE_SUPABASE_PUBLISHABLE_KEY is bundled into browser JS. This is the expected Supabase pattern; the key is restricted by RLS.
LOVABLE_API_KEY location	Correctly stored as a Supabase secret (env var in the Edge Function), never exposed to the client.
No input sanitization	User input is passed directly to the AI model. The system prompt enforces behavioral guardrails, but there is no server-side input filtering.
target="_blank" links	All external links use rel="noopener noreferrer" — correctly prevents tabnapping.
CORS	The Edge Function sets Access-Control-Allow-Origin: * — open CORS. Any origin can call the chat endpoint.
No auth on Edge Function	The chat endpoint is callable by anyone with the Supabase anon key (which is public). Rate limiting is the only protection against abuse.
Sensitive data warning	The system prompt instructs the AI to tell users NOT to share passport/BRP/bank details. This is a behavioral guardrail, not a technical one.
19. Hidden Coupling / Dependencies Between Modules
quickActionMessages (useChat.ts) ↔ SYSTEM PROMPT (edge function): The pre-written messages in quickActionMessages are designed to elicit specific responses from the system prompt's RESPONSE LOGIC section. If the Edge Function system prompt changes its keyword triggers, the quick actions may produce unexpected responses.

OnboardingFlow step count ↔ Index.tsx logic: OnboardingFlow internally manages a 3-step flow (0, 1, 2) and calls onComplete at the end. Index.tsx only knows whether isOnboarded is true — it cannot track which onboarding step the user is on. This is clean but means no analytics on step abandonment.

VITE_SUPABASE_URL → Edge Function URL: The CHAT_URL in useChat.ts is ${VITE_SUPABASE_URL}/functions/v1/chat — the Edge Function name chat is hardcoded. Renaming the function requires updating the client hook.

supabase/types.ts ↔ actual database schema: The types file is auto-generated but the chat_users/chat_messages tables were added via migration AFTER the initial generation. The code works around this with as any casts. The types were subsequently updated to include these tables, but the casts remain.

components.json ↔ shadcn/ui CLI: The components.json file ties the project to the specific shadcn CLI configuration. Adding new shadcn components requires the CLI to be run with this config — manual component creation may drift from the pattern.

lovable-tagger in vite.config.ts: This dev dependency injects Lovable.dev metadata into components during development. It's a platform coupling — the project was generated by Lovable.dev and remains tethered to it.

Complete Mental Model

The system is a thin AI chatbot wrapper.

1. USER IDENTITY: Anonymous, identified only by a localStorage UUID.
   No login. No password. Name/university are optional decorative context.

2. STATE MANAGEMENT: Entirely React hooks. One custom hook (useChat)
   owns the message array and drives all side effects.

3. THE "BACKEND": One Deno function. It does nothing except:
   - Inject a hardcoded system prompt
   - Personalize it with user's name/university
   - Forward to Lovable AI Gateway
   - Pipe the streaming response back

4. PERSISTENCE: Fire-and-forget. Supabase stores messages but the app
   never reads them back. DB is an audit log, not a session store.

5. AI MODEL: Google Gemini (gemini-3-flash-preview) behind Lovable's
   gateway. The model is instructed to act as an INSA UK signposting
   bot with hardcoded URLs and strict behavioral guardrails.

6. STREAMING: Native fetch + ReadableStream. SSE lines parsed manually.
   React state updated token-by-token for live typing effect.

7. THE UI SHELL: Header + (Onboarding OR Chat) + Footer.
   Onboarding is a 3-step wizard (welcome → inputs → disclaimer).
   Chat is QuickActions + ScrollableMessages + Input.
Critical Files to Understand First (Onboarding Order)
src/types/chat.ts — understand the domain model first (Message, UserInfo, QuickAction)
src/pages/Index.tsx — the application gate and state root
src/hooks/useChat.ts — all business logic lives here
supabase/functions/chat/index.ts — the system prompt defines all AI behavior
supabase/migrations/…sql — DB schema and RLS policies
src/components/chat/ChatContainer.tsx — the live chat orchestrator
src/components/chat/OnboardingFlow.tsx — the user intake flow
src/integrations/supabase/client.ts + types.ts — DB interface
Dependency Flow Between Major Modules

main.tsx
  └─► App.tsx (providers)
        └─► Index.tsx
              ├─► OnboardingFlow.tsx
              │     └─► SocialIcons.tsx
              └─► ChatContainer.tsx
                    ├─► useChat.ts ──────────────────────► supabase/client.ts
                    │     │                                       │
                    │     └──────────────────────────────► Supabase DB
                    │     │
                    │     └─► fetch(CHAT_URL) ──────────► Edge Function (Deno)
                    │                                           │
                    │                                    └──► Lovable AI Gateway
                    │                                           │
                    │                                    └──► Gemini Model
                    │
                    ├─► QuickActionsMenu.tsx
                    │     └─► QuickActionCard.tsx
                    │
                    ├─► MessageItem.tsx
                    │     └─► ReactMarkdown
                    │
                    └─► ChatInput.tsx

types/chat.ts ◄── imported by: useChat.ts, ChatContainer.tsx, 
                               MessageItem.tsx, QuickActionsMenu.tsx,
                               QuickActionCard.tsx, OnboardingFlow.tsx

lib/utils.ts (cn) ◄── imported by: nearly all components
This system operates as a single-page, anonymous-session chatbot. The browser handles all rendering and state; Supabase provides serverless compute (AI proxy) and passive storage (audit log). The entire intelligence of the assistant — its persona, behavioral constraints, and knowledge base — is the 103-line system prompt hardcoded in the Edge Function. All other code is infrastructure to deliver that prompt to the model and render its streaming response to the user.
