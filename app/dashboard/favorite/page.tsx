import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getFavorites } from "@/lib/getFavorite"
import { getImageUrl } from "@/lib/getImageUrl";
import ResourcesCard from "@/components/ResourcesCard";

export default async function Favorite() {
  const supabase = await createClient()

  const { data: {user} } = await supabase.auth.getUser()

  if (!user) {
    redirect("/signin")
  }


  const favorites = await getFavorites(user.id)

  const resourcesWithImages = await Promise.all(
      favorites.map(async (resource) => ({
        ...resource,
        imageUrl: await getImageUrl(resource.resource_image ?? null),
      }))
    )

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-base text-primary font-light md:font-bold md:text-2xl mb-3">
        Favorite Resources
      </h1>
      {resourcesWithImages.length === 0 && <p className="text-2xl text-center">No favorite resources Selected.</p>}
      <div className="flex flex-col space-y-4 md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resourcesWithImages.map((resource) => (
          <ResourcesCard
            userid={user.id}
            key={resource.id}
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
  )
}
