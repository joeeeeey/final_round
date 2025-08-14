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
      "timestamp": "00:00:08",
      "type": "question",
      "content": "Hi Alex, thanks for coming in. To get started, could you please give us a brief self-introduction?",
      "role": "interviewer"
    },
    {
      "timestamp": "00:00:09",
      "type": "answer",
      "content": "Sure, no problem. You can call me Alex. I graduated from Stanford with a degree in Computer Science about 8 years ago. I've been working in infrastructure engineering ever since, focusing on building scalable and resilient systems on AWS. For the past five years, my work has been centered around cloud-native technologies, especially Kubernetes and Terraform.",
      "role": "interviewee"
    },
    {
      "timestamp": "00:00:20",
      "type": "question",
      "content": "Hi Alex, welcome. Before we dive into the technical details, could you tell me what specifically about this 'Strong Vibe Coder' role caught your attention?",
      "role": "interviewer"
    },
    {
      "timestamp": "00:00:35",
      "type": "answer",
      "content": "Hi David, thanks for having me. I was really drawn to the emphasis on large-scale infrastructure and the opportunity to work with a modern stack like Kubernetes, Go, and Terraform. The job description reads less like a list of requirements and more like a set of interesting challenges, which is exactly what I'm looking for in my next role.",
      "role": "interviewee"
    },
    {
      "timestamp": "00:01:15",
      "type": "question",
      "content": "Great to hear. Let's start with a high-level overview then. Could you tell me about the most complex, large-scale system you've been responsible for?",
      "role": "interviewer"
    },
    {
      "timestamp": "00:01:40",
      "type": "answer",
      "content": "Of course. At my last company, I was the lead infra engineer for a multi-tenant B2B SaaS platform. We served thousands of tenants, each with their own data and configurations, on a shared infrastructure. I was responsible for the entire lifecycle, from the K8s clusters on EKS to the CI/CD pipelines in GitHub Actions and the observability stack using Grafana and OpenTelemetry.",
      "role": "interviewee"
    },
    {
      "timestamp": "00:03:05",
      "type": "question",
      "content": "That's highly relevant. Can you elaborate on the multi-tenant architecture? How did you handle tenant isolation, noisy neighbors, and data segregation?",
      "role": "interviewer"
    },
    {
      "timestamp": "00:03:35",
      "type": "answer",
      "content": "We used a hybrid model. At the application layer, all requests went through an API Gateway which authenticated the user and injected a tenant ID. Our microservices, written mostly in Go and Python, were all tenant-aware. For the database, we used a single large Postgres cluster with row-level security (RLS) to enforce data isolation. For caching with Redis, we prefixed all keys with the tenant ID. To handle the 'noisy neighbor' problem, we implemented resource quotas at the Kubernetes level and rate limiting at the API gateway.",
      "role": "interviewee"
    },
    {
      "timestamp": "00:05:10",
      "type": "question",
      "content": "You mentioned Postgres with RLS. The JD lists Supabase and Firebase as well. What's your experience there, and when would you choose a NoSQL solution?",
      "role": "interviewer"
    },
    {
      "timestamp": "00:05:40",
      "type": "answer",
      "content": "I've used Firebase extensively for projects requiring rapid development and real-time features, like a chat application. It's fantastic for that. I see Supabase as a great middle-ground, giving you the power of Postgres but with the ease-of-use of Firebase. I'd choose a NoSQL database like MongoDB or DynamoDB for use cases with unstructured data or where horizontal scaling for writes is the absolute priority, like an analytics event ingestion service.",
      "role": "interviewee"
    },
    {
      "timestamp": "00:07:00",
      "type": "question",
      "content": "Let's talk about Kubernetes. What was the most significant challenge you faced managing your EKS clusters, perhaps around cost, networking, or deployment?",
      "role": "interviewer"
    },
    {
      "timestamp": "00:07:35",
      "type": "answer",
      "content": "Infra cost reduction was a huge one. Our dev and staging cluster costs were spiraling. My solution was two-fold. First, I implemented cluster autoscaling more aggressively and used tools like Karpenter to provision right-sized nodes just-in-time. Second, I set up Kube-downscaler to automatically scale down non-production deployments to zero replicas outside of business hours. This cut our non-prod EKS costs by over 60%.",
      "role": "interviewee"
    },
    {
      "timestamp": "00:09:15",
      "type": "question",
      "content": "That's a great result. How did you monitor the health and performance of these services? The JD mentions OpenTelemetry and Datadog.",
      "role": "interviewer"
    },
    {
      "timestamp": "00:09:40",
      "type": "answer",
      "content": "We were all-in on OpenTelemetry. I led the effort to instrument all our microservices to emit traces, metrics, and logs. We sent traces to Jaeger for debugging, metrics to a Prometheus-compatible store, and logs to Loki. We then used Grafana to build dashboards for everything from high-level service health to deep-dive resource utilization per pod. It gave us incredible visibility.",
      "role": "interviewee"
    },
    {
      "timestamp": "00:11:00",
      "type": "question",
      "content": "How do you ensure your infrastructure code and deployments are 'bullet-proof'? Talk me through your CI/CD and testing philosophy.",
      "role": "interviewer"
    },
    {
      "timestamp": "00:11:30",
      "type": "answer",
      "content": "Our philosophy was 'shift-left'. All infrastructure changes were managed via Terraform and went through PRs. Our GitHub Actions pipeline would run `terraform plan`, static analysis, and security scans on every PR. For services, we had extensive unit tests. Before deploying to production, we ran a full suite of E2E tests against a staging environment that was a mirror of prod. We also used canary deployments, slowly rolling out changes to a small percentage of traffic while monitoring error rates in Grafana before a full rollout.",
      "role": "interviewee"
    },
    {
      "timestamp": "00:13:10",
      "type": "question",
      "content": "That sounds like a great process. But things still go wrong. Can you tell me about a time a deployment you were responsible for caused a major production issue? What happened, and what was your role in the post-mortem?",
      "role": "interviewer"
    },
    {
      "timestamp": "00:13:35",
      "type": "answer",
      "content": "Uh, yeah, that's happened. There was one time... we pushed a change to a core service, and it had a memory leak. It took down the whole system for about an hour. It was really stressful. To be honest, the post-mortem was a bit of a blur, a lot of finger-pointing. I think we eventually added more memory to the pods as a quick fix. It was a tough day.",
      "role": "interviewee"
    },
    {
      "timestamp": "00:14:45",
      "type": "question",
      "content": "Okay. Let's move to another scenario: It's 3 AM, and you're on-call. An alert fires for '5xx error rate spike' on the main API. What are your first three steps?",
      "role": "interviewer"
    },
    {
      "timestamp": "00:15:10",
      "type": "answer",
      "content": "First, I'd check our primary monitoring dashboard in Grafana to confirm the alert and see which services are impacted. Is it one service or all of them? Second, I'd look at the recent deployment history. Did we just release a change? If so, that's my prime suspect. Third, I'd dive into the logs for the affected services and look at the distributed traces for the failing requests to pinpoint the exact source of the errors.",
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



