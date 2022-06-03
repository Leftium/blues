import * as cheerio from 'cheerio';


const URL_FORM = 'https://docs.google.com/forms/d/e/1FAIpQLSf1v-qc7z0hCY-_izfUH7sYU4AZNvyesCC9-V1LmjdaVZJJig/viewform'

export async function get() {
    let resp = await fetch(URL_FORM);
    let html = await resp.text();

    let $ = cheerio.load(html);

    let title = $('meta[property="og:title"]').attr('content');
    let text  = $('meta[property="og:description"]').attr('content');


    return {
        body: {
            title,
            text
        }
    }

}