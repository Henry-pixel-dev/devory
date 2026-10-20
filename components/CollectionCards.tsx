"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export default function CollectionCards() {

    type Resource = {
        id: number;
        resource_name: string;
        resource_url: string;
        resource_description?: string;
        is_favorite: boolean;
    };

    type CollectionWithResources = {
        id: string;
        collection_name: string;
        resources: Resource[];
    };

    type UserData = {
        collections: CollectionWithResources[];
        uncategorizedResources: Resource[];
    };

    const [data, setData] = useState<UserData>({
        collections: [],
        uncategorizedResources: [],
    });
    const [loading, setLoading] = useState(true);

    


    useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient()

            const { data: { user },error: userError, } = await supabase.auth.getUser();
                console.log("1. User:", user);
                console.log("1b. User error:", userError);

            if (!user) {
                console.log("No user found");
                setLoading(false);
                return;
            }

             // 1. Fetch collections
            const { data: collections, error: collectionsError } = await supabase
                .from("collections")
                .select("id, collection_name")
                .eq("user_id", user.id);

                console.log("2. Collections:", collections);
                console.log("2b. Collections error:", collectionsError);

                // 2. Fetch resources
            const { data: resources, error: resourcesError } = await supabase
                .from("resources")
                .select(
                "id, resource_name, resource_url, resource_description, is_favorite"
                )
                .eq("user_id", user.id);

                console.log("3. Resources:", resources);
                console.log("3b. Resources error:", resourcesError)


            // 3. Fetch junction table
            const { data: links , error: linksError} = await supabase
                .from("collection_resources")
                .select("collection_id, resource_id");

                console.log("4. Links:", links);
                console.log("4b. Links error:", linksError);  

            const collectionsWithResources: CollectionWithResources[] =
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
            
            // 5. Uncategorized resources
            const linkedResourceIds = new Set(
                links?.map((link) => link.resource_id) ?? []
            );

            const uncategorizedResources =
                resources?.filter(
                (resource) => !linkedResourceIds.has(resource.id)
                ) ?? [];

            setData({
                collections: collectionsWithResources,
                uncategorizedResources,
            });
            setLoading(false);


        }
        fetchData()

        
    }, [])


    
  return (
    <div>collection</div>
  )
}
