import { QAItem } from "@/types/interview";

export const mockTranscript: QAItem[] = [
  {
    timestamp: "00:00:10",
    type: "question",
    content:
      "Thanks for joining, Jane. To start, could you walk me through your background and tell me a bit about your experience as a frontend developer?",
    role: "interviewer",
  },
  {
    timestamp: "00:00:25",
    type: "answer",
    content:
      "Absolutely. I have about 4 years of experience, primarily focused on building responsive user interfaces with React and TypeScript. In my last role at ShopCo, I was a key contributor to their main e-commerce platform, where I helped refactor their product pages and checkout flow. I'm really passionate about performance and user experience.",
    role: "interviewee",
  },
  {
    timestamp: "00:02:10",
    type: "question",
    content:
      "That's great. You mentioned performance. Can you describe a particularly challenging technical problem you faced on the e-commerce platform and how you solved it?",
    role: "interviewer",
  },
  {
    timestamp: "00:02:30",
    type: "answer",
    content:
      "Sure. We had a major performance issue on our product search results page. When a search returned hundreds of items, the initial render was incredibly slow, freezing the browser for a couple of seconds. After profiling, I found that rendering every single item component at once was the bottleneck. My solution was to implement list virtualization. Instead of rendering all 500 items, we only rendered the 20 or so visible in the viewport, plus a small buffer. This dramatically improved the initial load time. It was tricky because the items had variable heights, so I had to use a library like react-window and provide an estimated item size, then measure and cache the real size once it rendered.",
    role: "interviewee",
  },
];


