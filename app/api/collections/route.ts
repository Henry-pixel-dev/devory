import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { checkLimit } from "@/lib/access"

type Body = { name?: string; resourceIds?: number[] }

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

    const name = body.name?.trim()
    if (!name) return NextResponse.json({ error: "missing_fields" }, { status: 400 })

    const limit = await checkLimit("collections")
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "limit_reached", kind: "collections", limit: limit.limit },
        { status: 403 }
      )
    }

    const { data: collection, error } = await supabase
      .from("collections")
      .insert({ user_id: user.id, collection_name: name })
      .select("id")
      .single()

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "duplicate" }, { status: 409 })
      }
      console.error("Failed to save collection:", error)
      return NextResponse.json({ error: "save_failed" }, { status: 500 })
    }

    const ids = Array.isArray(body.resourceIds)
      ? body.resourceIds.filter((n): n is number => typeof n === "number")
      : []

    let linked = true
    if (ids.length > 0) {
      const { error: linkError } = await supabase
        .from("collection_resources")
        .insert(ids.map((id) => ({ collection_id: collection.id, resource_id: id })))
      if (linkError) {
        console.error("Failed to link resources:", linkError)
        linked = false
      }
    }

    return NextResponse.json({ ok: true, id: collection.id, linked })
  } catch (err) {
    console.error("POST /api/collections failed:", err)
    return NextResponse.json({ error: "server_error" }, { status: 500 })
  }
}