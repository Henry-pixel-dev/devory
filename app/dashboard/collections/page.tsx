import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function Collections() {
  const supabase = await createClient()

  const { data: {user} } = await supabase.auth.getUser()

  if (!user) {
    redirect("/signin")
  }
  return (
    <div>Collections</div>
  )
}
