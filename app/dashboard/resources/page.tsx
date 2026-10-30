import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { fetchData } from "@/lib/getUser"
import ResourcesCard from "@/components/ResourcesCard";
import { getImageUrl } from "@/lib/getImageUrl";
import AddResourceButton from "@/components/AddResourceButton";
import { FiFilter } from 'react-icons/fi'
import Resource_Fliter from "@/components/Resource_Fliter";


export default async function Resources() {
  const supabase = await createClient()

  const { data: {user} } = await supabase.auth.getUser()

  if (!user) {
    redirect("/signin")
  }

  const { collections: collectionsArray, uncategorizedResources } = await fetchData()

    const allResources = [...uncategorizedResources, ...collectionsArray.flatMap((collection) => collection.resources)]

    const resourcesWithImages = await Promise.all(
      allResources.map(async (resource) => ({
        ...resource,
        imageUrl: await getImageUrl(resource.resource_image ?? null),
      }))
    )

  return (
    <section className="container mx-auto flex flex-col  space-y-8 md:mt-10 p-6 "> 
    <div className="flex flex-col-reverse gap-6 md:flex-row md:justify-between md:items-start md:space-x-4">
      <div className=" flex-1 bg-tertiary/30 rounded-lg p-4 max-w-32 h-32 flex flex-col justify-between md:max-w-32 md:h-32">
        <AddResourceButton userId={user.id}>
          <p className=" relative w-9 h-9 bg-background   rounded-full text-2xl font-bold text-primary cursor-pointer  justify-center ">
            <span className=" absolute top-0 left-2.5">+</span>
          </p>
        </AddResourceButton>
        <p>Create resources</p>
      </div>

      {/* convert to a fliter button  seperate component client side */}
      <Resource_Fliter />

    </div>

    <div>
      <h1 className="text-base text-primary font-light md:font-bold md:text-2xl mb-3">
        Resources
      </h1>
      <div className="flex flex-col space-y-4 md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resourcesWithImages.map((resource) => (
          <ResourcesCard
            key={resource.id}
            image={resource.imageUrl}
            title={resource.resource_name}
            type={resource.resource_type}
            description={resource.resource_description}
          />
        ))}
      </div>
    </div>
    </section>
  )
}
