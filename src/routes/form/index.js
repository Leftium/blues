import * as cheerio from 'cheerio';
import MarkdownIt from 'markdown-it';


const URL_FORM = 'https://docs.google.com/forms/d/e/1FAIpQLSf1v-qc7z0hCY-_izfUH7sYU4AZNvyesCC9-V1LmjdaVZJJig/viewform'

export async function get({ url }) {
    const formUrl   = url.searchParams.get('u') || URL_FORM;
    const noMarkdown = url.searchParams.has('nomd') || false;


    let resp = await fetch(formUrl);
    let formHtml = await resp.text();

    let $ = cheerio.load(formHtml);

    let title = $('meta[property="og:title"]').attr('content')       || '';
    let text  = $('meta[property="og:description"]').attr('content') || '';

    let inputDivs = $('[data-params]');
    let formParams = [];

    function extractOptions(options) {
        let result = [];
        for (let option of options) {
            if (option[0] != '') {
                result.push(option[0]);
            }
        }
        return result;
    }

    for (let div of inputDivs) {
        let string = div.attribs['data-params'].replace(/^[^[]*/, '[');
        let arrays = JSON.parse(string);
        formParams.push({
            //string,
            name: arrays[0][1],
            entry: arrays[0][4][0][0],
            required: arrays[0][4][0][2],
            description: arrays[0][2],
            options: extractOptions(arrays[0][4][0][1])
        });
    }

    let html = text;

    // Linkify 확인.
    html = html.replace(/(.*신청\s*확인.*)\n^(https:..docs.google.com.*)/m, '[$1]($2)');

    let lines = html.split('\n').map((line) => {
        let newLine = line;

        // Convert ~~~ line to <hr>.
        newLine = newLine.replace(/^\s*~{6,}\s/, '\n---\n');

        // Linkify 장소.
        let locationLink = 'https://map.kakao.com/?itemId=1259064592';
        newLine = newLine.replace(/(장소:\s*)(홍대 나인빠)/, `$1 [$2](${locationLink})`);

        // Make <h3> tags before adding other tags.
        newLine = newLine.replace(/\<(.+)\>/, '### $1\n');

        // Make labels bold.
        let lineBeforeBolding = newLine;
        if (!line.includes('오후') ) {
            newLine = newLine.replace(/^(- )?(\s*)?([^:]*?:)/, '$1$2**$3**');
            newLine = newLine.replace(/^(- )?(\d{4})(\s+)/, '$1**$2**$3');

            // Don't put <b> tag in middle of URL.
            if(/https:\*\*/.test(newLine) || /#{1,5}/.test(newLine)) {
                newLine = lineBeforeBolding;
            }
        }

        return newLine;
    });
    html = lines.join('\n');

    if (!noMarkdown) {
        const md = new MarkdownIt({
            html: true,
            breaks: true
        }).disable(['fence', 'strikethrough']);
        html = md.render(html);
    }

    // Make fieldsets after <br>'s were added.
    html = html.replace(/<p>~{3,}([^~]+)~{3,}\s*<br>\n(.*?)\<.p\>\n/sg, '<fieldset><legend>$1</legend>$2</fieldset>\n');

    return {
        body: {
            title,
            text,
            html,
            formUrl,
            formParams
        }
    }

}