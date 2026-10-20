import { starterPack } from "./starterPack"
import { createClient } from "./supabase/server"

export  async function seedUserData(userId: string)  {
    const supabase = await createClient()
    const {data, error} = await supabase
      .from('collections')
      .insert(
        starterPack.map((collection) => ({
          collection_name: collection.collection_name,
          user_id: userId,
        }))
      )
      .select()

    if (error || !data) {
      console.error(`Failed to create collections:,: ${error?.message}`)
       return
    }

    for ( const starterCollection of starterPack ) {
      const savedCollection = data.find(c => c.collection_name === starterCollection.collection_name)
      if (!savedCollection){
        throw new Error(`Failed to find savedCollection collection `)
      }

      const resourcesToInsert = starterCollection.resources.map((resource) => {
        return {
          resource_name: resource.resource_name,
          resource_url: resource.resource_url,
          resource_description: resource.resource_description,
          user_id : userId,
          is_favorite: false
        }
      })

      const {data: resourceData, error: resourcesError } = await supabase
        .from("resources")
        .insert(resourcesToInsert)
        .select("id")


      if (resourcesError || !resourceData) {
        throw new Error(
          `Failed to insert resources for ${starterCollection.collection_name}: ${resourcesError?.message}`
        )
      }

      const junctionRows = resourceData.map((resource) => ({
        collection_id: savedCollection.id,
        resource_id: resource.id,
      }))

      const { error: linkError } = await supabase
        .from('collection_resources')
        .insert(junctionRows)

      if (linkError) {
        throw new Error(
          `Failed to link resources for ${starterCollection.collection_name}: ${linkError.message}`
        )
      }
    }
  }