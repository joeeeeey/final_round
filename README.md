## AI Interview Insights — MVP


Visit at: https://final-round-one.vercel.app/

Turn interview transcripts into actionable candidate assessments. This MVP provides a product-like landing page that analyzes a QA transcript into structured insights with basic information, an overall summary, and a chronological timeline. It also includes a scalable, chunked analysis strategy for long interviews.

### Key Features
- Landing page UX with clear value props and CTA
- Sample mock data selector: Short Interview / Long Interview
- Paste JSON input with client-side validation (timestamp, type, content, role)
- One-click AI analysis (Vercel AI SDK + OpenRouter: Gemini 2.5 Flash Lite Preview)
- Structured result
  - Basic Information (name, school, working years, tech stack)
  - Overall Summary (visual scores + strengths + narrative)
  - Timeline with color-coded highlights/lowlights
- Evidence traceability: hover “References” to preview original QA turns
- Long transcript support via optional chunked (map-reduce) strategy

### Tech Stack
- Next.js (App Router), React, TypeScript, Tailwind CSS
- Vercel AI SDK + OpenRouter provider
- Zod for schema-typed LLM outputs and client-side validation

### Getting Started
1) Install
```bash
cd app
npm i
```

2) Configure environment
```bash
cd app
cp .env.example .env.local
# Set your key
OPENROUTER_API_KEY=your_key_here
# Optional (uses default if omitted)
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```

3) Run
```bash
cd app
npm run dev
```
Open http://localhost:3000

### How to Use
1) Try Sample Analysis
- On the homepage, choose “Short Interview” or “Long Interview”, then click “Analyze Interview”.
- The app calls `/api/analyze` and renders structured output.

2) Paste JSON (custom transcript)
- Switch the “Interview Transcript” panel to “Paste JSON”.
- Provide an array of QA items. Each item must include:
```json
{
  "timestamp": "00:00:10",
  "type": "question",
  "content": "Hi, could you introduce yourself?",
  "role": "interviewer"
}
```
- Click “Validate & Use JSON”, then “Analyze Interview”.

3) References Hover
- In Timeline, hover “🔗 References: [...]” to preview original turns.
- Rendered as “🧑‍💼 Interviewer asked (question): …” or “🧑‍💻 Candidate answered (answer): …”.

### API Notes
- Endpoint: `POST /api/analyze`
  - Body: QAItem[] (array of `{ timestamp, type: 'question'|'answer', content, role: 'interviewer'|'interviewee' }`)
  - Response (MVP):
    - `basic_information`: { name, graduated_school, working_years, tech_stack, other_information }
    - `overall_summary`: string
    - `timeline`: array of { timestamp, key_name_entity, highlight, lowlight, summary, timestamp_ref[] }

- Chunked analysis for long inputs:
  - Opt-in via `?strategy=chunked` (e.g. `/api/analyze?strategy=chunked`)
  - Or automatically enabled when input size is large
  - Map: analyze per-chunk with structured schema
  - Reduce: merge partial basic info, dedupe/sort timeline, generate final summary

### Demo
- A 5–7 分钟中文演示脚本位于：`app/docs/demo-script.md`

### Project Structure (high-level)
```
app/
  app/
    api/analyze/route.ts       # LLM analysis (single-pass + chunked)
    page.tsx                   # Landing + analysis UI
    layout.tsx                 # App layout + metadata
    globals.css                # Global styles (including small animations)
  components/
    BasicInformation.tsx
    OverallSummary.tsx
    Timeline.tsx
    TimelineItem.tsx
    MockDataSelector.tsx
    ReferencePopover.tsx       # Hover preview for references
    LoadingAnimation.tsx
  data/
    mock-transcript.ts         # short_transcript / long_transcript
    mock-analysis.ts           # legacy mock format for UI dev
  types/
    interview.ts               # QAItem, Analysis types
  docs/
    demo-script.md             # Demo script (CN)
```

### Notes on Scalability
- Current chunk size threshold is character-based and only splits at QA item boundaries, so JSON is never truncated mid-object.
- Future hardening:
  - Post-serialization budget check and backoff
  - Token-based budgeting with margin
  - Sentence-level splitting for extremely large single answers

### License
Internal MVP / Demo only.


