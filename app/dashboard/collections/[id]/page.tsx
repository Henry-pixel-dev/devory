import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { getCollection } from "@/lib/getCollection"
import { getImageUrl } from "@/lib/getImageUrl";
import ResourcesCard from "@/components/ResourcesCard";

export default async function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const numericId = Number(id)

    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/signin")
    }

    const collection = await getCollection(numericId, user.id)
    if (!collection) {
        notFound()
    }
    const resourcesWithImages = await Promise.all(
      collection.resources.map(async (resource) => ({
        ...resource,
        imageUrl: await getImageUrl(resource.resource_image ?? null),
      }))
    )

  return (
    <section className="min-h-screen container mx-auto flex flex-col items-center space-y-8 md:mt-10 p-6">
        <div>
      <h1 className="text-base text-primary font-light md:font-bold md:text-2xl mb-3">
        Resources
      </h1>
      {resourcesWithImages.length === 0 && <p className="text-2xl text-center">No resources found.</p>}
      <div className="flex flex-col space-y-4 md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resourcesWithImages.map((resource) => (
          <ResourcesCard
            key={resource.id}
            userid={user.id}
            id={Number(resource.id)}
            image={resource.imageUrl}
            title={resource.resource_name}
            type={resource.resource_type}
            description={resource.resource_description}
            url={resource.resource_url}
            is_favorite={resource.is_favorite}
          />
        ))}
      </div>
    </div>
    </section>
  )
}
