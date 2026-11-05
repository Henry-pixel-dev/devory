import { createClient } from "./supabase/server"
import { FREE_LIMITS } from "./limits"

type LimitResult = { allowed: boolean; count: number; limit: number | null }

export async function checkLimit(kind: keyof typeof FREE_LIMITS): Promise<LimitResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not signed in")

  // 1. premium users have no limit (no row, or any read problem, counts as free)
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .maybeSingle()

  if (profile?.plan === "premium") {
    return { allowed: true, count: 0, limit: null }
  }

  // 2. count this user's rows (RLS limits the count to their own)
  const { count, error } = await supabase
    .from(kind)
    .select("id", { count: "exact", head: true })

  if (error) throw new Error(`Failed to count ${kind}: ${error.message}`)

  const limit = FREE_LIMITS[kind]
  const used = count ?? 0
  return { allowed: used < limit, count: used, limit }
}