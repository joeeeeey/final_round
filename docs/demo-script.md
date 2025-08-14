## AI Interview Insights — MVP 演示脚本（中文）

本脚本用于 5–7 分钟的团队演示，涵盖产品价值、核心功能展示、技术亮点与可扩展性说明。可按段落念读，并配合页面操作。

---

### 0. 开场（约 20 秒）
大家好，今天我来演示我们做的 MVP「AI Interview Insights」。它能把面试对话自动分析成结构化洞察，包括候选人基本信息、整体评估、以及按时间轴的亮点与不足，帮助我们更快做出用人决策。

---

### 1. 电梯陈述（约 20 秒）
一句话：把“长对话的面试记录”，自动转化为“可读、可用、可追溯”的候选人画像与面试纪要。我们特别关注两点：
- 产品化体验：开箱即用的落地页式交互；
- 可扩展分析：对长文本做分块（chunked）处理，保证性能与质量。

---

### 2. 打开产品首页（约 30 秒）
操作：打开页面顶部的「AI Interview Insights」落地页。
讲解要点：
- 顶部 Hero：产品定位、核心价值点（Smart Analysis / Structured Insights / Instant Results）。
- 页面下方是「Try Sample Analysis」入口，方便直接体验。

---

### 3. 选择样例数据（约 40 秒）
操作：在「Try Sample Analysis」模块选择数据集卡片。
- 先选择「Short Interview」（短面试样例）。
- 也可切换到「Long Interview」（长面试样例，体现可扩展能力）。

讲解要点：
- 我们支持多套样例，真实演示不同面试场景；
- 右侧将显示原始的 QA Transcript（自动换行，便于阅读）。

---

### 4. 一键分析并加载（约 40 秒）
操作：点击「🚀 Analyze Interview」。
讲解要点：
- 看到专业的加载动画：分步骤提示“Processing / Extracting / Generating”等，强调产品化体验；
- 背后通过 Vercel AI SDK + OpenRouter（Gemini 2.5 Flash Lite Preview），调用 LLM 进行结构化输出。

可补充技术说明（一句话）：短文本直接单次分析；长文本自动启用“chunked 分块分析 + 聚合”的策略以保证稳定性。

---

### 5. 展示分析结果（约 2 分钟）
操作：结果出现后，从上到下依次讲解三个区域。

1) Basic Information（候选人基本信息）
- 有头像占位、姓名、毕业院校、工作年限、技术栈等；
- 技术栈以标签形式展示，便于快速扫描。

2) Overall Summary（整体评估）
- 顶部有 Overall Score（综合评分，演示用可视化分值）；
- 下方是维度拆分：Technical / Communication / Experience / Problem Solving 的进度条；
- 最后是一段结构化总结，便于直接粘贴到评审文档。

3) Interview Timeline（时间轴）
- 每个节点包含 timestamp、key entity、Highlight / Lowlight、Summary；
- 颜色编码：正向为绿色、改进点为红色、混合为黄色、中性为蓝色；
- 交互亮点：
  - 鼠标悬停「🔗 References: [xx]」可直接弹出原始 QA 片段；
  - 展示格式如：「🧑‍💼 Interviewer asked (question): …」/「🧑‍💻 Candidate answered (answer): …」；
  - 方便评审人员“从结论回溯到证据”。

（演示时建议：分别对 1–2 个时间轴节点做悬停，展示引用气泡）

---

### 6. 可扩展性与长文本策略（约 1 分钟）
讲解要点（无需切屏）：
- 当输入很长（如 1 小时会议），我们采用 Map-Reduce 思路：
  - Map：把对话按 Q/A 或长度分块，每块独立提取部分结论；
  - Reduce：把所有块的结果再聚合，生成最终的 basic_information、overall_summary、timeline；
- 优点：更稳定、更可控、可并发；
- API 支持 `?strategy=chunked` 显式启用，也会根据文本长度自动切换；
- 我们在 `docs/progress/9-prompt-enginnering-optimiton.md` 中给出了详细的提示词与 Schema 设计（Zod），保证输出严格、可解析。

---

### 7. 简短的技术栈说明（约 30 秒）
- Next.js App Router + React + TypeScript；
- Vercel AI SDK + OpenRouter（Gemini 2.5 Flash Lite Preview）；
- Zod 保证服务端强类型校验；
- Tailwind CSS 打造现代化 UI；
- 代码结构与步骤文档化：`docs/progress/*`。

---

### 8. 收尾与下一步（约 20 秒）
这就是我们的 MVP：
- 产品化的落地页体验；
- 一键生成可读的候选人洞察；
- 对长文本天然可扩展；
- 证据可追溯（References 悬停弹出）。

下一步我们会补充：文件上传、大文本流式进度、评审协作与结果导出等能力。

谢谢大家，欢迎试用并反馈！

---

### 附：演示小贴士
- 若演示长文本：选择 Long Interview，再点击 Analyze；后台会自动分块处理；
- 如果需要强调“证据回溯”，重点展示时间轴节点的 References 悬停弹窗；
- 页面在浅色/深色模式都有良好对比度，演示时可适当切换以体现易用性。


