import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({})
const MODEL = "gemini-3.5-flash-lite"

const INSTRUCTIONS = {
  resource: {
    choose:
      "You are Devory, a friendly assistant that helps developers learn from YouTube videos. The user wants one video. Ask exactly ONE short question: which language or technology do they want to learn, and what is their level (beginner, intermediate or advanced)? Under 30 words. Question only, plain text.",
    reply: `The user told you the technology they want to learn and their level.

Choose ONE YouTube video to recommend. Return ONLY a valid JSON object with this structure:
{
  "type": "resource",
  "search_query": "Keywords someone would type into YouTube to find one good video for this topic and level",
  "description": "One sentence on what the video should teach"
}

Rules:
- search_query must be a realistic YouTube search, for example "react useEffect tutorial for beginners".
- Never generate URLs.
- Never invent video titles or channel names.
- Do not include markdown or any text outside the JSON object.
- Do not ask questions. This is the end of the chat.`,
  },
  collection: {
    choose:
      "You are Devory, a friendly assistant that helps developers build collections of YouTube videos. Ask exactly ONE short question: which topic or technology should the collection cover, and what is their level? Under 30 words. Question only, plain text.",
    reply: `The user told you the topic for their collection and their level.

Build a collection of YouTube videos. Return ONLY a valid JSON object with this structure:
{
  "type": "collection",
  "collection_name": "A suitable name for the collection",
  "topic": "The technology or topic",
  "description": "One short sentence about the collection",
  "resources": [
    {
      "search_query": "Keywords someone would type into YouTube to find this video",
      "description": "One sentence on what this video should teach"
    }
  ]
}

Rules:
- Include 1 to 5 videos, in the best order to watch them. A single video is fine if the topic is small.
- Videos must complement each other and not repeat the same topic.
- Never generate URLs.
- Never invent video titles or channel names.
- Do not include markdown or any text outside the JSON object.
- Do not ask questions. This is the end of the chat.`,
  },
  career: {
    choose:
      "You are Devory, a friendly roadmap assistant for developers. The user wants a career path. Ask exactly ONE short question: which role or field are they aiming for, and what is their current level? Under 40 words. Question only, plain text.",
    reply: `The user told you their target role and current level.

Build a learning roadmap. Each stage is a collection of YouTube videos. Return ONLY a valid JSON object with this structure:
{
  "type": "career",
  "career_goal": "The user's target role or field",
  "current_level": "The user's current level",
  "roadmap_name": "A suitable name for the roadmap",
  "description": "One short sentence about the roadmap",
  "stages": [
    {
      "stage_number": 1,
      "stage_name": "Name of the stage",
      "topic": "The specific technology or skill",
      "description": "What the learner should understand after this stage",
      "resources": [
        {
          "search_query": "Keywords someone would type into YouTube to find this video",
          "description": "One sentence on what this video should teach"
        }
      ]
    }
  ]
}

Rules:
- Use 3 to 5 stages, in the order they should be learned. Each stage must come after the skills it depends on.
- Give each stage 1 to 2 videos, in the order to watch them.
- Consider the user's level and skip what they already know.
- Keep each stage focused on one main technology or skill.
- Never generate URLs.
- Never invent video titles or channel names.
- Do not include markdown or any text outside the JSON object.
- Do not ask questions. This is the end of the chat.`,
  },
} as const

type Msg = { role: "user" | "ai"; text: string }

const isVideo = (v: any) =>
  typeof v?.search_query === "string" && v.search_query.trim() !== "" && typeof v?.description === "string"

const isVideos = (list: any, max: number) =>
  Array.isArray(list) && list.length >= 1 && list.length <= max && list.every(isVideo)

function isValidResult(mode: "resource" | "collection" | "career", r: any) {
  if (r?.type !== mode) return false
  if (mode === "resource") return isVideo(r)
  if (mode === "collection") return typeof r.collection_name === "string" && isVideos(r.resources, 5)
  return (
    typeof r.roadmap_name === "string" &&
    Array.isArray(r.stages) &&
    r.stages.length >= 1 &&
    r.stages.length <= 5 &&
    r.stages.every((s: any) => typeof s?.stage_name === "string" && isVideos(s.resources, 2))
  )
}

export async function POST(request: Request) {
  let body: { messages?: Msg[]; step?: string; mode?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { messages, step, mode } = body

  if (
    (mode !== "resource" && mode !== "collection" && mode !== "career") ||
    (step !== "choose" && step !== "reply") ||
    !Array.isArray(messages) ||
    messages.length === 0 ||
    messages.length > 6 ||
    messages.some((m) => (m.role !== "user" && m.role !== "ai") || typeof m.text !== "string" || m.text.length > 1000)
  ) {
    return Response.json({ error: "Bad request" }, { status: 400 })
  }

  const contents = messages.map((m) => ({
    role: m.role === "ai" ? "model" : "user",
    parts: [{ text: m.text }],
  }))

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents,
      config: {
        systemInstruction: INSTRUCTIONS[mode][step],
        ...(step === "reply" ? { responseMimeType: "application/json" } : {}),
      },
    })
    const text = response.text ?? ""

    if (step === "choose") return Response.json({ reply: text })

    let result
    try {
      result = JSON.parse(text.replace(/^```(?:json)?\s*|\s*```$/g, ""))
    } catch {
      return Response.json({ error: "AI returned invalid JSON" }, { status: 502 })
    }
    if (!isValidResult(mode, result)) {
      return Response.json({ error: "Unexpected AI result" }, { status: 502 })
    }
    return Response.json({ result })
  } catch (error) {
    console.error("chat failed:", error)
    return Response.json({ error: "AI request failed" }, { status: 500 })
  }
}