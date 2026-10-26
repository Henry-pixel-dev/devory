import * as cheerio from 'cheerio';

export async function fetchPreviews(url : string) {
    
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const title =
        $('meta[property="og:title"]').attr('content') || $('title').text();
    const description =
        $('meta[property="og:description"]').attr('content') ||
        $('meta[name="description"]').attr('content') || 
        'No description available';
    const image = $('meta[property="og:image"]').attr('content') || './logo_transparent-.png';


  return  { title, description, image, author: "Unknown" }
    
}
