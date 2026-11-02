"use client"

import ChoiceOfMaterial from "./ChoiceOfMaterial";
import { useState } from "react";
import { FaAngleRight } from "react-icons/fa6";

type Step = "choose" | "reply" | "done"
type Message = { id: number; role: "user" | "ai"; text: string }
type Mode = "resource" | "collection" | "career"



export default function ChatBody() {
    const [step, setStep] = useState<Step>("choose")
    const [messages, setMessages] = useState<Message[]>([])
    const [draft, setDraft] = useState("")

    const handleSelect = (mode: Mode) => {
        console.log("picked:", mode)
        setMessages((prev) => [
            ...prev,
            { id: Date.now(), role: "user", text: mode },
            { id: Date.now() + 1, role: "ai", text: "Great! What role or field are you aiming for?" },
        ])
        setStep("reply")
    }

    const handleReply = () => {
        setMessages((prev) => [
            ...prev,
            { id: Date.now(), role: "user", text: draft },
            { id: Date.now() + 1, role: "ai", text: "Thanks for that! Can you tell me more about your experience in this field?" }
        ])
        setDraft("")
        setStep("done")
    }

  return (
    <section>
                <div className="mt-3 flex flex-col  h-90 overflow-y-auto px-2">
                  
                    {step === "choose" && (
                        <div  className="self-end mt-auto">
                            <ChoiceOfMaterial onSelect={handleSelect} />
                        </div>
                    )}
                    <div className="flex flex-col gap-2">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={
                                    message.role === "user"
                                    ? "self-end rounded-2xl p-2 text-white bg-primary"
                                    : "self-start rounded-2xl p-2 bg-background text-primary"
                                }
                                >
                                {message.text}
                            </div>
                        ))}
                    </div>
                  
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleReply(); }} className="w-full px-2">
                  <div className="w-full relative mt-4  rounded-2xl "
                  >
                    <textarea
                      id="message"
                      placeholder="Type a message"
                      className="bg-background min-w-full rounded-[40px] px-6 py-2 text-start border-none min-h-4 resize-none text-base leading-[1.2] outline-none transition placeholder:text-foreground/40 hover:border-primary/60 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={step !== "reply"}
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                    ></textarea>
                    <button disabled={step !== "reply"} className="absolute right-3 bottom-4.5 py-1.75 px-2.25 bg-[hsl(271,36%,24%)] text-white border-none rounded-full cursor-pointer font-black">
                        <FaAngleRight className="w-4 h-4" />    
                    </button>
                  </div>
                </form>
              </section>
  )
}
