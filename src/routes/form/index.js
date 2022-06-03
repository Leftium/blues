import * as cheerio from 'cheerio';


const URL_FORM = 'https://docs.google.com/forms/d/e/1FAIpQLSf1v-qc7z0hCY-_izfUH7sYU4AZNvyesCC9-V1LmjdaVZJJig/viewform'

export async function get({ url }) {
    let fetchUrl = url.searchParams.get('u') || URL_FORM;

    let resp = await fetch(fetchUrl);
    let formHtml = await resp.text();

    let $ = cheerio.load(formHtml);

    let title = $('meta[property="og:title"]').attr('content')       || '';
    let text  = $('meta[property="og:description"]').attr('content') || '';

    let html = text;

    // Add <br> for each newline.
    html = html.replace(/\n/mg, '<br>$&');

    return {
        body: {
            title,
            text,
            html
        }
    }

}