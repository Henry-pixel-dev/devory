
import { redirect } from "next/navigation"
import { getUser, fetchData } from "@/lib/getUser"
import CollectionCard from "@/components/CollectionCard";
import Input from "@/components/Input";
import CreateCollectionButton from "@/components/CreateCollectionButton";
import FliterSearch from "@/components/FliterSearch";


export default async function Collections({searchParams}: {searchParams: Promise<{q?: string, date?: string}>}) {

  const user = await getUser()

  if (!user) {
    redirect("/signin")
  }

  const { collections: collectionsArray,  resources } = await fetchData()
 
  
  const allResources = collectionsArray.flatMap((collection) => collection.resources)

  console.log("allResources", allResources)

  const resourceOptions = resources.map((resource) => ({
    name: resource.resource_name,
    id: String(resource.id)
  }))

  const { q, date } = await searchParams
  const query = q?.trim().toLowerCase()
  

  const fliteredCollections = collectionsArray.filter((collection) => {
    if (query) {
      const nameMatch = collection.collection_name?.toLowerCase().includes(query) ?? false
      if (!nameMatch) {
        return false
      }
    }
    return true
  })

  const sortedCollections = [...fliteredCollections].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime()
    const dateB = new Date(b.created_at).getTime()
     return date === "oldest" ? dateA - dateB : dateB - dateA
  })

  return (
    <main className="container mx-auto min-h-screen flex flex-col items-center  mt-10">
      <section className="flex flex-col space-y-6 p-6">
        <div className="flex flex-col-reverse gap-6 md:flex-row md:justify-between md:items-start md:space-x-4">
          <div className="flex-1 bg-tertiary/30 rounded-lg p-4 min-w-32 h-32 flex flex-col justify-between md:max-w-32 md:h-32">
              <CreateCollectionButton 
              userId={user.id}
              resourceOptions={resourceOptions}
              >
                <p className=" relative w-9 h-9 bg-background   rounded-full text-2xl font-bold text-primary cursor-pointer  justify-center">
                  <span className=" absolute top-0 left-2.5">+</span>
                </p>
              </CreateCollectionButton>
              <p>creater  collection</p>
            </div>

          <FliterSearch />
            
        </div>


  

        <div>
          <h1 className="text-base text-primary font-light md:font-bold md:text-2xl mb-3">
            Collections
          </h1>
          {sortedCollections.length === 0 && <p className="text-2xl text-center">No collections found.</p>}
          <div className="w-full  grid grid-cols-1 grid-rows-1 sm:grid-cols-2 sm:grid-rows-2 md:grid-cols-3 md:grid-rows-3 gap-4">
            {sortedCollections.map((collection) => (
              <div key={collection.id}>
                {CollectionCard(collection.collection_name)}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
