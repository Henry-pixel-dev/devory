const MAX_SIZE = 5 * 1024 * 1024 // 5 MB

export async function downloadImage(imageUrl: string) {
    // 1. only allow http or https (new URL(...) and .protocol can tell you)
    const url = new URL(imageUrl)
    if (url.protocol !== "http:" && url.protocol !== "https:") {
        throw new Error("Only http and https URLs are allowed")
    }

    const res = await fetch(imageUrl, { signal: AbortSignal.timeout(8000) })

    // 2. if the response is not ok, throw an error

    const contentType = res.headers.get("content-type") ?? ""
    // 3. if contentType doesn't start with "image/", throw an error

    const buffer = await res.arrayBuffer()
    // 4. if buffer.byteLength is bigger than MAX_SIZE, throw an error

    return { buffer, contentType }
}