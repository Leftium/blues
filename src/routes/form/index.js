import * as cheerio from 'cheerio';
import MarkdownIt from 'markdown-it';

// These form inputs should reset every time.
const DONT_REMEMBER = [
    '신청',
    '추천인',
    '금발친소',
    '협찬',
];

const URL_FORM = 'https://forms.gle/3onUGgqwoSHDmuVZ9';

function embedYoutube(id) {
    return `<div class=wrap-youtube>
                <iframe class=youtube src="https://www.youtube.com/embed/${id}?rel=0&controls=1&modestbranding=1" allowfullscreen></iframe>
            </div>`
}

export async function GET({ url }) {
    let formUrl      = url.searchParams.get('u')     || URL_FORM;
    let confirmUrl   = '/';
    const noMarkdown = url.searchParams.has('nomd')  || false;
    const party      = url.searchParams.get('party') || url.searchParams.has('party');
    const clazz      = url.searchParams.get('class') || null;



    if (clazz == 'tue') {
        formUrl = 'https://url.kr/eab5c1';
        confirmUrl = '/?class=tue';
    }

    if (clazz == 'sun') {
        formUrl = 'https://forms.gle/KM5VEMoURYGUUwT37';
        confirmUrl = '/?class=sun';
    }

    if (party == 'sun') {
        formUrl = 'https://forms.gle/RwZpwLf64Y8MAkKw6';
        confirmUrl = '/?party=sun';
    } else if (party) {
        formUrl = 'https://forms.gle/8EKEMbfpDu4sSxsU9';
        confirmUrl = '/?party=tue';
    }

    const subdomain = url.hostname.split(".")[0];

    if (subdomain == 'balboa') {
        formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSc6ynauvG7fkclSPfi1dVk2N_7riL2VfHPfoULzo0uTW2YTjA/viewform'
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
    if (matches?.length && matches[1]) {
        headerImage = matches[1];
    }

    // Extract images.
    const images = [];
    const $img = $('[role=listitem] img');

    for (const element of $img) {
        const $element = $(element);
        const src      = $element.attr('src');

        const $textElement = $($element?.parent()?.parent().prev());
        const $textDivs    = $('div div div', $textElement);

        const title       = $($textDivs[0])?.text();
        const description = $($textDivs[1])?.text();

        images.push({src, title, description});
    }

    let inputDivs = $('[data-params]');
    let formParams = [];

    function extractOptions(options) {
        if (!options) {
            return []
        }

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
    html = html.replace(/(\s*)((.*신청)?\s*(확인)?(하기)?.*)\n^(https:.*)/mg, '$1[$2]($6)');

    matches = null;
    let lines = html.split('\n').map((line) => {
        let newLine = line;

        if (matches = line.match(/https:..youtu.be\/(.*)/)) {
            newLine = embedYoutube(matches[1])
        } else {
            // Make <h3> tags before adding other tags.
            newLine = newLine.replace(/\<+([^>]+)\>+/, '### $1\n');
        }

        // Convert ~~~ line to <hr>.
        newLine = newLine.replace(/^\s*~{6,}\s*/, '\n---\n');

        // Linkify 장소.
        let locationLink = 'https://map.kakao.com/?itemId=1259064592';
        newLine = newLine.replace(/(장소\s*:\s*)(.*(홍대\s* ).*)/, `$1 [$2](${locationLink})`);



        matches = newLine.match(/(.*?):(.*)/)
        const labelIncludesDigit = matches && /\d/.test(matches[1])
        const textIncludesPm     = matches && matches[2].includes('오후')

        // console.log({matches, labelIncludesDigit, textIncludesPm})

        // Make labels bold.
        let lineBeforeBolding = newLine;
        if (!labelIncludesDigit && !textIncludesPm) {
            newLine = newLine.replace(/^(- )?(\s*)?([^:]*?) ?:/, '$1$2**$3**: ');
            newLine = newLine.replace(/^(- )?(\d{4})(\s+)/, '$1**$2** $3');

        // Don't put <b> tag in middle of URL.
        // Or headers.

        if(/https\*\*\:\s/.test(newLine) || /#{1,5}/.test(newLine)) {
                newLine = lineBeforeBolding;
            }
        }

        // console.log({oldLine: line, newLine})

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
