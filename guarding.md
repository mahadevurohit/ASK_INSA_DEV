INSA UK Student Support Assistant – Product & Technical Specification
1. Overview
The INSA UK Student Support Assistant is a web chatbot that helps Indian students studying in the UK with information, signposting, and a sense of “home away from home”.
It is delivered as a mobile first web app with AI powered chat, quick action shortcuts, and minimal onboarding.
1.1 Goals
•	Provide fast, friendly answers about studying and living in the UK, plus INSA activities and support.
•	Reduce repeated WhatsApp and phone queries for volunteers by handling common questions via the assistant.
•	Collect only essential user data (name and university) to personalise responses and understand usage.
1.2 Non Goals
•	The assistant does not give formal immigration, legal, medical, or financial advice.
•	The assistant does not store or request sensitive personal data (passport numbers, bank details, etc.).
1.3 Tech Stack
•	Frontend: React + Vite + Tailwind CSS + TypeScript.
•	Backend: Supabase Edge Functions (TypeScript, Deno).
•	AI: Google Gemini 1.5 Flash with SSE streaming.
•	Database: Supabase Postgres with chat_users and chat_messages tables.
 
2. User Journeys
2.1 First Time Visitor
1.	User visits the web app (e.g. https://insauk.mahadevu.com).
2.	App checks localStorage for user_id and disclaimerAccepted.
3.	If not found, user sees the Welcome Screen with a “Start chat” button.
4.	On click, user proceeds to onboarding form:
•	Enter name (optional) and university (required).
5.	User sees INSA intro + legal disclaimer and must tick “I agree” to continue.
6.	On acceptance, a chat_users record is created/updated and user_id + disclaimerAccepted are stored in localStorage.
7.	User is taken to the Chat Interface.
2.2 Returning Visitor (Same Browser)
1.	App loads and finds user_id + disclaimerAccepted in localStorage.
2.	App fetches the user and recent chat_messages from Supabase.
3.	User lands directly in the Chat Interface with history loaded.
2.3 Quick Action Journey
1.	From the Chat Interface, user taps one of 7 quick actions:
•	Join, Volunteer, Website, Newsletter, Links, Contact, Emergency.
2.	Frontend turns this into a predefined message (e.g. “I want to join INSA UK from [University].”).
3.	Message is sent through the same chat pipeline to the Edge Function and Gemini.
4.	Assistant responds with relevant info and links.
2.4 Emergency / Escalation Journey
1.	User taps Emergency quick action.
2.	UI shows a static emergency information card (999/112, NHS 111, mental health lines, etc.) and a high visibility disclaimer.
3.	Assistant message reinforces:
•	It cannot handle emergencies.
•	The user should contact emergency services or official university support.
 
3. UI: Screens, Components, and Buttons
3.1 Routes
•	/ – Main app (decides whether to show onboarding or chat based on local state).
•	/privacy – Optional static page describing privacy and disclaimer.
•	/about-insa – Optional informational page about INSA UK.
3.2 Global Layout
•	Header
•	Left: INSA logo.
•	Center: “INSA UK Student Support Assistant”.
•	Right: Text link “Need urgent help?” leading to emergency info.
•	Main
•	Onboarding content or Chat Interface.
•	Footer
•	Links: “Privacy & Disclaimer”, “INSA UK Website”, “© INSA UK”.
3.3 Onboarding Components
3.3.1 <WelcomeScreen />
•	Content:
•	Title: “Welcome to your INSA UK Student Support Assistant”.
•	Subtitle: “Get help with university life, immigration basics, wellbeing and more.”
•	Buttons:
•	Primary: “Start chat” (INSA Orange).
•	Secondary link: “Learn about INSA UK” (opens main INSA website).
3.3.2 <OnboardingForm />
•	Fields:
•	Name: text input, placeholder “What should we call you?” (optional).
•	University: select or typeahead; required.
•	Buttons:
•	Back: text button.
•	Continue: primary button (disabled until university is valid).
•	Validation:
•	University is required.
•	Show inline errors below field.
3.3.3 <DisclaimerStep />
•	Text (short, paraphrased):
•	“This assistant provides general information and signposting only.”
•	“It does not replace professional legal, medical, or immigration advice.”
•	“Please do not share passport numbers, bank or card details, or other sensitive information.”
•	Controls:
•	Checkbox: “I understand and agree”.
•	Primary button: “Start chatting” (disabled until checkbox is ticked).
3.4 Chat Interface Components
3.4.1 <ChatShell />
•	Layout:
•	Mobile: single column (header → quick actions → messages → input).
•	Desktop: 2 column (chat left, info sidebar right).
3.4.2 <ChatHeader />
•	Display:
•	Avatar (INSA icon).
•	“Hi [Name], I’m your INSA UK Assistant”.
•	Small label “Beta” if desired.
3.4.3 <QuickActionsBar />
•	7 quick action buttons:
•	Join
•	Volunteer
•	Website
•	Newsletter
•	Links
•	Contact
•	Emergency
•	Behaviour:
•	On click: calls onQuickAction(id) with a predefined prompt.
3.4.4 <MessagesList />
•	Renders array of messages with:
•	User messages: right aligned, blue bubble (#2563eb).
•	Assistant messages: left aligned, white background with orange accent (#f97316).
•	Streaming:
•	While Gemini is streaming, show a partial assistant bubble that grows as text arrives, with a small typing indicator.
3.4.5 <ChatInput />
•	textarea with auto resize.
•	Placeholder: “Ask anything about studying and living in the UK...”.
•	Buttons:
•	Send: icon button, disabled when input empty or currently streaming.
•	Optional “Stop” button to cancel streaming.
•	Keyboard:
•	Enter = send.
•	Shift+Enter = newline.
3.5 Styling (Tailwind)
•	Primary: INSA Orange #f97316 (e.g. bg-orange-500).
•	Secondary: Trust Blue #2563eb (e.g. bg-blue-600).
•	Typography: Tailwind default font stack.
•	Borders and radii: consistent rounded corners for a friendly feel (rounded-xl for bubbles, rounded-lg for cards).
 
4. Wireframes (Text Description)
4.1 Mobile – Onboarding
Screen 1: Welcome
•	Center: INSA logo and title.
•	Below: short subtitle.
•	Bottom: full width “Start chat” button; “Learn about INSA UK” text link below.
Screen 2: Name & University
•	Header: Back button + step label (e.g. “Step 1 of 2”).
•	Fields stacked: Name, University.
•	Bottom: full width “Continue” button.
Screen 3: Disclaimer
•	Scrollable card with disclaimer text.
•	Checkbox near bottom.
•	Full width “Start chatting” button.
4.2 Mobile – Chat
•	Top: Chat header with avatar and greeting.
•	Under header: horizontal scrollable chips for quick actions.
•	Middle: messages in chronological order.
•	Bottom: input bar with textarea and send icon.
4.3 Desktop – Chat
•	Left column: identical to mobile chat layout.
•	Right column: sidebar containing:
•	Card: “About INSA UK” with short text and “Visit Website” button.
•	Card: “Useful links” (UKCISA, NHS 111, university support).
•	Card: “In an emergency” with clear emergency contact info.
 
5. Frontend Logic & State
5.1 Global State (TypeScript Types)
ts
type ChatUser = {
  id: string;
  name?: string | null;
  university: string;
  created_at: string;
  last_seen_at?: string;
};

type ChatMessage = {
  id: string;
  user_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  source?: "quick_action" | "free_text";
};

type AppState = {
  user: ChatUser | null;
  messages: ChatMessage[];
  isStreaming: boolean;
  error: string | null;
  disclaimerAccepted: boolean;
};
5.2 On App Load
1.	Read from localStorage:
•	insa_chat_user_id
•	insa_disclaimer_accepted
2.	If both exist:
•	Fetch user by ID from chat_users.
•	Fetch last N messages from chat_messages.
•	Set app state and show Chat Interface.
3.	Else:
•	Show Welcome + Onboarding flow.
5.3 Onboarding Submission Logic
1.	User submits name + university.
2.	Call /functions/v1/onboarding (or direct Supabase client) to upsert chat_users.
3.	Receive user_id from backend.
4.	Store insa_chat_user_id in localStorage.
5.	Navigate to Disclaimer step.
5.4 Disclaimer Acceptance Logic
1.	User ticks checkbox and presses “Start chatting”.
2.	Set insa_disclaimer_accepted = "true" in localStorage.
3.	Set disclaimerAccepted in state.
4.	Navigate to Chat Interface.
5.5 Sending a Message
1.	User types message and presses Send or selects a quick action.
2.	Frontend:
•	Append local ChatMessage with role = "user" to messages.
•	Set isStreaming = true.
3.	POST to Supabase Edge Function /functions/v1/chat with JSON:
json
{
  "user_id": "UUID",
  "message": "user input or quick action text",
  "metadata": {
    "university": "University of X",
    "source": "free_text"
  }
}
4.	Open stream (SSE or fetch + ReadableStream):
•	Create an in progress assistant message in state.
•	For each chunk, update its content.
5.	When stream ends:
•	Final assistant message is persisted by backend in chat_messages.
•	isStreaming = false.
5.6 Error Handling
•	If request fails:
•	Show toast or inline error: “Something went wrong. Please try again.”
•	isStreaming = false.
•	If stream interrupted:
•	Keep partial response but show “(Response incomplete)” note.
 
6. Backend: Supabase Edge Functions
6.1 Functions Overview
•	chat – Handles chat requests, fetches history, calls Gemini 1.5 Flash, streams response, writes messages.
•	onboarding (optional) – Creates or updates entries in chat_users.
6.2 chat Edge Function – Behaviour
1.	Accept POST with JSON body { user_id, message, metadata }.
2.	Validate input (user_id present, message non empty).
3.	Ensure chat_users row exists for user_id (create if needed).
4.	Fetch last N chat_messages for that user_id ordered by created_at.
5.	Build prompt for Gemini:
•	System message:
•	“You are the INSA UK Student Support Assistant helping Indian students in the UK.”
•	“Provide friendly, factual, and concise guidance.”
•	“Do not give formal legal or immigration advice; always signpost to official sources.”
•	Conversation history:
•	Map chat_messages to alternating user/assistant messages.
•	Latest user message as final turn.
6.	Call Gemini 1.5 Flash using SSE streaming API.
7.	Stream tokens back to the client as they arrive.
8.	On completion:
•	Insert a chat_messages row for the user message.
•	Insert a chat_messages row for the assistant’s full response.
6.3 onboarding Edge Function – Behaviour
1.	Accept POST body: { name, university }.
2.	Look up existing chat_users record based on anonymous ID from headers/auth (or create new).
3.	Insert or update chat_users with name + university.
4.	Return { user: ChatUser } to client.
 
7. Database Schema
7.1 chat_users
sql
create table public.chat_users (
  id uuid primary key default gen_random_uuid(),
  name text,
  university text not null,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz
);
7.2 chat_messages
sql
create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.chat_users (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  source text,
  created_at timestamptz not null default now()
);
7.3 RLS (Optional Pattern)
•	Enable RLS on both tables.
•	Only allow access via Edge Functions (no direct client reads/writes), or:
•	Attach a per browser anonymous id in JWT and limit SELECT/INSERT to matching user_id.
 
8. Application Architecture
8.1 Components
•	Client (React + Vite + Tailwind)
•	Handles UI, onboarding, chat rendering, quick actions, and SSE handling.
•	Supabase
•	Postgres database (chat_users, chat_messages).
•	Edge Functions: chat, onboarding.
•	Gemini API
•	Text chat model: Gemini 1.5 Flash.
•	SSE streaming for low latency responses.
8.2 Data Flow: Send Message
1.	User types message and presses Send.
2.	React app:
•	Optimistically adds user message to UI.
•	Sends request to /functions/v1/chat.
3.	Edge function:
•	Fetches recent messages from Supabase.
•	Calls Gemini 1.5 Flash using SSE.
•	Streams tokens back to client.
•	Persists user + assistant messages in chat_messages.
4.	Client receives tokens and updates assistant bubble in real time.
 
9. Quick Actions – Mapping
Define a mapping in frontend:
ts
type QuickActionId =
  | "join"
  | "volunteer"
  | "website"
  | "newsletter"
  | "links"
  | "contact"
  | "emergency";

const QUICK_ACTION_PROMPTS: Record<QuickActionId, string> = {
  join: "I would like to join INSA UK from my university. How can I sign up?",
  volunteer: "I want to volunteer with INSA UK. What opportunities are available?",
  website: "Please share the main INSA UK website and explain what I can find there.",
  newsletter: "How can I subscribe to the INSA UK newsletter and what will I receive?",
  links: "Share useful links for Indian students in the UK, such as support services, visa information, and wellbeing resources.",
  contact: "How can I contact INSA UK if I need personal support?",
  emergency:
    "I might be in an emergency situation. Explain what emergency services exist in the UK and what I should do right now.",
};
On click:
ts
function handleQuickAction(id: QuickActionId) {
  const prompt = QUICK_ACTION_PROMPTS[id];
  sendMessage(prompt, { source: "quick_action" });
}
 
10. Prompt & Safety Guidelines (Backend)
•	System prompt should:
•	Clearly state the assistant is informational and not a professional advisor.
•	Encourage signposting to trusted sources (UK government, NHS, universities, UKCISA).
•	Require strong disclaimers for immigration, legal, and medical topics.
•	For emergency like queries:
•	Always instruct user to contact emergency services or university support.
•	Never claim to handle emergencies in real time.

