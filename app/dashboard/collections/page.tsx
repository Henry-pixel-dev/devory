
import { redirect } from "next/navigation"
import { getUser, fetchData } from "@/lib/getUser"
import CollectionCard from "@/components/CollectionCard";
import Input from "@/components/Input";

export default async function Collections() {

  const user = await getUser()

  if (!user) {
    redirect("/signin")
  }

  const { collections: collectionsArray } = await fetchData()

  return (
    <main className="container mx-auto min-h-screen flex flex-col items-center  mt-10">
      <section className="flex flex-col space-y-6 p-6">
        <div className="flex flex-col space-y-1">
          <div className="flex-1 bg-tertiary/30 rounded-lg p-4 min-w-32 h-32 flex flex-col justify-between">
              <p className=" relative w-9 h-9 bg-background   rounded-full text-2xl font-bold text-primary cursor-pointer  justify-center">
                <span className=" absolute top-0 left-2.5">+</span>
              </p>
              <p>creater  collection</p>
            </div>

            
        </div>


  

        <div>
          <h1 className="text-base text-primary font-light md:font-bold md:text-2xl mb-3">
            Collections
          </h1>
          <div className="w-full  grid grid-cols-1 grid-rows-1 sm:grid-cols-2 sm:grid-rows-2 md:grid-cols-3 md:grid-rows-3 gap-4">
            {collectionsArray.map((collection) => (
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
