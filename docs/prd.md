
Act as a senior web full strack ennginer, use nextjs+react+approuter+vercelai to Build a prototype of a interview summary product that can analyze interview transcript. 

## For input and output
- Input is interview transcript 

The format of input is like the following:
"""
input is just like a array json which represent a QA set, we can just hard code and genrate some mock data
[
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
 }
]
"""

- Output:
  * highlights, lowlights, key name entity extraction from this interview script
  * A summary of the whole interview transcripts in an order of timeline
     - 00:00:10   introduction   xxxxxxxxx
     - 00:02:10   problem description   xxxxxx
     - 00:04:00   solution discussion   xxxxxx
     - ......

The format of output is like the following:
"""
[
 {
   "timestamp": "00:00:10",
   "key_name_entity": "Introduction & Experience",
    "highlight": "Candidate provided a clear and concise summary of her 4 years of experience. Directly mentioned relevant technologies (React, TypeScript) and project work (e-commerce platform).",
    "lowlight": "Could have been slightly more proactive in mentioning specific metrics or achievements in the introduction.",
    "summary": "The interview began with introductions. The candidate, Jane, outlined her four years of frontend development experience, emphasizing her work with React and TypeScript on an e-commerce platform for her previous employer, ShopCo."
 },
 {
   "timestamp": "00:02:10",
   "key_name_entity": "Technical Deep-Dive: Performance Optimization",
    "highlight": "Demonstrated strong problem-solving skills by identifying a performance bottleneck using profiling. Correctly identified and implemented a suitable advanced solution (list virtualization).",
    "lowlight": "While the solution was excellent, the explanation of handling variable item heights was slightly rushed. Could have elaborated more on the trade-offs.",
    "summary": "The discussion moved to a technical challenge. Jane described a significant performance issue with rendering large lists on a search results page. She detailed her solution, which involved implementing list virtualization to render only the items visible in the viewport, significantly improving browser performance."
 },
 {
   "timestamp": "00:04:00",
   "key_name_entity": "Behavioral: Technical Disagreement & Collaboration",
    "highlight": "Excellent, structured answer. Used a data-driven approach (proof-of-concept) to resolve a disagreement, showing maturity and a focus on team goals over personal preference. Demonstrated strong communication and persuasion skills.",
    "lowlight": "None. This was a very strong answer.",
    "summary": "The final section covered a behavioral question about handling technical disagreements. Jane recounted an instance regarding the choice of a state management library. She resolved the conflict by building prototypes for both options and presenting a data-backed comparison, successfully convincing her colleague to adopt a simpler solution."
 }
]

"""

Note the  output filed like "key_name_entity", "highlight", "lowlight"  should  be analysis from the QA set, we will use vercel AI SDK with openrouter API and gemini-flash-2.5 model


## For The UI design:
As the output is also a json array, so the fisrt version just use a good view of timeline.


Firstly please generate the step by step plans like 
- create framework and the init UI, with mocked input data
- impletment the analysis process(generate output), invoke LLM(vercel ai), 

And save the docs under docs/ md file.