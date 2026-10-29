import { downloadImage } from "@/lib/downloadImage";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");  

  if (!url) {
    return new Response(JSON.stringify({ error: 'Missing URL parameter' }), { status: 400 });
    }

    try{
        const downloadedImage = await downloadImage(url)
        return new Response(downloadedImage.buffer, {
            headers: { "Content-Type": downloadedImage.contentType },
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to download image' }), { status: 500 });
    }

    
}