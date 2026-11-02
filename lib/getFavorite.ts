import { createClient } from "@/lib/supabase/server"

export async function getFavorites(userId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
   
        .eq("is_favorite", true)

        if (error) {
            throw new Error(`Error fetching favorites: ${error.message}`);
        }

        return data || [];
    }