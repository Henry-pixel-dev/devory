import ChatBody from "@/components/ChatBody";
import { getUser } from "@/lib/getUser";
import Image from "next/image";
import { redirect } from "next/navigation"


export default async function page() {

  const user = await getUser()

  if (!user) {
    redirect("/signin")
  }

  return (
    <div className="rounded-[40px] pt-20 pb-12.5 max-w-93.75 w-[80%] mx-auto desk:p-0 desk:my-12 desk:mr-auto desk:ml-60 ">
          <div className="rounded-[inherit] p-2 ">
            <div className="rounded-[40px] bg-tertiary/20 max-w-93.75 w-full border border-gray-600">
              {/* Header */}
              <header className="bg-[linear-gradient(to_right,#9f9cf2,#05033a)] text-white rounded-t-[40px] rounded-b-2xl px-4 pb-4">
                {/* design */}
                <div className="bg-primary px-4 py-[0.7rem] rounded-b-2xl mx-auto w-[60%]">
                  <span></span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex justify-between items-center">
                    <i className="fa-solid fa-angle-left"></i>
                    <Image
                      src="/Dlogo.png"
                      width={10}
                      height={10}
                      alt="avatar"
                      className="w-10 h-10 rounded-full border-2 border-white mr-2"
                    />
                    <div>
                      <h5 className="font-black text-[0.83em] text-background">Devory</h5>
                      <p className="font-thin text-[13px] text-[hsl(276,100%,81%)]">
                        Agentic RoadMapper
                      </p>
                    </div>
                    <i className="fa-solid fa-ellipsis-vertical"></i>
                  </div>
                </div>
              </header>
              {/* scrollable area */}
              <ChatBody userId={user.id} />
            </div>
          </div>
        </div>
  )
}
