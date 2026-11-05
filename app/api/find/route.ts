export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = (searchParams.get("q") ?? "").trim()
  const key = process.env.YOUTUBE_API_KEY

  if (!query || query.length > 200) {
    return Response.json({ error: "Bad request" }, { status: 400 })
  }
  if (!key) {
    console.error("YOUTUBE_API_KEY is not set")
    return Response.json({ error: "Server not configured" }, { status: 500 })
  }

  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoEmbeddable=true&maxResults=1&q=${encodeURIComponent(query)}&key=${key}`
    )
    if (!res.ok) {
      console.error("youtube search failed:", res.status, await res.text())
      return Response.json({ error: "Search failed" }, { status: 502 })
    }
    const data = await res.json()
    const id = data.items?.[0]?.id?.videoId
    if (!id) return Response.json({ error: "Nothing found" }, { status: 404 })
    return Response.json({ url: `https://www.youtube.com/watch?v=${id}` })
  } catch (error) {
    console.error("find failed:", error)
    return Response.json({ error: "Lookup failed" }, { status: 500 })
  }
}