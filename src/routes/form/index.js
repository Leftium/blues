import * as cheerio from 'cheerio';
import MarkdownIt from 'markdown-it';

// These form inputs should reset every time.
const DONT_REMEMBER = [
    '신청',
    '나인빠 블루스 소셜 추천인'
];

const URL_FORM = 'https://docs.google.com/forms/d/e/1FAIpQLSf1v-qc7z0hCY-_izfUH7sYU4AZNvyesCC9-V1LmjdaVZJJig/viewform'

function embedYoutube(id) {
    return `<div class=wrap-youtube>
                <iframe class=youtube src="https://www.youtube.com/embed/${id}?rel=0&controls=1&modestbranding=1" allowfullscreen></iframe>
            </div>`
}

export async function get({ url }) {
    let formUrl      = url.searchParams.get('u')     || URL_FORM;
    let confirmUrl   = '/';
    const noMarkdown = url.searchParams.has('nomd')  || false;
    const party      = url.searchParams.has('party') || false;

    if (party) {
        formUrl = 'https://forms.gle/fhUwRn6aAfFgDwdt9';
        confirmUrl = '/?party';
    }

    let resp = await fetch(formUrl);
    let formHtml = await resp.text();

    let $ = cheerio.load(formHtml);

    const title      = $('meta[property="og:title"]').attr('content')       || '';
    const text       = $('meta[property="og:description"]').attr('content') || '';
    const formAction = $('form').attr('action')                             || '';

    // Extract header image.
    let matches = formHtml.match(/background-image: url\(([^)]*)/);

    let headerImage = '';
    if (matches.length && matches[1]) {
        headerImage = matches[1];
    }

    // Extract images.
    const images = [];
    const $img = $('[role=listitem] img');

    for (const element of $img) {
        const $element = $(element);
        const src      = $element.attr('src');
        const caption  = $element?.parent()?.parent()?.parent()?.text()
                                 ?.replace('Your answer', '')
                                 ?.replace('내 답변', '');
        images.push({src, caption});
    }

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
            remember: !DONT_REMEMBER.includes(arrays[0][1]),
            description: arrays[0][2],
            options: extractOptions(arrays[0][4][0][1])
        });
    }

    let html = text;

    // Linkify 확인.
    html = html.replace(/(\s*)((.*신청)?\s*확인.*)\n^(https:..docs.google.com.*)/m, '$1[$2]($4)');

    matches = null;
    let lines = html.split('\n').map((line) => {
        let newLine = line;

        if (matches = line.match(/https:..youtu.be\/(.*)/)) {
            newLine = embedYoutube(matches[1])
        } else {
            // Make <h3> tags before adding other tags.
            newLine = newLine.replace(/\<(.+)\>/, '### $1\n');
        }

        // Convert ~~~ line to <hr>.
        newLine = newLine.replace(/^\s*~{6,}\s/, '\n---\n');

        // Linkify 장소.
        let locationLink = 'https://map.kakao.com/?itemId=1259064592';
        newLine = newLine.replace(/(장소\s*:\s*)((홍대\s* )?나인빠)/, `$1 [$2](${locationLink})`);

        // Make labels bold.
        let lineBeforeBolding = newLine;
        if (!line.includes('오후') ) {
            newLine = newLine.replace(/^(- )?(\s*)?([^:]*?:)/, '$1$2**$3** ');
            newLine = newLine.replace(/^(- )?(\d{4})(\s+)/, '$1**$2** $3');

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
            breaks: true,
            linkify: true
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
            images,
            formUrl,
            formAction,
            formParams,
            confirmUrl,
            headerImage,
            party
        }
    }

}
