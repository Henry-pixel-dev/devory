// lib/getImageUrl.ts
import { createClient } from "./supabase/server"

const DEFAULT_IMAGE_PATH = "defaults/logo_transparent-.png"

export async function getImageUrl(value: string | null) {
    // old rows that already hold a usable address
    if (value && (value.startsWith("http") || value.startsWith("/"))) return value

    // new rows hold a path; empty values use the default path
    const supabase = await createClient()
    return supabase.storage
        .from("resource-images")
        .getPublicUrl(value || DEFAULT_IMAGE_PATH).data.publicUrl
}