import { seedRandom } from '$lib/random.js'

const GCP_API_KEY    = import.meta.env.VITE_GCP_API_KEY
const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID

const URL_FORM = 'https://docs.google.com/forms/d/e/1FAIpQLSf1v-qc7z0hCY-_izfUH7sYU4AZNvyesCC9-V1LmjdaVZJJig/viewform'
const URL_SHEETS = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/%EC%84%A4%EB%AC%B8%EC%A7%80+%EC%9D%91%EB%8B%B5+%EC%8B%9C%ED%8A%B81?majorDimension=ROWS&key=${GCP_API_KEY}`

let random = null;

// https://stackoverflow.com/a/12646864/117030
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

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
    let numTotal = json.values.length;

    json?.values.reverse()

    let candidates = [];
    for (const item of json?.values) {
        let name  = item[2];
        let sex   = item[5];
        let isNew = '';


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



        if (candidates.length == 0) {
            // Fill array with integers 1 to length.
            // https://stackoverflow.com/a/33352604/117030
            candidates = Array.from({length: 16}, (_, i) => i + 1);

            shuffleArray(candidates);
        }

        let num = candidates.pop();
        if (num < 10) {
            num = '0' + num;
        }

        members.push({ name, sex, isNew, num });
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