### 4) LLM Analysis Service (Server) — TODO

- [x] Create `app/app/api/analyze/route.ts`
- [x] Configure Vercel AI SDK with OpenRouter (`@ai-sdk/openai`)
  - [x] Use `baseURL: 'https://openrouter.ai/api/v1'`
  - [x] Use model `google/gemini-flash-2.5`
  - [x] Read `OPENROUTER_API_KEY` from env
- [x] Define Zod schema for `AnalysisItem[]`
- [x] Implement `generateObject` to enforce output shape
- [x] Prompt: task, input format, schema, and timeline ordering guidance
- [x] Validate input (`QAItem[]`) and handle errors
- [x] Return JSON `AnalysisItem[]`


