// lib/getCollection.ts
import { createClient } from "@/lib/supabase/server"



export async function getCollection(id: number, userId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
    .from("collections")
    .select(`
        id,
        collection_name,
        resources (
        id,
        resource_name,
        resource_url,
        resource_description,
        resource_type,
        resource_image,
        is_favorite,
        created_at
        )
    `)
    .eq("id", id)
    .maybeSingle()

    if (error) throw error
    return data
    
}