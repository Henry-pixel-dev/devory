import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { checkLimit } from "@/lib/access"

type Body = {
  url?: string
  name?: string
  description?: string | null
  type?: string | null
  image?: string | null
  collectionIds?: number[]
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

    let body: Body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: "invalid_body" }, { status: 400 })
    }

    const url = body.url?.trim()
    const name = body.name?.trim()
    if (!url || !name) {
      return NextResponse.json({ error: "missing_fields" }, { status: 400 })
    }

    // the lock
    const limit = await checkLimit("resources")
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "limit_reached", kind: "resources", limit: limit.limit },
        { status: 403 }
      )
    }

    const { data: resource, error } = await supabase
      .from("resources")
      .insert({
        user_id: user.id,
        resource_name: name,
        resource_url: url,
        resource_description: body.description?.trim() || null,
        resource_type: body.type?.trim() || "",
        resource_image: body.image
      })
      .select("id")
      .single()

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "duplicate" }, { status: 409 })
      }
      console.error("Failed to save resource:", error)
      return NextResponse.json({ error: "save_failed" }, { status: 500 })
    }

    // optional: link to the collections the user picked
    const ids = Array.isArray(body.collectionIds)
      ? body.collectionIds.filter((n): n is number => typeof n === "number")
      : []

    let linked = true
    if (ids.length > 0) {
      const { error: linkError } = await supabase
        .from("collection_resources")
        .insert(ids.map((id) => ({ collection_id: id, resource_id: resource.id })))
      if (linkError) {
        console.error("Failed to link resource:", linkError)
        linked = false
      }
    }

    return NextResponse.json({ ok: true, id: resource.id, linked })
  } catch (err) {
    console.error("POST /api/resources failed:", err)
    return NextResponse.json({ error: "server_error" }, { status: 500 })
  }
}