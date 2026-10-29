import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { seedUserData } from '@/lib/seedUserData'
import CollectionCard from "@/components/CollectionCard";
import { fetchData } from "@/lib/getUser"
import ResourcesCard from '@/components/ResourcesCard'
import AddResourceButton from "@/components/AddResourceButton";


function getShuffledArray<T>(array: readonly T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
    

export default async function HomePage() {
  const supabase = await createClient()

  const { data: {user} } = await supabase.auth.getUser()

  if (!user) {
    redirect("/signin")
  }
  
  if (!user.user_metadata?.seeded) {
    try {
      // 2. run the seed for this user
      await seedUserData(user.id)
      // 3. only after it succeeds, set the flag
      await supabase.auth.updateUser({ data: { seeded: true } })
    } catch (err) {
      console.error("Seeding failed:", err)
    }
  }

  const { collections: collectionsArray } = await fetchData()
 
  
 const allResources = collectionsArray.flatMap((collection) => collection.resources)
 const shuffledResources = getShuffledArray(allResources)

  console.log("collectionsArray", collectionsArray)
  console.log("allResources", allResources)

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
            amadeor
          </h2>
          <div className="flex flew-wrap space-x-3 items-start overflow-y-auto">
            {/* cards */}
            <div className=" flex-1 bg-tertiary/30 rounded-lg p-4 min-w-32 h-32 flex flex-col justify-between">
              <AddResourceButton userId={user.id}>
                <p className=" relative w-9 h-9 bg-background   rounded-full text-2xl font-bold text-primary cursor-pointer  justify-center">
                  <span className=" absolute top-0 left-2.5">+</span>
                </p>
              </AddResourceButton>

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
        <div className="flex flex-col space-y-6 items-center md:flex-row-reverse md:items-start md:gap-6 md:space-y-0">
          {/* resource, a single interface that show a particular resource  */}
          
           
           {shuffledResources.slice(0, 1).map((preview, index) => (
             <div key={index}>
               <ResourcesCard
                 image={preview.resource_image}
                 title={preview.resource_name}
                 type={preview.resource_type}
                 description={preview.resource_description}
               />
             </div>
           ))}
          

          {/* collections cars */}
          <div className="flex-2 ">
            <p className="md:hidden mb-3">Current collection</p>
            <div className="flex flex-col md:grid md:grid-cols-2 md:grid-rows-2 gap-4">
              {collectionsArray.slice(0, 4).map((collection) => (
                <div key={collection.id}>
                  {CollectionCard(collection.collection_name)}
                </div>
              ))}
            </div>
          </div>
        </div>
        
      </div>
      
    </section>
  )
}
