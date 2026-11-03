import * as cheerio from 'cheerio';


export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    
    if (!url) {
        return new Response(JSON.stringify({ error: 'Missing URL parameter' }), { status: 400 });
    }

    const hostname = new URL(url).hostname
    console.log("hostname:", hostname)

    const YOUTUBE_HOSTS = ["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"]

    if (YOUTUBE_HOSTS.includes(hostname)) {
        try {
            const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
            const oembedRes = await fetch(oembedUrl)

            if (oembedRes.ok) {
                const oembed = await oembedRes.json()
                return new Response(
                    JSON.stringify({
                        title: oembed.title,
                        description: `By ${oembed.author_name}`,
                        image: oembed.thumbnail_url,
                    }),
                    { status: 200 }
                )
            }
        } catch (error) {
            console.error("oembed failed:", error)
        }
    }



    
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    

    const title =
        $('meta[property="og:title"]').attr('content') || $('title').text();
    const description =
        $('meta[property="og:description"]').attr('content') ||
        $('meta[name="description"]').attr('content') || 
        'No description available';
    const image = $('meta[property="og:image"]').attr('content') || '';



  return new Response(JSON.stringify({ title, description, image }), { status: 200 });
    
}
