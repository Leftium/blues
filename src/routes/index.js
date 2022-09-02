import { seedRandom } from '$lib/random.js'

const imageModules = import.meta.glob('../../static/img/special/*.*');
const avatars = Object.keys(imageModules)
                    .map((modulePath) => modulePath.split('/').at(-1))
                    .filter(name => !['bear.jpg', 'male.jpg', 'female.jpg'].includes(name))
                    .reduce((a, v) => ({ ...a, [v.split('.')[0]]: v}), {});

const aliases = {
    romi: '로미',
    sue: '수',
    좐: 'john',
    존: 'john',
    레프티: 'john',
    미쉘: '미셸',
    소피아: 'sophia',
    aladdin: '알라딘',
    alradin: '알라딘',
    arladin: '알라딘',
    유슬: '윤슬',
    joanne: '조앤',
    시은: '비비안',
    진아: 'jin-a'
};


function normalize(name) {

    let normalized = name.trim()
                         .replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '')
                         .toLowerCase()
                         .replace(/ /g, '-');

    return aliases[normalized] || normalized;
}

// https://stackoverflow.com/a/9229821/117030
function uniqByKeepLast(a, key) {
    return [
        ...new Map(
            a.map(x => [key(x), x])
        ).values()
    ]
}

console.log(avatars)
console.log(aliases)

const GCP_API_KEY    = import.meta.env.VITE_GCP_API_KEY

const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID
const URL_FORM = 'https://docs.google.com/forms/d/e/1FAIpQLSeWt1kc4tjafI60kQDloBpsxpoG3Why-U7XxWgcBIkwNYVRLw/viewform'
const URL_SHEETS = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/%EC%84%A4%EB%AC%B8%EC%A7%80+%EC%9D%91%EB%8B%B5+%EC%8B%9C%ED%8A%B81?majorDimension=ROWS&key=${GCP_API_KEY}`

let random = null;

export async function GET({ url }) {
    const testId = url.searchParams.get('testid') || null;
    const gallery = url.searchParams.has('gallery') || false;
    const alias = url.searchParams.has('alias') || false;
    let titleOverride = url.searchParams.get('t') || '';
    let list = url.searchParams.get('a') || null; // "Attending"

    if (list) {
        const formattedList = list.replace(/([,. ])/g, '$& ')
        titleOverride = `${titleOverride} ${formattedList}`.trim();
    }





    if (list) {
        list = list.split(/[., ]/)
    }


    let config = {
        urlForm:   URL_FORM,
        urlSheets: URL_SHEETS,
        ctaUrl:    '/form',
        sheetsId:  SPREADSHEET_ID
    };

    const subdomain = url.hostname.split(".")[0];

    if (subdomain == 'balboa') {
        config = {
            ...config,
            urlForm: 'https://forms.gle/uMDtB5DUnkxhvZvZ9',
            urlSheets: `https://sheets.googleapis.com/v4/spreadsheets/1PAMTvGLetBM0wVjCslgKg36326NqSnGJz-OF8zDMnM8/values/%EC%84%A4%EB%AC%B8%EC%A7%80+%EC%9D%91%EB%8B%B5+%EC%8B%9C%ED%8A%B81?majorDimension=ROWS&key=${GCP_API_KEY}`
        }
    }

    let resp = await fetch(config.urlForm);
    let text = await resp.text();

    let title = titleOverride || '';
    let matches = text.match(/<title>(.*)<\/title>/);
    if (!title && matches) {
        title = matches[1];
        title = title.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&amp;/gi, '&');
    }

    random = seedRandom(title);

    let json = { values: []};
    let colName = 0, colSex = 1, colReferer = 2;

    resp = await fetch(config.urlSheets);

    if (gallery) {
        for (const key in avatars) {
            json.values.unshift([key]);
        }
    } else if (alias) {
        for (const key in aliases) {
            json.values.unshift([key]);
        }
    } else if (list) {
        json.values = [];
        for (const key of list) {
            json.values.unshift([key]);
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
            if (header.includes('나인빠 일요 블루스 추천인') ||
                header.includes('금발친소')) {
                colReferer = i;
            }
        });
    }

    let members = [];
    let numMen = 0;
    let numWomen = 0;
    let numTotal = 0;
    let referalCount = {};
    let sort;

    let recents = [];

    json.values = uniqByKeepLast(json.values, item => normalize(item[colName]));

    json?.values?.forEach(function(item, i) {
        sort = 0

        if (!item.length) { return;  }  // Skip empty rows.

        let name  = item[colName].trim();
        let sex   = item[colSex];
        let referer = '';

        numTotal++;

        let backgroundImage = `/img/special/bear.jpg`;

        if (sex?.includes('남(men)') ||
            sex?.includes('리더')) {
            sex = 'male';
            numMen++;
            backgroundImage = `/img/special/male.jpg`;
        }
        if (sex?.includes('여(women)') ||
            sex?.includes('팔뤄')) {
            sex = 'female'
            numWomen++;
            backgroundImage = `/img/special/female.jpg`;
        }

        if (item[colReferer]) {
            sort = 100;
            if (item[colReferer]?.length < 10) {
                referer = item[colReferer];
            } else {
                referer = '???';
            }
            if (referalCount[normalize(referer)]) {
                referalCount[normalize(referer)]++;
            } else {
                referalCount[normalize(referer)] = 1;
            }
        }

        if (avatars[normalize(name)]) {
            sort = 1;
            backgroundImage = `/img/special/${avatars[normalize(name)]}`;
        }

        if (testId && i == 0) {
            sort = 1000;
            name = testId;
            backgroundImage = `/img/special/${avatars[normalize(name)]}`;
        }


        let candidates = [];

        for (let i=1; i<=20; i++) {
            if (!recents.includes(i)) {
                candidates.push(i);
            }
        }

        let num = candidates[Math.floor(random() * candidates.length)];
        recents.push(num);
        if (recents.length > 9) {
            recents.shift()
        }

        if (num < 10) {
            num = '0' + num;
        }

        if (subdomain == 'balboa') {
            backgroundImage = `/img/balboa/${num}.jpg`;
        }



        members.unshift({ name, sex, referer, backgroundImage, sort });
    }); // json?.values?.forEach

    members.forEach(function(member) {
        let count = referalCount[normalize(member.name)];
        if(count) {
            member.sort += 10 * count;
            member.referals = '💗'.repeat(count);
        }
    });

    members = members.sort((a, b) => { return b.sort - a.sort });

    return {
        body: {
            title,
            numTotal,
            numMen,
            numWomen,
            members,
            ctaUrl:   config.ctaUrl,
            sheetsId: config.sheetsId,
            subdomain
        }
    }

}