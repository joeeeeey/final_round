### 2) Data Modeling and Mock Input — TODO

- [x] Define `QAItem` and `AnalysisItem` types in `app/types/interview.ts`
  - [x] `QAItem`: `{ timestamp: string; type: 'question' | 'answer'; content: string; role: 'interviewer' | 'interviewee'; }`
  - [x] `AnalysisItem`: `{ timestamp: string; key_name_entity: string; highlight: string; lowlight: string; summary: string; }`
- [x] Create `app/data/mock-transcript.ts` mirroring PRD’s example QA set
- [x] (Optional) Create `app/data/mock-analysis.ts` with a sample analysis array
- [x] Commit and ensure types are exported for reuse


