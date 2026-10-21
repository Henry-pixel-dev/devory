import { createClient } from "@/lib/supabase/server"
import Image from "next/image";
import { redirect } from "next/navigation"
import manURL from "@/public/man.webp"
import { LuArrowUpRight} from 'react-icons/lu';
import { seedUserData } from '@/lib/seedUserData'
import CollectionCard from "@/components/CollectionCard";
import type { CollectionWithResources } from "@/lib/types"





    

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

  
    const [collectionsRes, resourcesRes, linksRes] = await Promise.all([
      supabase.from("collections").select("id, collection_name"),
      supabase.from("resources").select("id, resource_name, resource_url, resource_description, is_favorite"),
      supabase.from("collection_resources").select("collection_id, resource_id"),
    ])

    const { data: collections, error: collectionsError } = collectionsRes
    const { data: resources, error: resourcesError } = resourcesRes
    const { data: links, error: linksError } = linksRes

    if (collectionsError || resourcesError || linksError) {
      throw new Error(`There is an error fetching : ${collectionsError}, ${resourcesError}, ${linksError}`)
    }

    const collectionsArray: CollectionWithResources[] =
      collections?.map((collection) => {
        const resourceIds =
          links
          ?.filter((link) => link.collection_id === collection.id)
          .map((link) => link.resource_id) ?? [];

        const collectionResources =
          resources?.filter((resource) =>
          resourceIds.includes(resource.id)
        ) ?? [];

        return {
          id: collection.id,
          collection_name: collection.collection_name,
          resources: collectionResources,
        };
    }) ?? []; 

  const linkedResourceIds = new Set(
    links?.map((link) => link.resource_id) ?? []
  );

  const uncategorizedResources =
    resources?.filter(
      (resource) => !linkedResourceIds.has(resource.id)
  ) ?? [];

   
  

 
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
        <div className="flex flex-col space-y-6 items-center md:flex-row-reverse md:items-start md:gap-6 md:space-y-0">
          {/* resource, a single interface that show a particular resource  */}
            {/* url in image form  */}
          <div className=" w-full flex-1 flex flex-row space-x-3 p-3  items-center  md:max-w-64 rounded-2xl border border-amber-400 md:flex-col md:rounded-none md:p-0">
            <Image
              src={manURL}
              alt="Devory Logo"
              placeholder="blur"
              quality={70}
              className="w-full h-32"
            />
            <div>
              <h3 className="mb-3">Tittle of the resoruces</h3>
              <p className="md:hidden mb-3">Authour Henry</p>
            </div>
            <p className="hidden md:block">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repellendus possimus harum natus. Possimus quae laboriosam magnam omnis.
            </p>

            <div className="self-start flex flex-col justify-between space-y-12 md:hidden ">
              <div className="max-w-4 max-h-9 relative bg-tertiary/30 rounded-lg p-4 ">
                <LuArrowUpRight width={50} height={50} className="absolute top-2 left-2"/>
              </div>

              
            </div>
          </div>

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
