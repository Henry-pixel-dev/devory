import { downloadImage } from "@/lib/downloadImage";
import { createClient } from "@/lib/supabase/server";

const EXTENSIONS: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
}

export async function POST(request: Request) {
  const { imageUrl } = await request.json()  

  if (!imageUrl) {
    return new Response(JSON.stringify({ error: 'Missing URL parameter' }), { status: 400 });
    }

    try{
        const { buffer, contentType } = await downloadImage(imageUrl)
        const path = `previews/${crypto.randomUUID()}.${EXTENSIONS[contentType]}`

        const supabase = await createClient()
        const { error } = await supabase.storage
            .from("resource-images")
            .upload(path, buffer, { contentType })

        if (error) throw error

        return Response.json({ path })
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Image upload failed' }), { status: 500 });
    }

    
}