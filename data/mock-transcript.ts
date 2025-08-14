import { QAItem, MockTranscriptData, MockTranscriptOption } from "@/types/interview";

export const mockTranscriptData: MockTranscriptData = {
  "short_transcript": [
    {
      "timestamp": "00:00:10",
      "type": "question",
      "content": "Thanks for joining, Jane. To start, could you walk me through your background and tell me a bit about your experience as a frontend developer?",
      "role": "interviewer"
    },
    {
      "timestamp": "00:00:25",
      "type": "answer",
      "content": "Absolutely. I have about 4 years of experience, primarily focused on building responsive user interfaces with React and TypeScript. In my last role at ShopCo, I was a key contributor to their main e-commerce platform, where I helped refactor their product pages and checkout flow. I'm really passionate about performance and user experience.",
      "role": "interviewee"
    },
    {
      "timestamp": "00:02:10",
      "type": "question",
      "content": "That's great. You mentioned performance. Can you describe a particularly challenging technical problem you faced on the e-commerce platform and how you solved it?",
      "role": "interviewer"
    },
    {
      "timestamp": "00:02:30",
      "type": "answer",
      "content": "Sure. We had a major performance issue on our product search results page. When a search returned hundreds of items, the initial render was incredibly slow, freezing the browser for a couple of seconds. After profiling, I found that rendering every single item component at once was the bottleneck. My solution was to implement list virtualization. Instead of rendering all 500 items, we only rendered the 20 or so visible in the viewport, plus a small buffer. This dramatically improved the initial load time. It was tricky because the items had variable heights, so I had to use a library like react-window and provide an estimated item size, then measure and cache the real size once it rendered.",
      "role": "interviewee"
    },
    {
      "timestamp": "00:04:00",
      "type": "question",
      "content": "That sounds like a solid solution. Let's switch gears a bit. Tell me about a time you had a disagreement with a colleague about a technical decision. How did you handle it?",
      "role": "interviewer"
    },
    {
      "timestamp": "00:04:15",
      "type": "answer",
      "content": "In my previous project, a senior developer and I disagreed on which state management library to use for a new feature. He preferred Redux because he was familiar with it, but I felt it was overkill for our use case and proposed using React's built-in Context API to avoid adding another dependency. To resolve it, I created a small proof-of-concept for both approaches, highlighting the complexity, bundle size, and developer experience for each. I presented my findings to him and the team, focusing on the project's specific needs rather than personal preference. After seeing the comparison, he agreed that the Context API was a better fit. We ended up going with that, and it worked out well.",
      "role": "interviewee"
    }
  ],
  "long_transcript": [
    {
      "timestamp": "00:00:15",
      "type": "question",
      "content": "Hi Alex, thanks for your time. Let's start with a high-level overview. Could you tell me about the most complex, large-scale system you've been responsible for?",
      "role": "interviewer"
    },
    {
      "timestamp": "00:00:40",
      "type": "answer",
      "content": "Of course. At my last company, I was the lead infra engineer for a multi-tenant B2B SaaS platform. We served thousands of tenants, each with their own data and configurations, on a shared infrastructure. I was responsible for the entire lifecycle, from the K8s clusters on EKS to the CI/CD pipelines in GitHub Actions and the observability stack using Grafana and OpenTelemetry.",
      "role": "interviewee"
    },
    {
      "timestamp": "00:02:05",
      "type": "question",
      "content": "That's highly relevant. Can you elaborate on the multi-tenant architecture? How did you handle tenant isolation, noisy neighbors, and data segregation?",
      "role": "interviewer"
    },
    {
      "timestamp": "00:02:35",
      "type": "answer",
      "content": "We used a hybrid model. At the application layer, all requests went through an API Gateway which authenticated the user and injected a tenant ID. Our microservices, written mostly in Go and Python, were all tenant-aware. For the database, we used a single large Postgres cluster with row-level security (RLS) to enforce data isolation. For caching with Redis, we prefixed all keys with the tenant ID. To handle the 'noisy neighbor' problem, we implemented resource quotas at the Kubernetes level and rate limiting at the API gateway.",
      "role": "interviewee"
    },
    {
      "timestamp": "00:04:10",
      "type": "question",
      "content": "You mentioned Postgres with RLS. The JD lists Supabase and Firebase as well. What's your experience there, and when would you choose a NoSQL solution?",
      "role": "interviewer"
    },
    {
      "timestamp": "00:04:40",
      "type": "answer",
      "content": "I've used Firebase extensively for projects requiring rapid development and real-time features, like a chat application. It's fantastic for that. I see Supabase as a great middle-ground, giving you the power of Postgres but with the ease-of-use of Firebase. I'd choose a NoSQL database like MongoDB or DynamoDB for use cases with unstructured data or where horizontal scaling for writes is the absolute priority, like an analytics event ingestion service.",
      "role": "interviewee"
    },
    {
      "timestamp": "00:06:00",
      "type": "question",
      "content": "Let's talk about Kubernetes. What was the most significant challenge you faced managing your EKS clusters, perhaps around cost, networking, or deployment?",
      "role": "interviewer"
    },
    {
      "timestamp": "00:06:35",
      "type": "answer",
      "content": "Infra cost reduction was a huge one. Our dev and staging cluster costs were spiraling. My solution was two-fold. First, I implemented cluster autoscaling more aggressively and used tools like Karpenter to provision right-sized nodes just-in-time. Second, I set up Kube-downscaler to automatically scale down non-production deployments to zero replicas outside of business hours. This cut our non-prod EKS costs by over 60%.",
      "role": "interviewee"
    },
    {
      "timestamp": "00:08:15",
      "type": "question",
      "content": "That's a great result. How did you monitor the health and performance of these services? The JD mentions OpenTelemetry and Datadog.",
      "role": "interviewer"
    },
    {
      "timestamp": "00:08:40",
      "type": "answer",
      "content": "We were all-in on OpenTelemetry. I led the effort to instrument all our microservices to emit traces, metrics, and logs. We sent traces to Jaeger for debugging, metrics to a Prometheus-compatible store, and logs to Loki. We then used Grafana to build dashboards for everything from high-level service health to deep-dive resource utilization per pod. It gave us incredible visibility.",
      "role": "interviewee"
    },
    {
      "timestamp": "00:10:00",
      "type": "question",
      "content": "How do you ensure your infrastructure code and deployments are 'bullet-proof'? Talk me through your CI/CD and testing philosophy.",
      "role": "interviewer"
    },
    {
      "timestamp": "00:10:30",
      "type": "answer",
      "content": "Our philosophy was 'shift-left'. All infrastructure changes were managed via Terraform and went through PRs. Our GitHub Actions pipeline would run `terraform plan`, static analysis, and security scans on every PR. For services, we had extensive unit tests. Before deploying to production, we ran a full suite of E2E tests against a staging environment that was a mirror of prod. We also used canary deployments, slowly rolling out changes to a small percentage of traffic while monitoring error rates in Grafana before a full rollout.",
      "role": "interviewee"
    },
    {
      "timestamp": "00:12:10",
      "type": "question",
      "content": "Perfect. Now for a scenario: It's 3 AM, and you're on-call. An alert fires for '5xx error rate spike' on the main API. What are your first three steps?",
      "role": "interviewer"
    },
    {
      "timestamp": "00:12:35",
      "type": "answer",
      "content": "First, I'd check our primary monitoring dashboard in Grafana to confirm the alert and see which services are impacted. Is it one service or all of them? Second, I'd look at the recent deployment history. Did we just release a change? If so, that's my prime suspect. Third, I'd dive into the logs for the affected services and look at the distributed traces for the failing requests to pinpoint the exact source of the errors.",
      "role": "interviewee"
    },
    {
      "timestamp": "00:13:45",
      "type": "question",
      "content": "Good, very structured. This role requires adapting to new tech quickly. Can you give an example of when you had to learn and implement a new tool under pressure?",
      "role": "interviewer"
    },
    {
      "timestamp": "00:14:15",
      "type": "answer",
      "content": "Definitely. We needed a better internal authentication system. I was tasked with evaluating options and chose Authentik. I had no prior experience with it. Over a weekend, I dove into the docs, spun up a POC using Docker, and integrated it with one of our internal tools. I then wrote a design doc and presented it to the team the next week. We adopted it, and I led the rollout. I really enjoy that process of rapid learning and application.",
      "role": "interviewee"
    },
    {
      "timestamp": "00:15:30",
      "type": "question",
      "content": "Excellent. That covers my main questions. Finally, what questions do you have for me about the role, the team, or the company?",
      "role": "interviewer"
    },
    {
      "timestamp": "00:15:50",
      "type": "answer",
      "content": "Thanks. I have a couple. First, could you describe the current on-call rotation and the team's philosophy on work-life balance around it? Second, you mentioned a 'strong vibe' in the JD. What does the ideal team culture look like to you here?",
      "role": "interviewee"
    }
  ]
};

// Mock transcript options for UI selection
export const mockTranscriptOptions: MockTranscriptOption[] = [
  {
    key: 'short_transcript',
    title: 'Short Interview',
    description: 'Frontend Developer Interview',
    role: 'Frontend Developer',
    duration: '~6 minutes',
    questionCount: 6
  },
  {
    key: 'long_transcript', 
    title: 'Long Interview',
    description: 'DevOps Engineer Interview',
    role: 'DevOps Engineer', 
    duration: '~16 minutes',
    questionCount: 12
  }
];

// Backward compatibility export
export const mockTranscript = mockTranscriptData.short_transcript;

// [
//   {
//     timestamp: "00:00:10",
//     type: "question",
//     content:
//       "Thanks for joining, Jane. To start, could you walk me through your background and tell me a bit about your experience as a frontend developer?",
//     role: "interviewer",
//   },
//   {
//     timestamp: "00:00:25",
//     type: "answer",
//     content:
//       "Absolutely. I have about 4 years of experience, primarily focused on building responsive user interfaces with React and TypeScript. In my last role at ShopCo, I was a key contributor to their main e-commerce platform, where I helped refactor their product pages and checkout flow. I'm really passionate about performance and user experience.",
//     role: "interviewee",
//   },
//   {
//     timestamp: "00:02:10",
//     type: "question",
//     content:
//       "That's great. You mentioned performance. Can you describe a particularly challenging technical problem you faced on the e-commerce platform and how you solved it?",
//     role: "interviewer",
//   },
//   {
//     timestamp: "00:02:30",
//     type: "answer",
//     content:
//       "Sure. We had a major performance issue on our product search results page. When a search returned hundreds of items, the initial render was incredibly slow, freezing the browser for a couple of seconds. After profiling, I found that rendering every single item component at once was the bottleneck. My solution was to implement list virtualization. Instead of rendering all 500 items, we only rendered the 20 or so visible in the viewport, plus a small buffer. This dramatically improved the initial load time. It was tricky because the items had variable heights, so I had to use a library like react-window and provide an estimated item size, then measure and cache the real size once it rendered.",
//     role: "interviewee",
//   },
// ];



