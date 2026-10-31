// lib/getResource.ts
import { createClient } from "@/lib/supabase/server"

export async function getResource(id: number, userId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("id", id)
        .eq("user_id", userId)
        .maybeSingle()

    if (error) throw error
    return data
}