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

    // Make <h2> tags.
    html = html.replace(/<(.+)>\n/mg, '<h2>$1</h2>');

    // Linkify 확인.
    html = html.replace(/(.*신청\s*확인.*)\n^(https:..docs.google.com.*)/m, '<a href="$2">$1</a>');

    // Make fieldsets.
    html = html.replace(/~{3,}([^~]+)~{3,}\s*(.*?\n)\n/sg, '<fieldset><legend>$1</legend>$2</fieldset>\n');

    // Add <br> for each newline.
    html = html.replace(/\n/mg, '<br>$&');


    let lines = html.split('\n');
    lines = lines.map((line) => {
        let newLine = line;

        // Convert ~~~ line to <hr>.
        newLine = newLine.replace(/^\s*~{3,}\s/, '\n<hr>\n');

        // Linkify 장소.
        let locationLink = 'https://map.kakao.com/?itemId=1259064592';
        newLine = newLine.replace(/(장소:\s*)(홍대 나인빠)/, `$1 <a href=${locationLink}>$2</a>`);

        // Make labels bold.
        if (!line.includes('오후') ) {
            newLine = newLine.replace(/^[^:]*?:/, '<b>$&</b>');
            // Don't put <b> tag in middle of URL.
            if(newLine.includes('https:</b>')) {
                newLine = line;
            }
        }

        return newLine;
    });
    html = lines.join('\n');


    return {
        body: {
            title,
            text,
            html
        }
    }

}