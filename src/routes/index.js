import { seedRandom } from '$lib/random.js'

const GCP_API_KEY    = import.meta.env.VITE_GCP_API_KEY
const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID

const URL_FORM = 'https://docs.google.com/forms/d/e/1FAIpQLSf1v-qc7z0hCY-_izfUH7sYU4AZNvyesCC9-V1LmjdaVZJJig/viewform'
const URL_SHEETS = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/%EC%84%A4%EB%AC%B8%EC%A7%80+%EC%9D%91%EB%8B%B5+%EC%8B%9C%ED%8A%B81?majorDimension=ROWS&key=${GCP_API_KEY}`

let random = null;

export async function get() {
    let resp = await fetch(URL_FORM);
    let text = await resp.text();

    let title = '';
    let matches = text.match(/<title>(.*)<\/title>/);
    if (matches) {
        title = matches[1];
    }
    random = seedRandom(title);

    resp = await fetch(URL_SHEETS);
    let json = await resp.json();

    json.values.shift();  // Skip labels.

    let members = [];
    let numMen = 0;
    let numWomen = 0;
    let numTotal = 0;

    let recents = [];
    for (const item of json?.values) {
        if (!item.length) { continue;  }  // Skip empty rows.

        let name  = item[2];
        let sex   = item[5];
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

        if (item[7]) {
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

        if (name == '혜존') {
            backgroundImage = '/img/iu/iu.gif';
        }

        members.unshift({ name, sex, isNew, backgroundImage });
    }

    return {
        body: {
            title,
            numTotal,
            numMen,
            numWomen,
            members
        }
    }

}