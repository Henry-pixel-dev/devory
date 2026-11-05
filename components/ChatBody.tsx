"use client"

import ChoiceOfMaterial from "./ChoiceOfMaterial"
import { useState } from "react"
import { FaAngleRight } from "react-icons/fa6"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

type Step = "choose" | "waiting" | "fetching" | "reply" | "done"
type Message = { id: number; role: "user" | "ai"; text: string }
type Mode = "resource" | "collection" | "career"
type Video = { url: string; title: string; description: string; image: string }
type Stage = { name: string; description: string; videos: Video[] }
type Pending =
  | { kind: "resource"; video: Video }
  | { kind: "collection"; name: string; description: string; videos: Video[] }
  | { kind: "career"; name: string; description: string; stages: Stage[] }

const labels: Record<Mode, string> = {
  resource: "A resource",
  collection: "A collection",
  career: "A career path",
}

const DEFAULT_IMAGE_PATH = "defaults/placeholder.png"

const collectionText = (name: string, description: string, videos: Video[]) =>
  `${name}\n${description}\n\n` + videos.map((v, i) => `${i + 1}. ${v.title}`).join("\n")

const careerText = (name: string, description: string, stages: Stage[]) =>
  `${name}\n${description}\n\n` +
  stages
    .map((s, i) => `Stage ${i + 1}: ${s.name}\n` + s.videos.map((v) => `  - ${v.title}`).join("\n"))
    .join("\n\n")

export default function ChatBody({ userId }: { userId: string }) {
  const [step, setStep] = useState<Step>("choose")
  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState("")
  const [chosenMode, setChosenMode] = useState<Mode | null>(null)
  const [error, setError] = useState("")
  const [pending, setPending] = useState<Pending | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState("")
  const router = useRouter()

  const addAi = (text: string) =>
    setMessages((prev) => [...prev, { id: Date.now(), role: "ai", text }])

  const askAI = async (history: Message[], stepName: "choose" | "reply", modeValue: Mode) => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        step: stepName,
        mode: modeValue,
        messages: history.map(({ role, text }) => ({ role, text })),
      }),
    })
    if (!res.ok) throw new Error(`chat failed: ${res.status}`)
    return await res.json()
  }

  const findVideo = async (query: string): Promise<Video> => {
    const found = await fetch(`/api/find?q=${encodeURIComponent(query)}`)
    if (!found.ok) throw new Error(`find failed: ${found.status}`)
    const { url } = await found.json()

    const prev = await fetch(`/api/preview?url=${encodeURIComponent(url)}`)
    if (!prev.ok) throw new Error(`preview failed: ${prev.status}`)
    const data = await prev.json()

    return {
      url,
      title: data.title || "Untitled video",
      description: data.description || "",
      image: data.image || "",
    }
  }

  // look up several videos at once, keep their order, drop failures and duplicates
  const findVideos = async (items: { search_query: string }[]): Promise<Video[]> => {
    const settled = await Promise.allSettled(items.map((i) => findVideo(i.search_query)))
    const seen = new Set<string>()
    const videos: Video[] = []
    for (const s of settled) {
      if (s.status === "fulfilled" && !seen.has(s.value.url)) {
        seen.add(s.value.url)
        videos.push(s.value)
      }
    }
    return videos
  }

  const handleSelect = async (mode: Mode) => {
    if (step !== "choose") return
    setError("")
    setChosenMode(mode)
    const history: Message[] = [{ id: Date.now(), role: "user", text: labels[mode] }]
    setMessages(history)
    setStep("waiting")
    try {
      const { reply } = await askAI(history, "choose", mode)
      addAi(reply)
      setStep("reply")
    } catch (e) {
      console.error(e)
      setMessages([])
      setChosenMode(null)
      setStep("choose")
      setError("Something went wrong. Please pick again.")
    }
  }

  const handleReply = async () => {
    const text = draft.trim()
    if (step !== "reply" || !text || !chosenMode) return
    setError("")
    const history: Message[] = [...messages, { id: Date.now(), role: "user", text }]
    setMessages(history)
    setDraft("")
    setStep("waiting")
    try {
      const { result } = await askAI(history, "reply", chosenMode)
      setStep("fetching")

      if (result.type === "resource") {
        const video = await findVideo(result.search_query)
        setPending({ kind: "resource", video })
        addAi("I found this video for you:")
      } else if (result.type === "collection") {
        const videos = await findVideos(result.resources)
        if (videos.length === 0) throw new Error("no videos found")
        setPending({ kind: "collection", name: result.collection_name, description: result.description ?? "", videos })
        addAi(collectionText(result.collection_name, result.description ?? "", videos))
      } else {
        const stages: Stage[] = await Promise.all(
          result.stages.map(async (s: any) => ({
            name: s.stage_name,
            description: s.description ?? "",
            videos: await findVideos(s.resources),
          }))
        )
        const usable = stages.filter((s) => s.videos.length > 0)
        if (usable.length === 0) throw new Error("no videos found")
        setPending({ kind: "career", name: result.roadmap_name, description: result.description ?? "", stages: usable })
        addAi(careerText(result.roadmap_name, result.description ?? "", usable))
      }
      setStep("done")
    } catch (e) {
      console.error(e)
      setMessages(messages)
      setDraft(text)
      setPending(null)
      setStep("reply")
      setError("I couldn't find videos for that. Try rewording your answer.")
    }
  }

  const handleSave = async () => {
    if (!pending || pending.kind !== "resource" || saving || saved) return
    const { video } = pending
    setSaving(true)
    setSaveError("")
    let imagePath = DEFAULT_IMAGE_PATH

    if (video.image) {
      try {
        const res = await fetch("/api/upload-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: video.image }),
        })
        if (res.ok) imagePath = (await res.json()).path
      } catch (e) {
        console.error(e) // keep the default image
      }
    }

    try {
      // const supabase = createClient()
      // const { error } = await supabase.from("resources").insert({
      //   resource_url: video.url,
      //   resource_name: video.title,
      //   resource_description: video.description,
      //   resource_type: "video",
      //   resource_image: imagePath,
      //   user_id: userId,
      // })

       const res = await fetch("/api/resources", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    url: video.url,
                    name: video.title,
                    description: video.description,
                    type: "video",
                    image: imagePath,
                }),
                })
                const data = await res.json()

                if (res.status === 403 && data.error === "limit_reached") {
                  // open the upgrade popup here (next step)
                  router.push("?upgrade=true");
                console.log("Limit reached. Please upgrade your plan to add more resources.")
                return
                }
                if (res.status === 409) { console.log("You've already saved this link."); return } //setApiError
                if (!res.ok) { console.log("Something went wrong. Please try again."); return } //setApiError

                
      if (error) throw error
      setSaved(true)
    } catch (e) {
      console.error(e)
      setSaveError("Couldn't save. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <section>
      <div className="mt-3 flex flex-col h-90 overflow-y-auto px-2">
        {step === "choose" && (
          <div className="self-end mt-auto">
            <ChoiceOfMaterial onSelect={handleSelect} />
          </div>
        )}

        <div className="flex flex-col gap-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={
                message.role === "user"
                  ? "self-end whitespace-pre-wrap rounded-2xl p-2 text-white bg-primary"
                  : "self-start whitespace-pre-wrap rounded-2xl p-2 bg-background text-primary"
              }
            >
              {message.text}
            </div>
          ))}

          {step === "waiting" && <div className="self-start text-sm text-primary/60">Devory is typing...</div>}
          {step === "fetching" && <div className="self-start text-sm text-primary/60">Finding your videos...</div>}

          {pending?.kind === "resource" && (
            <div className="self-start w-[85%] rounded-2xl bg-primary/10 p-3 flex flex-col gap-2">
              {pending.video.image && (
                <div className="relative h-32 w-full">
                  <Image src={pending.video.image} fill unoptimized alt={pending.video.title} className="object-cover rounded-lg" />
                </div>
              )}
              <h3 className="font-bold text-primary">{pending.video.title}</h3>
              <p className="text-sm text-primary">{pending.video.description.slice(0, 120)}</p>
              <button
                onClick={handleSave}
                disabled={saving || saved}
                className="self-end rounded-full bg-primary px-4 py-1 text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {saved ? "Saved" : saving ? "Saving..." : "Save"}
              </button>
              {saveError && <p className="text-sm text-red-500">{saveError}</p>}
            </div>
          )}
        </div>
      </div>

      {error && <p className="px-2 text-sm text-red-500">{error}</p>}

      <form onSubmit={(e) => { e.preventDefault(); handleReply() }} className="w-full px-2">
        <div className="w-full relative mt-4 rounded-2xl">
          <textarea
            id="message"
            placeholder="Type a message"
            className="bg-background min-w-full rounded-[40px] px-6 py-2 text-start border-none min-h-4 resize-none text-base leading-[1.2] outline-none transition placeholder:text-foreground/40 hover:border-primary/60 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={step !== "reply"}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          ></textarea>
          <button
            disabled={step !== "reply"}
            className="absolute right-3 bottom-4.5 py-1.75 px-2.25 bg-[hsl(271,36%,24%)] text-white border-none rounded-full cursor-pointer font-black"
          >
            <FaAngleRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </section>
  )
}


