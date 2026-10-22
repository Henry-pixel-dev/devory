
import { redirect } from "next/navigation"
import { getUser, fetchData } from "@/lib/getUser"
import CollectionCard from "@/components/CollectionCard";

export default async function Collections() {

  const user = await getUser()

  if (!user) {
    redirect("/signin")
  }

  const { collections: collectionsArray } = await fetchData()

  return (
    <main className="container mx-auto minh-screen flex flex-col items-center pt-12">
      <section className="w-full flex flex-col md:grid md:grid-cols-2 md:grid-rows-2 gap-4">
        {collectionsArray.map((collection) => (
          <div key={collection.id}>
            {CollectionCard(collection.collection_name)}
          </div>
        ))}
      </section>
    </main>
  )
}
