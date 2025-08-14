### 10) Timeline Reference Preview (Hover) — Plan

Goal
- When hovering over "🔗 References: [timestamps]" in a timeline item, show a popover with the original transcript turns matching those timestamps.
- Format each referenced turn as: "$role asked/answered ($type): $content" with distinct colors/icons for interviewer vs interviewee.

Data/State Strategy
- Build a fast lookup map from `timestamp -> QAItem` once per page render.
  - Create `buildTranscriptLookup(qa: QAItem[]): Record<string, QAItem>`.
  - Pass this map to the timeline via props, or provide at context level.
- MVP uses exact string match on timestamp. If not found, omit gracefully.

UI/UX Behavior
- Hover on the references line shows a popover near cursor or anchored to the reference line.
- Popover lists each ref timestamp in order:
  - Badge with the timestamp.
  - Line with icon/color and formatted sentence.
- Dismiss on mouseleave, Esc, or click outside. On mobile, trigger by tap (toggle) instead of hover.
- Keep popover within viewport (flip/shift if near edges).

Accessibility
- The references element is a focusable button with aria-haspopup="dialog" and aria-expanded when open.
- Popover has role="dialog" and is keyboard dismissible with Esc.
- Tab trap not required (read-only), but focus returns to trigger on close.

Visual Design
- References trigger: subtle link style with an icon.
- Popover: card with shadow, rounded corners, max-width and auto-wrap content.
- Interviewer styling: blue icon/title; Interviewee: purple/green icon/title.
- Use `whitespace-pre-wrap` for content and safe line breaks.

Components/Edits
- New: `components/ReferencePopover.tsx`
  - Props: `{ timestamps: string[]; lookup: Record<string, QAItem>; }`
  - Internal state: `open`, anchor ref, mouse enter/leave handlers, Esc handler.
  - Render list of matched QA turns. If empty, show "No references found".
- Edit: `components/TimelineItem.tsx`
  - Replace plain references text with `<ReferencePopover timestamps={item.timestamp_ref} lookup={qaLookup} />`.
- Edit: `components/Timeline.tsx`
  - Accept new prop `qaLookup?: Record<string, QAItem>` and pass it down to items.
- Edit: `app/app/page.tsx`
  - Build the lookup from `qaInput` via `useMemo` and pass to `Timeline` for both mock and LLM results.

Formatting Rule
- interviewer: icon "🧑‍💼", label "Interviewer", color `text-blue-700 dark:text-blue-300`.
- interviewee: icon "🧑‍💻", label "Candidate", color `text-purple-700 dark:text-purple-300`.
- question: verb "asked"; answer: verb "answered".
- Sentence: `${Icon} ${Role} ${verb} (${type}): ${content}`

Edge Cases
- Duplicate timestamps -> show first match (MVP). Future: show all.
- Missing references -> omit with a small note.
- Very long content -> clamp to ~6 lines with "Show more" (post-MVP).

Performance
- Lookup map is O(1) access; popover renders only on hover.
- No extra network calls.

Step-by-Step Tasks (MVP)
- [ ] Add `buildTranscriptLookup` util in page (or a small util file).
- [ ] Update `Timeline` to accept `qaLookup` prop and forward to `TimelineItem`.
- [ ] Create `ReferencePopover.tsx` and integrate in `TimelineItem` where references render.
- [ ] Wire in page: `const qaLookup = useMemo(() => buildTranscriptLookup(qaInput), [qaInput])` and pass to `Timeline`.
- [ ] Basic accessibility (button + Esc) and styling polish.
- [ ] Manual test with `long_transcript` timestamps.

Future Enhancements (Post-MVP)
- Support approximate timestamp matching (±5s) or nearest neighbor when exact not found.
- Multi-ref navigation inside the popover (prev/next arrows).
- Link from popover to scroll the transcript panel to the referenced turn.
- Render role avatars and compact chips for role/type.


