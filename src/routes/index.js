import { seedRandom } from '$lib/random.js'

const GCP_API_KEY    = import.meta.env.VITE_GCP_API_KEY

const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID
const URL_FORM = 'https://docs.google.com/forms/d/e/1FAIpQLSeWt1kc4tjafI60kQDloBpsxpoG3Why-U7XxWgcBIkwNYVRLw/viewform'
const URL_SHEETS = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/%EC%84%A4%EB%AC%B8%EC%A7%80+%EC%9D%91%EB%8B%B5+%EC%8B%9C%ED%8A%B81?majorDimension=ROWS&key=${GCP_API_KEY}`

const specialImages = {
    혜존:    '/img/special/iu.gif',
    헤존:    '/img/special/iu-cooking.gif',
    메이비영: '/img/special/농담곰도리.png',
    나나:    '/img/special/nana.gif',
    뽀냥:    '/img/special/garfield.png',
    세오:    '/img/special/세오.jpg',
    캘리:    '/img/special/kelly.jpg',
    스카:    '/img/special/ska.jpg',
    니오:    '/img/special/neo.jpg',
    미키:    '/img/special/miki.jpg',
    쥴리:    '/img/special/julie.jpg',
    빵이:    '/img/special/빵이.jpg',
    률이:    '/img/special/률이.jpg',
    로미:    '/img/special/romi.jpg',
    romi:    '/img/special/romi.jpg',
    비비안:  '/img/special/vivian.jpg',
    수:      '/img/special/sue.jpg',
    sue:     '/img/special/sue.jpg',
    좐:      '/img/special/john.jpg',
    혀니:     '/img/special/쩐주.jpg',
    사슴:     '/img/special/사슴.jpg',
    사슴이다:  '/img/special/사슴.jpg',
    리스:     '/img/special/리스.jpg',
}

let random = null;

export async function get({ url }) {
    const party  = url.searchParams.has('party')  || false;
    const testId = url.searchParams.get('testid') || null;
    const gallery = url.searchParams.has('gallery') || false;

    let config = {
        urlForm:   URL_FORM,
        urlSheets: URL_SHEETS,
        ctaUrl:    '/form',
        sheetsId:  SPREADSHEET_ID
    };

    let resp = await fetch(config.urlForm);
    let text = await resp.text();

    let title = '';
    let matches = text.match(/<title>(.*)<\/title>/);
    if (matches) {
        title = matches[1];
        title = title.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&amp;/gi, '&');
    }

    random = seedRandom(title);

    let json = { values: []};
    let colName = 0, colSex = 1, colReferer = 2;

    resp = await fetch(config.urlSheets);

    if (gallery) {
        for (const key in specialImages) {
            json.values.push([key]);
        }
    } else {
        json = await resp.json();

        let headers = json.values.shift();  // Get column headers.

        headers.forEach(function(header, i){
            if (header.includes('닉네임')) {
                colName = i;
            }
            if (header.includes('성별')) {
                colSex = i;
            }
            if (header.includes('나인빠 일요 블루스 추천인')) {
                colReferer = i;
            }
        });
    }

    let members = [];
    let numMen = 0;
    let numWomen = 0;
    let numTotal = 0;
    let referalCount = {};

    let recents = [];
    json?.values?.forEach(function(item, i) {

        if (!item.length) { return;  }  // Skip empty rows.

        let name  = item[colName].trim();
        let sex   = item[colSex];
        let referer = '';

        numTotal++;

        if (sex == '남(men)') {
            sex = 'male';
            numMen++;
        }
        if (sex == '여(women)') {
            sex = 'female';
            numWomen++;
        }

        if (item[colReferer]) {
            if (item[colReferer]?.length < 10) {
                referer = item[colReferer];
            } else {
                referer = '???';
            }
            if (referalCount[referer.toLowerCase()]) {
                referalCount[referer.toLowerCase()]++;
            } else {
                referalCount[referer.toLowerCase()] = 1;
            }
        }

        let candidates = [];

        for (let i=1; i<=16; i++) {
            if (!recents.includes(i)) {
                candidates.push(i);
            }
        }

        let num = candidates[Math.floor(random() * candidates.length)];
        recents.push(num);
        if (recents.length > 8) {
            recents.shift()
        }

        if (num < 10) {
            num = '0' + num;
        }

        let backgroundImage = `/img/kelly/${num}.jpg`;

        if (testId && i == json?.values?.length-1) {
            name = testId;
        }

        if (specialImages[name.toLowerCase()]) {
            backgroundImage = specialImages[name.toLowerCase()];
        }

        members.unshift({ name, sex, referer, backgroundImage });
    }); // json?.values?.forEach

    members.forEach(function(member) {
        if(referalCount[member.name.toLowerCase()]) {
            member.referals = '💗'.repeat(referalCount[member.name.toLowerCase()]);
        }
    });

    return {
        body: {
            title,
            numTotal,
            numMen,
            numWomen,
            members,
            ctaUrl:   config.ctaUrl,
            sheetsId: config.sheetsId
        }
    }

}