import { NextResponse } from "next/server";
import { z } from "zod";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateObject, ModelMessage } from "ai";

const qaItemSchema = z.object({
  timestamp: z.string(),
  type: z.enum(["question", "answer"]),
  content: z.string(),
  role: z.enum(["interviewer", "interviewee"]),
});

const basicInformationSchema = z.object({
  name: z.string(),
  graduated_school: z.string(),
  working_years: z.string(),
  tech_stack: z.string(),
  other_information: z.string(),
});

const timelineItemSchema = z.object({
  timestamp: z.string(),
  key_name_entity: z.string(),
  highlight: z.string(),
  lowlight: z.string(),
  summary: z.string(),
  timestamp_ref: z.array(z.string()),
});

const analysisSchema = z.object({
  basic_information: basicInformationSchema,
  overall_summary: z.string(),
  timeline: z.array(timelineItemSchema),
});

// Chunked pipeline schemas (map step)
const chunkTimelineItemSchema = z.object({
  timestamp: z.string(),
  key_name_entity: z.string(),
  highlight: z.string().optional().default(""),
  lowlight: z.string().optional().default(""),
  summary: z.string(),
  timestamp_ref: z.array(z.string()).optional().default([]),
});

const chunkBasicInfoSchema = z.object({
  name: z.string().optional().default(""),
  graduated_school: z.string().optional().default("") ,
  working_years: z.string().optional().default(""),
  tech_stack: z.string().optional().default(""),
  other_information: z.string().optional().default(""),
});

const chunkAnalysisSchema = z.object({
  chunk_id: z.string(),
  time_range: z.tuple([z.string(), z.string()]),
  basic_information_partial: chunkBasicInfoSchema,
  timeline_partial: z.array(chunkTimelineItemSchema),
  notable_quotes: z.array(z.string()).optional().default([]),
});

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});


const prompts = {
  "technical-interviewer-analysis": `
    You are an expert technical interviewer and HR analyst. Your task is to analyze an interview transcript and provide a structured summary in JSON format. Carefully review the entire transcript to extract the required information accurately and concisely.
    
    ### Persona:
    Act as a seasoned technical recruiter with deep expertise in software engineering and candidate evaluation. Your analysis should be objective, insightful, and focused on professional qualifications and performance during the interview.
    
    ### Input Format:
    The input will be a JSON array of dialogue turns from the interview transcript. Each object in the array will have the following structure:
    \`\`\`json
    [
      {
        "timestamp": "00:00:10",
        "type": "question",
        "content": "Can you tell me about your experience with Python?",
        "role": "interviewer"
      },
      {
        "timestamp": "00:00:20",
        "type": "answer",
        "content": "Certainly. I have been working with Python for the last five years, primarily for backend development and data analysis.",
        "role": "interviewee"
      }
    ]
    \`\`\`
    
    ### Output Format:
    Your output must be a single, valid JSON object. Do not include any text or formatting outside of this JSON object. The structure should be as follows:
    \`\`\`json
    {
      "basic_information": {
        "name": "Candidate's full name",
        "graduated_school": "Name of the university or school",
        "working_years": "Total years of professional experience",
        "tech_stack": "Comma-separated list of key technologies mentioned",
        "other_information": "Any other relevant personal or professional details"
      },
      "overall_summary": "A brief, neutral summary of the candidate's performance, including key strengths and areas for improvement.",
      "timeline": [
        {
          "timestamp": "Start time of the interaction",
          "key_name_entity": "A descriptive title for this segment of the interview (e.g., 'Introduction', 'Technical Challenge: API Design')",
          "highlight": "Specific, positive points or strengths demonstrated by the candidate in this segment. Keep empty string if there is no highlight.",
          "lowlight": "Specific, negative points or areas where the candidate struggled. Keep empty string if there is no lowlight.",
          "summary": "A concise summary of the interaction in this segment.",
          "timestamp_ref": [
            "An array of timestamps from the input that are relevant to this summary item"
          ]
        }
      ]
    }
    \`\`\`
    
    ### Instructions:
    1.  **Extract Basic Information**: Scan the entire transcript to find the candidate's name, educational background, years of experience, and key technologies. If any information is not mentioned, leave the corresponding field as "Not mentioned".
    2.  **Generate Overall Summary**: After analyzing the full transcript, write a brief, balanced summary of the candidate's overall performance.
    3.  **Analyze Timeline**:
        * Process the transcript chronologically.
        * Group related questions and answers into logical segments.
        * For each segment, create a timeline item with the specified fields.
        * Ensure that the \`timestamp\` for each timeline item corresponds to the beginning of that segment.
        * The \`timestamp_ref\` should include all relevant timestamps for that segment.
    4.  **Maintain Neutrality**: Your analysis should be objective and free of personal bias.
    5.  **Be Concise**: Keep all summaries and descriptions brief and to the point.
    `,
    "technical-interviewer-analysis-chunked": `
    You are an expert technical interviewer and HR analyst. Your task is to analyze an interview transcript and provide a structured summary in JSON format. Carefully review the entire transcript to extract the required information accurately and concisely.
    
    ### Persona:
    Act as a seasoned technical recruiter with deep expertise in software engineering and candidate evaluation. Your analysis should be objective, insightful, and focused on professional qualifications and performance during the interview.
    
    ### Instructions:
    1.  **Extract Basic Information**: Scan the entire transcript to find the candidate's name, educational background like graduated_school, years of working experience, and key technologies. If any information is not mentioned, leave the corresponding field as "Not mentioned".
        * name: "Candidate's full name",
        * graduated_school: "Name of the university or school",
        * working_years: "Total years of professional experience",
        * tech_stack: "Comma-separated list of key technologies mentioned",
        * other_information: "Any other relevant personal or professional details"
    2.  **Generate Overall Summary**: After analyzing the full transcript, write a brief, balanced summary of the candidate's overall performance.
    3.  **Analyze Timeline**:
        * key_name_entity: "A descriptive title for this segment of the interview (e.g., 'Introduction', 'Technical Challenge: API Design')",
        * The \`highlight\` and \`lowlight\` fields should be specific, positive or negative points or strengths demonstrated by the candidate in this segment. Keep empty string if there is no highlight or lowlight.
        * Process the transcript chronologically.
        * Group related questions and answers into logical segments.
        * For each segment, create a timeline item with the specified fields.
        * Ensure that the \`timestamp\` for each timeline item corresponds to the beginning of that segment.
        * The \`timestamp_ref\` should include all relevant timestamps for that segment.
    4.  **Maintain Neutrality**: Your analysis should be objective and free of personal bias.
    5.  **Be Concise**: Keep all summaries and descriptions brief and to the point.
    `
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENROUTER_API_KEY" },
        { status: 500 }
      );
    }

    const json = await req.json().catch(() => null);
    if (!json) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parse = z.array(qaItemSchema).safeParse(json);
    if (!parse.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parse.error.format() },
        { status: 400 }
      );
    }

    const qaItems = parse.data;

    const url = new URL(req.url);
    const strategyParam = url.searchParams.get("strategy")?.toLowerCase();
    const totalChars = qaItems.reduce((sum, it) => sum + (it.content?.length || 0), 0);
    const useChunked = strategyParam === "chunked" || totalChars > 4000;

    if (useChunked) {
      const result = await analyzeWithChunking(qaItems);
      return NextResponse.json(result, { status: 200 });
    }

    const systemPrompt = prompts["technical-interviewer-analysis-chunked"];
    
    const messages = [
      {
        role: "system",
        content: systemPrompt,
      },
    ];

    messages.push({
      role: "user",
      content: `Here is the interview QA array JSON. Produce the analysis strictly as the schema describes.\n\n ${JSON.stringify(
        qaItems
      )}`,
    });
    // return
    const modelId = "google/gemini-2.5-flash-lite-preview-06-17";
    const { object } = await generateObject({
      model: openrouter(modelId),
      schema: analysisSchema,
      temperature: 0.1,
      messages: messages as ModelMessage[],
    });

    return NextResponse.json(object, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// --- Chunked pipeline (MVP) ---

function formatTimestamp(ts: string): string {
  return ts;
}

function segmentTranscript(
  items: z.infer<typeof qaItemSchema>[],
  maxCharsPerChunk: number = 3000
): { chunkId: string; range: [string, string]; qa: z.infer<typeof qaItemSchema>[] }[] {
  const chunks: { chunkId: string; range: [string, string]; qa: z.infer<typeof qaItemSchema>[] }[] = [];
  let current: z.infer<typeof qaItemSchema>[] = [];
  let currentLen = 0;
  let startTs = "";

  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    const addLen = (it.content?.length || 0) + 32; // small overhead per turn
    if (current.length === 0) startTs = it.timestamp;

    if (currentLen + addLen > maxCharsPerChunk && current.length > 0) {
      const endTs = current[current.length - 1].timestamp;
      chunks.push({ chunkId: `chunk_${chunks.length + 1}`, range: [startTs, endTs], qa: current });
      current = [];
      currentLen = 0;
      startTs = it.timestamp;
    }

    current.push(it);
    currentLen += addLen;
  }

  if (current.length > 0) {
    const endTs = current[current.length - 1].timestamp;
    chunks.push({ chunkId: `chunk_${chunks.length + 1}`, range: [startTs, endTs], qa: current });
  }

  return chunks;
}

function mergeBasicInformation(
  partials: z.infer<typeof chunkBasicInfoSchema>[]
): z.infer<typeof basicInformationSchema> {
  const pick = (vals: (string | undefined)[]) => {
    const v = vals.find((x) => !!x && x !== "Not mentioned" && x.trim() !== "");
    return v ? v : "Not mentioned";
  };

  const name = pick(partials.map((p) => p.name));
  const graduated_school = pick(partials.map((p) => p.graduated_school));
  const working_years = pick(partials.map((p) => p.working_years));

  const techSets = new Set<string>();
  partials.forEach((p) => {
    (p.tech_stack || "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s.length > 0)
      .forEach((s) => techSets.add(s));
  });
  const tech_stack = techSets.size > 0 ? Array.from(techSets).map((s) => s.replace(/^\w/, (c) => c.toUpperCase())).join(", ") : "Not mentioned";

  const other_information = pick(partials.map((p) => p.other_information));

  return { name, graduated_school, working_years, tech_stack, other_information };
}

function mergeTimelines(
  timelines: z.infer<typeof chunkTimelineItemSchema>[][]
): z.infer<typeof timelineItemSchema>[] {
  const flat = timelines.flat();
  flat.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  const seen = new Set<string>();
  const merged: z.infer<typeof timelineItemSchema>[] = [];
  for (const it of flat) {
    const key = `${it.timestamp}|${it.key_name_entity}|${it.summary}`;
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push({
      timestamp: formatTimestamp(it.timestamp),
      key_name_entity: it.key_name_entity,
      highlight: it.highlight || "",
      lowlight: it.lowlight || "",
      summary: it.summary,
      timestamp_ref: it.timestamp_ref || [],
    });
  }
  return merged;
}

async function analyzeWithChunking(qaItems: z.infer<typeof qaItemSchema>[]) {
  const modelId = "google/gemini-2.5-flash-lite-preview-06-17";
  const system = "You are an expert technical interviewer and HR analyst. Produce strict JSON per schema.";

  const chunks = segmentTranscript(qaItems);
  console.log('chunklengths: ', chunks.length);

  const chunkAnalyses: z.infer<typeof chunkAnalysisSchema>[] = [];
  for (const chunk of chunks) {
    const messages: ModelMessage[] = [
      // { role: "system", content: system },
      { role: "system", content: prompts["technical-interviewer-analysis-chunked"] },
      {
        role: "user",
        content:
          `Analyze this interview chunk and produce JSON matching the chunk schema. Keep it concise.\n\n` +
          `chunk_id: ${chunk.chunkId}\n` +
          `time_range: [${chunk.range[0]}, ${chunk.range[1]}]\n` +
          `Transcript JSON:\n${JSON.stringify(chunk.qa)}`,
      },
    ];

    console.log('messages: ', messages);

    try {
      const { object } = await generateObject({
        model: openrouter(modelId),
        schema: chunkAnalysisSchema,
        temperature: 0.1,
        messages,
      });
      chunkAnalyses.push(object);
    } catch (e) {
      // Best-effort fallback when a chunk fails; continue processing
      chunkAnalyses.push({
        chunk_id: chunk.chunkId,
        time_range: [chunk.range[0], chunk.range[1]],
        basic_information_partial: {
          name: "",
          graduated_school: "",
          working_years: "",
          tech_stack: "",
          other_information: "",
        },
        timeline_partial: [],
        notable_quotes: [],
      });
    }
    // return
  }
  // console.log('chunkAnalyses: ', JSON.stringify(chunkAnalyses, null, 2));

  const basic = mergeBasicInformation(chunkAnalyses.map((c) => c.basic_information_partial));
  console.log('basic: ', basic);
  const timeline = mergeTimelines(chunkAnalyses.map((c) => c.timeline_partial));
  console.log('timeline: ', timeline);

  // Generate overall summary using merged timeline for coherence
  const summaryMessages: ModelMessage[] = [
    // { role: "system", content: prompts["technical-interviewer-analysis"] },
    { role: "system", content: system },
    {
      role: "user",
      content:
        `Write a neutral 4-6 sentence overall summary of the interview based on the merged timeline below. ` +
        `Be concise and avoid repetition.\n\n` +
        `Merged timeline JSON:\n${JSON.stringify(timeline)}`,
    },
  ];

  const summarySchema = z.object({ overall_summary: z.string() });
  const { object: summaryObj } = await generateObject({
    model: openrouter(modelId),
    schema: summarySchema,
    temperature: 0.1,
    messages: summaryMessages,
  });

  const finalObject: z.infer<typeof analysisSchema> = {
    basic_information: basic,
    overall_summary: summaryObj.overall_summary,
    timeline,
  };

  return finalObject;
}


