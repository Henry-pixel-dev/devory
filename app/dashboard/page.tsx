import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"


export default async function HomePage() {
  const supabase = await createClient()

  const { data: {user} } = await supabase.auth.getUser()

  if (!user) {
    redirect("/signin")
  }
  return (
    <section className="container mx-auto flex flex-col  space-y-8 md:mt-10 p-6">
      {/* hero section */}
      <header className="flex flex-col space-y-1">
        <p className="font-bold text-sm text-tertiary">welcome back, <span className="text-primary">Henry</span></p>
        <h1 className="text-2xl text-primary font-light md:font-bold">
          Your Dashboard
        </h1>
      </header>
      <div className="flex flex-col md:flex-col-reverse space-y-6">
        {/* creating of resource card  gonna make it later to one resuable card */}
        {/* card container */}
        <div>
          <h2 className="text-base text-primary font-light md:font-bold mb-3">
            Create Your Study Materials.
          </h2>
          <div className="flex flew-wrap space-x-3 items-start overflow-y-auto">
            {/* cards */}
            <div className=" flex-1 bg-tertiary/30 rounded-lg p-4 min-w-32 h-32 flex flex-col justify-between">
              <p className=" relative w-9 h-9 bg-background   rounded-full text-2xl font-bold text-primary cursor-pointer  justify-center">
                <span className=" absolute top-0 left-2.5">+</span>
              </p>

              <p>Create resources</p>
            </div>
            <div className="flex-1 bg-tertiary/30 rounded-lg p-4 min-w-32 h-32 flex flex-col justify-between">
              <p className=" relative w-9 h-9 bg-background   rounded-full text-2xl font-bold text-primary cursor-pointer  justify-center">
                <span className=" absolute top-0 left-2.5">+</span>
              </p>
              <p>creater  collection</p>
            </div>
            <div className=" flex-1 bg-tertiary/30 rounded-lg p-4 min-w-32 h-32 flex flex-col justify-between">
              <p className=" relative w-9 h-9 bg-background   rounded-full text-2xl font-bold text-primary cursor-pointer  justify-center">
                <span className=" absolute top-0 left-2.5">+</span>
              </p>

              <p>create Projects</p>
            </div>
            <div className=" flex-1 bg-tertiary/30 rounded-lg p-4 min-w-32 h-32 flex flex-col justify-between">
              <p className=" relative w-9 h-9 bg-background   rounded-full text-2xl font-bold text-primary cursor-pointer  justify-center">
                <span className=" absolute top-0 left-2.5">+</span>
              </p>

              <p>create Challenges</p>
            </div>
          </div>
        </div>

        {/* resources and collections */}
        <div className="flex flex-col space-y-6 items-center md:flex-row md:items-start md:space-x-4 md:space-y-0">
          {/* resource, a single interface that show a particular resource  */}
          <div className="border border-violet-500">
            {/* url in image form  */}
            <p className="hidden md:block">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repellendus possimus harum natus. Possimus quae laboriosam magnam omnis. Quisquam fuga repellendus quod reprehenderit, deleniti vero labore neque veniam facilis quo corrupti.</p>
          </div>

          {/* collections cars */}
          <div className="border">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deserunt adipisci ex tenetur id! Deserunt optio fhfjbsodfub fuga.
          </div>
        </div>
        
      </div>
      
    </section>
  )
}
