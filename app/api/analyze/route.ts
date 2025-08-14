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

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});

export async function POST(req: Request) {
  console.log('process.env.OPENROUTER_API_KEY: ', process.env.OPENROUTER_API_KEY);
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
    console.log('parse: ', parse);
    if (!parse.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parse.error.format() },
        { status: 400 }
      );
    }

    const qaItems = parse.data;
    console.log('qaItems: ', qaItems);

    // TODO optimize system prompt
    // - More specific like you are a interviewer
    // - output format should be more specific like basic_information, overall_summary, timeline
    // explain the timeline
    const systemPrompt = `
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
    `
    
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

    console.log('messages: ', messages);
    // return
     const modelId = "google/gemini-2.5-flash-lite-preview-06-17"
     console.log('analysisSchema: ', analysisSchema);
     const { object } = await generateObject({
       model: openrouter(modelId),
       schema: analysisSchema,
      temperature: 0.1,
      messages: messages as ModelMessage[],
    });

    console.log('object: ', object);
    
    return NextResponse.json(object, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


