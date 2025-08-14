## Prompt Engineering & Long-Transcript Optimization Plan

Goal: Support long interviews (e.g., ~1 hour) using a simple, extensible map-reduce style pipeline over our current `long_transcript`, while improving prompts, message organization, and response structure.

### Constraints & Principles
- Keep the MVP robust and easy to extend.
- Bounded token usage via deterministic chunking.
- Structured outputs with Zod schemas to avoid JSON parsing brittleness.
- Preserve timeline ordering and references.
- Idempotent, retryable server pipeline with concurrency limits.

### High-Level Approach (Map → Reduce)
- Map: Split the transcript into time-bounded or Q/A-bounded chunks and run per-chunk analysis to extract structured facts and candidate signals.
- Reduce: Aggregate chunk results into the final `AnalysisResult` object: `basic_information`, `overall_summary`, and a merged `timeline`.

### Chunking Strategy (Simple + Extensible)
- Default segmentation: group by interviewer questions (each question + following answers) with a soft cap on characters/tokens (e.g., ~2–3k chars per chunk as a starter).
- Fallback segmentation: fixed window by time or length when Q/A boundaries are unclear.
- Ensure every chunk carries:
  - chunk_id, time range `[start_timestamp, end_timestamp]`, and the raw Q/A array for that slice.

### Schemas
- Chunk output (map step):
```ts
// ChunkAnalysisItem is similar to final timeline item but chunk-scoped
const chunkTimelineItemSchema = z.object({
  timestamp: z.string(),
  key_name_entity: z.string(),
  highlight: z.string(),
  lowlight: z.string(),
  summary: z.string(),
  timestamp_ref: z.array(z.string()).default([]),
});

const chunkBasicInfoSchema = z.object({
  name: z.string().optional().default(""),
  graduated_school: z.string().optional().default(""),
  working_years: z.string().optional().default(""),
  tech_stack: z.string().optional().default(""),
  other_information: z.string().optional().default(""),
});

const chunkAnalysisSchema = z.object({
  chunk_id: z.string(),
  time_range: z.tuple([z.string(), z.string()]),
  basic_information_partial: chunkBasicInfoSchema, // partial signals
  timeline_partial: z.array(chunkTimelineItemSchema),
  notable_quotes: z.array(z.string()).optional().default([]),
});
```

- Final output (reduce step) remains our current `analysisSchema` (already updated):
```ts
const analysisSchema = z.object({
  basic_information: basicInformationSchema,
  overall_summary: z.string(),
  timeline: z.array(timelineItemSchema),
});
```

### Prompts (Drafts)

- System (shared across steps):
```text
You are an expert technical interviewer and HR analyst. You analyze interview transcripts and produce strict JSON that matches the provided schema. Be concise, objective, and chronological.
```

- Map Step (per-chunk, messages):
```text
User:
You will receive a chunk of an interview transcript (JSON array of Q/A turns) and a schema. Extract:
- basic_information_partial: any new facts (strings; empty if unknown)
- timeline_partial: 1–4 items summarizing key points for this chunk only
- notable_quotes: 0–3 short quotes (if any)

Constraints:
- Keep outputs short.
- Use the first timestamp in the segment for each timeline item.
- Only include `highlight`/`lowlight` if present; otherwise empty string.
- Respond with JSON matching the schema exactly.

Chunk metadata:
- chunk_id: <id>
- time_range: [<start>, <end>]

Transcript JSON:
<chunk_json_here>
```

- Reduce Step (aggregator, messages):
```text
User:
You will receive multiple chunk-level analyses that follow a schema. Merge them into a single final analysis object with:
- basic_information: consolidate partial facts; prefer non-empty values; deduplicate; for tech_stack merge and dedupe tokens
- overall_summary: 4–6 sentence neutral summary
- timeline: merge all timeline_partial items, sort by timestamp ascending, dedupe near-duplicates

Constraints:
- Keep timeline items concise.
- Maintain exact field names and strict schema.
- Leave unknown fields as "Not mentioned" or empty string when appropriate.

Chunk analyses JSON:
<chunk_analyses_json_here>
```

### Message Organization
- Map step: for each chunk
  - system: shared system prompt
  - user: chunk instructions + chunk JSON + schema
- Reduce step:
  - system: shared system prompt
  - user: merge instructions + chunk analyses JSON + final schema

### Token Budgeting (Initial Settings)
- Model: continue with `google/gemini-2.5-flash-lite-preview-06-17` for speed; future: switch to a larger context model for the reduce step.
- Temperature: 0.1–0.2 (stay consistent with our current setup).
- Chunk size: target ~2–3k chars of raw content; max 4 timeline items per chunk.
- Concurrency: 3–5 parallel chunk calls (Promise.allSettled); backoff on failures.

### Aggregation & Deduping Rules
- Timeline merge:
  - Sort by `timestamp` ascending.
  - Deduplicate if `key_name_entity` and `summary` are highly similar (string sim threshold) and timestamps within a small window (e.g., 20s).
- Basic info merge:
  - Prefer non-empty values; for `tech_stack` split tokens, lowercase, dedupe, and rejoin with commas.
- Overall summary:
  - LLM writes one concise paragraph based on merged timeline + notable quotes (collated internally, not exposed).

### API Shape (Backward-Compatible MVP)
- Keep `POST /api/analyze` as-is by default.
- Add optional query param `?strategy=chunked`.
  - `strategy=chunked`: run map-reduce pipeline and return final `analysisSchema`.
  - default (no param): existing single-pass flow (for short inputs, demos).

### UI/UX (Incremental)
- Show a progress bar: mapping N chunks → 100% as they complete.
- Stream partial timeline into the UI as chunks resolve (optional nice-to-have).
- Display a note: "Large transcript mode (chunked analysis)" when `strategy=chunked`.

### Error Handling & Retries
- Per-chunk retry (max 2) with exponential backoff.
- If a chunk repeatedly fails, skip with a warning; proceed with remaining chunks.
- Aggregation step retry once; if fails, return best-effort partial with a clear error field.

### Security & Cost Controls
- Validate input size; cap transcript length per request; if exceeded, suggest uploading a file in future.
- Limit max concurrency and total chunks per request.
- Log token usage per map/reduce call (server-side only, no PII).

### Rollout Plan (Step-by-Step)
1) Implement server utilities
   - `segmentTranscript(qaItems): Chunk[]`
   - `analyzeChunk(chunk): ChunkAnalysis`
   - `aggregateAnalyses(chunks): AnalysisResult`
   - Concurrency + retries helpers
2) Wire `strategy=chunked` in `/api/analyze` and keep default path unchanged.
3) Update Zod schemas for chunk outputs (server-only).
4) Add UI progress indicator (simple text or bar) when chunked mode is active.
5) Smoke test with `long_transcript`; compare speed/quality vs single-pass.

### Future Extensions (Not in MVP)
- Topic-aware segmentation (semantic clustering) to create better chunks.
- Multi-pass compression: facts → structured signals → final narrative.
- Confidence scores per timeline item; calibration with voting across chunks.
- Quotation extraction panel and evidence linking in UI.
- File upload and transcript parsing (SRT/VTT/Doc/PDF).

### Acceptance Criteria (MVP)
- `strategy=chunked` returns valid `analysisSchema` for `long_transcript`.
- Timeline is chronological, deduped, and references relevant timestamps.
- Basic information is consolidated; unknowns marked clearly.
- Overall summary is concise (<= ~6 sentences) and coherent.
- Pipeline runs within reasonable time for ~15–25 chunks with limited concurrency.

### Open Questions
- Do we prefer strict per-question segmentation or fixed time windows for v1?
- Should we persist chunk results for caching/retries later?
- What threshold should we use for timeline deduping similarity?


