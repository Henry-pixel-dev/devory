import * as cheerio from 'cheerio';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    
    if (!url) {
        return new Response(JSON.stringify({ error: 'Missing URL parameter' }), { status: 400 });
    }

    
    const response = await fetch(url);
    console.log("preview:", url, response.status, response.url)
    const html = await response.text();
    const $ = cheerio.load(html);
    console.log("html length:", html.length)
    console.log("og:title:", $('meta[property="og:title"]').attr('content'))
    console.log("title tag:", $('title').text())

    const title =
        $('meta[property="og:title"]').attr('content') || $('title').text();
    const description =
        $('meta[property="og:description"]').attr('content') ||
        $('meta[name="description"]').attr('content') || 
        'No description available';
    const image = $('meta[property="og:image"]').attr('content') || '';



  return new Response(JSON.stringify({ title, description, image }), { status: 200 });
    
}
