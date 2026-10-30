import { createClient } from "@/lib/supabase/server"
import Image from "next/image";
import { redirect } from "next/navigation"

export default async function Favorite() {
  const supabase = await createClient()

  const { data: {user} } = await supabase.auth.getUser()

  if (!user) {
    redirect("/signin")
  }
  return (
    <div className="rounded-[40px] pt-20 pb-12.5 max-w-93.75 w-[80%] mx-auto desk:p-0 desk:my-12 desk:mr-auto desk:ml-60">
          <div className="rounded-[inherit] p-2 bg-white">
            <div className="rounded-[40px] bg-[hsl(270,20%,96%)] max-w-93.75 w-full">
              {/* Header */}
              <header className="bg-[linear-gradient(to_right,hsl(264,100%,61%),hsl(293,100%,63%))] text-white rounded-t-[40px] rounded-b-2xl px-4 pb-4">
                <div className="bg-white px-4 py-[0.7rem] rounded-b-2xl mx-auto w-[60%]">
                  <span></span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex justify-between items-center">
                    <i className="fa-solid fa-angle-left"></i>
                    <Image
                      src="/images/avatar.jpg"
                      width={10}
                      height={10}
                      alt="avatar"
                      className="w-10 h-10 rounded-full border-2 border-white mr-2"
                    />
                    <div>
                      <h5 className="font-black text-[0.83em]">Samuel Green</h5>
                      <p className="font-thin text-[13px] text-[hsl(276,100%,81%)]">
                        Available to Walk
                      </p>
                    </div>
                    <i className="fa-solid fa-ellipsis-vertical"></i>
                  </div>
                </div>
              </header>

              {/* Body */}
              <section>
                <div className="flex flex-col  ">
                  <div className="bg-[hsl(206,6%,79%)] text-[hsl(276,55%,52%)] p-2 text-base my-2 max-w-[70%] rounded-2xl rounded-bl-none">
                    <p>That sounds great. I’d be happy with that.</p>
                  </div>

                  <div className="bg-[hsl(206,6%,79%)] text-[hsl(276,55%,52%)] p-2 text-base my-2 max-w-[70%] rounded-2xl rounded-bl-none">
                    <p>Could you send over some pictures of your dog, please?</p>
                  </div>

                  <div className="self-end flex gap-1">
                    <Image
                      src="/images/dog-image-1.jpg"
                      width={100} 
                      height={100}
                      alt="a dog"
                      className="h-13.77 w-13.77 rounded-2xl"
                    />
                    <Image
                      src="/images/dog-image-2.jpg"
                      width={100}
                      height={100}
                      alt="a dog in the wild"
                      className="h-13.77 w-13.77 rounded-2xl"
                    />
                    <Image
                      src="/images/dog-image-3.jpg"
                      width={100}
                      height={100}
                      alt="a playing dog"
                      className="h-13.77 w-13.77 rounded-2xl"
                    />
                  </div>

                  <div className="self-end text-[hsl(270,7%,64%)] p-2 rounded-2xl rounded-br-none my-2 max-w-[70%] bg-white text-base">
                    <p>Here are a few pictures. She’s a happy girl!</p>
                  </div>

                  <div className="self-end text-[hsl(270,7%,64%)] p-2 rounded-2xl rounded-br-none my-2 max-w-[70%] bg-white text-base">
                    <p>Can you make it?</p>
                  </div>

                  <div className="bg-[hsl(206,6%,79%)] text-[hsl(276,55%,52%)] p-2 text-base my-2 max-w-[70%] rounded-2xl rounded-bl-none">
                    <p>
                      She looks so happy! The time we discussed works. How long
                      shall I take her out for?
                    </p>
                  </div>

                  <div className="flex flex-col">
                    <button className="bg-[linear-gradient(to_right,hsl(264,100%,61%),hsl(293,100%,63%))] mb-2 p-4 max-w-[75%] rounded-2xl rounded-bl-none border-none flex justify-between items-center text-[13px] text-white outline-1 outline-[hsl(270,20%,96%)]">
                      <span className="opacity-50">
                        <i className="far fa-circle text-[hsl(289,100%,72%)]"></i>{" "}
                        30 minute walk
                      </span>
                      <span className="font-black">$29</span>
                    </button>
                    <button className="bg-[linear-gradient(to_right,hsl(264,100%,61%),hsl(293,100%,63%))] mb-2 p-4 max-w-[75%] rounded-2xl rounded-bl-none border-none flex justify-between items-center text-[13px] text-white outline-1 outline-[hsl(270,20%,96%)]">
                      <span className="opacity-50">
                        <i className="far fa-circle text-[hsl(289,100%,72%)]"></i>{" "}
                        1 hour walk
                      </span>
                      <span className="font-black">$49</span>
                    </button>
                  </div>
                </div>

                <form>
                  <div className="w-full relative mt-4">
                    <textarea
                      id="message"
                      placeholder="Type a message"
                      className="min-w-full rounded-[40px] px-6 py-2 text-start border-none min-h-10 resize-none text-base leading-[1.2] outline-none placeholder:text-[hsl(206,6%,79%)]"
                    ></textarea>
                    <button className="absolute right-2.5 bottom-2.5 py-1.75 px-2.25 bg-[hsl(271,36%,24%)] text-white border-none rounded-full cursor-pointer font-black">
                      <i className="fa-solid fa-angle-right"></i>
                    </button>
                  </div>
                </form>
              </section>
            </div>
          </div>
        </div>
  )
}
