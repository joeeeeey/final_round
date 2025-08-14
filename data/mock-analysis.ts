import { AnalysisItem } from "@/types/interview";

export const mockAnalysis: AnalysisItem[] = [
  {
    timestamp: "00:00:10",
    key_name_entity: "Introduction & Experience",
    highlight:
      "Candidate provided a clear and concise summary of her 4 years of experience. Directly mentioned relevant technologies (React, TypeScript) and project work (e-commerce platform).",
    lowlight:
      "Could have been slightly more proactive in mentioning specific metrics or achievements in the introduction.",
    summary:
      "The interview began with introductions. The candidate, Jane, outlined her four years of frontend development experience, emphasizing her work with React and TypeScript on an e-commerce platform for her previous employer, ShopCo.",
  },
  {
    timestamp: "00:02:10",
    key_name_entity: "Technical Deep-Dive: Performance Optimization",
    highlight:
      "Demonstrated strong problem-solving skills by identifying a performance bottleneck using profiling. Correctly identified and implemented a suitable advanced solution (list virtualization).",
    lowlight:
      "While the solution was excellent, the explanation of handling variable item heights was slightly rushed. Could have elaborated more on the trade-offs.",
    summary:
      "The discussion moved to a technical challenge. Jane described a significant performance issue with rendering large lists on a search results page. She detailed her solution, which involved implementing list virtualization to render only the items visible in the viewport, significantly improving browser performance.",
  },
  {
    timestamp: "00:04:00",
    key_name_entity: "Behavioral: Technical Disagreement & Collaboration",
    highlight:
      "Excellent, structured answer. Used a data-driven approach (proof-of-concept) to resolve a disagreement, showing maturity and a focus on team goals over personal preference. Demonstrated strong communication and persuasion skills.",
    lowlight: "None. This was a very strong answer.",
    summary:
      "The final section covered a behavioral question about handling technical disagreements. Jane recounted an instance regarding the choice of a state management library. She resolved the conflict by building prototypes for both options and presenting a data-backed comparison, successfully convincing her colleague to adopt a simpler solution.",
  },
];


