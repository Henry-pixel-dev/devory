import type { UserData, CollectionWithResources  } from "./types"
import { createClient } from "./supabase/server"

export async function getUser() {
    const supabase = await createClient()

    const { data: {user} } = await supabase.auth.getUser()

	return user 
}

export async function fetchData(): Promise<UserData> {
    const supabase = await createClient()

    const [collectionsRes, resourcesRes, linksRes] = await Promise.all([
      supabase.from("collections").select("id, collection_name"),
      supabase.from("resources").select("id, resource_name, resource_url, resource_description, resource_type, resource_image, is_favorite, created_at"),
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


    return { collections: collectionsArray, uncategorizedResources }
}
