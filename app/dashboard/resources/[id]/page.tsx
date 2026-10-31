import { getResource } from "@/lib/getResource";
import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { getImageUrl } from "@/lib/getImageUrl"
import Image from "next/image";



export default async function Resource({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const numericId = Number(id)


    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
        redirect("/signin")
    }

    if (!Number.isInteger(numericId)) {
        notFound()
    }
    
    const resource = await getResource(numericId, user.id)
    
    if (!resource) {
        notFound()
    }

    const imageUrl = await getImageUrl(resource.resource_image ?? null)

  return (
    <section className="min-h-screen container mx-auto flex flex-col items-center space-y-8 md:mt-10 p-6">
        {/* edit and delete buttons */}

      <div className="bg-primary/10 w-full flex-1 flex flex-row space-x-3 p-3  items-center  md:max-w-80 rounded-2xl  md:flex-col md:space-y-4">
        <div className="relative h-24 w-24 shrink-0 md:h-32 md:w-full ">
            <Image
                src={imageUrl}
                fill
                unoptimized
                alt={resource.resource_name}
                className="object-cover"
            />
         </div>
        <div>
            <h3 className="mb-3 font-bold md:text-2xl text-primary whitespace-pre-wrap">
                {resource.resource_name}
            </h3>
            <p className="md:hidden mb-3">
                {resource.resource_type}
            </p>
            <p className="hidden md:block md:text-base text-primary">
              {resource.resource_description}
            </p>
        </div>
        <div className="hidden md:block md:text-base text-primary backdrop:blur-sm bg-tertiary/30 rounded-lg p-2 self-end ">
            <a href={resource.resource_url} target="_blank" rel="noopener noreferrer" className="cursor-pointer ">
                <p className="text-primary text-sm underline">Visit</p>                    
            </a>
         </div>
    </div>
    </section>
  )
}
