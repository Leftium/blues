import { seedRandom } from '$lib/random.js'

const GCP_API_KEY    = import.meta.env.VITE_GCP_API_KEY

const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID
const URL_FORM = 'https://docs.google.com/forms/d/e/1FAIpQLSf1v-qc7z0hCY-_izfUH7sYU4AZNvyesCC9-V1LmjdaVZJJig/viewform'
const URL_SHEETS = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/%EC%84%A4%EB%AC%B8%EC%A7%80+%EC%9D%91%EB%8B%B5+%EC%8B%9C%ED%8A%B81?majorDimension=ROWS&key=${GCP_API_KEY}`

const PARTY_SPREADSHEET_ID = import.meta.env.VITE_PARTY_SPREADSHEET_ID
const PARTY_URL_FORM = 'https://docs.google.com/forms/d/e/1FAIpQLSeWt1kc4tjafI60kQDloBpsxpoG3Why-U7XxWgcBIkwNYVRLw/viewform'
const PARTY_URL_SHEETS = `https://sheets.googleapis.com/v4/spreadsheets/${PARTY_SPREADSHEET_ID}/values/%EC%84%A4%EB%AC%B8%EC%A7%80+%EC%9D%91%EB%8B%B5+%EC%8B%9C%ED%8A%B81?majorDimension=ROWS&key=${GCP_API_KEY}`

let random = null;

export async function get({ url }) {
    const party  = url.searchParams.has('party')  || false;
    const testId = url.searchParams.get('testid') || null;

    let config = (party ? {
        urlForm:   PARTY_URL_FORM,
        urlSheets: PARTY_URL_SHEETS,
        ctaUrl:    '/form?party',
        sheetsId:  PARTY_SPREADSHEET_ID
    } : {
        urlForm:   URL_FORM,
        urlSheets: URL_SHEETS,
        ctaUrl:    '/form',
        sheetsId:  SPREADSHEET_ID
    });

    let resp = await fetch(config.urlForm);
    let text = await resp.text();

    let title = '';
    let matches = text.match(/<title>(.*)<\/title>/);
    if (matches) {
        title = matches[1];
        title = title.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>');
    }

    random = seedRandom(title);

    resp = await fetch(config.urlSheets);
    let json = await resp.json();

    let headers = json.values.shift();  // Get column headers.

    let colName, colSex, colNew;
    headers.forEach(function(header, i){
        if (header.includes('닉네임')) {
            colName = i;
        }
        if (header.includes('성별')) {
            colSex = i;
        }
        if (header.includes('나인빠 일요 블루스 추천인')) {
            colNew = i;
        }
    });

    let members = [];
    let numMen = 0;
    let numWomen = 0;
    let numTotal = 0;

    let recents = [];
    json?.values?.forEach(function(item, i) {

        if (!item.length) { return;  }  // Skip empty rows.

        let name  = item[colName].trim();
        let sex   = item[colSex];
        let isNew = '';

        numTotal++;

        if (sex == '남(men)') {
            sex = 'male';
            numMen++;
        }
        if (sex == '여(women)') {
            sex = 'female';
            numWomen++;
        }

        if (item[colNew]) {
            isNew = 'new';
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

        const specialImages = {
            혜존:    '/img/special/iu.gif',
            헤존:    '/img/special/iu-cooking.gif',
            메이비영: '/img/special/농담곰도리.png',
            나나:    '/img/special/nana.gif',
            뽀냥:    '/img/special/garfield.png',
            세오:    '/img/special/세오.png',
        }

        if (testId && i == json?.values?.length-1) {
            name = testId;
        }

        if (specialImages[name]) {
            backgroundImage = specialImages[name];
        }

        members.unshift({ name, sex, isNew, backgroundImage });
    }); // json?.values?.forEach

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