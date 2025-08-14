### 3) UI — Timeline (Initial Version) — TODO

- [x] Create `app/app/page.tsx` with basic layout and mocked QA preview
- [x] Add action buttons: "Use Mock Data" and "Analyze (mock)"
- [x] Implement `app/components/Timeline.tsx` to render `AnalysisItem[]`
- [x] Implement `app/components/TimelineItem.tsx` for individual items (timestamp, key entity, highlight, lowlight, summary)
- [x] Style with Tailwind (responsive, readable, dark/light friendly)

- [x] Added new UI sections to display interview analysis:
  - [x] Basic Information component (name, school, experience, tech stack, etc.)
  - [x] Overall Summary component
  - [x] Updated Timeline to handle new TimelineItem format with timestamp_ref
  - [x] Enhanced TimelineItem to show highlights/lowlights conditionally with color coding

Note for display of basic_information, there is reserved field like `name`, `graduated_school`, and if provided other information, dynamic render them.

The data of basic information is like
```
{
  name: "",
  graduated_school: "",
  working_years: "",
  tech_stack: "",
  ...
}


