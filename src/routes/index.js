import { seedRandom } from '$lib/random.js'

const GCP_API_KEY    = import.meta.env.VITE_GCP_API_KEY

const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID
const URL_FORM = 'https://docs.google.com/forms/d/e/1FAIpQLSeWt1kc4tjafI60kQDloBpsxpoG3Why-U7XxWgcBIkwNYVRLw/viewform'
const URL_SHEETS = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/%EC%84%A4%EB%AC%B8%EC%A7%80+%EC%9D%91%EB%8B%B5+%EC%8B%9C%ED%8A%B81?majorDimension=ROWS&key=${GCP_API_KEY}`

const specialImages = {
    혜존:    'iu.gif',
    헤존:    'iu-cooking.gif',
    메이비영: '농담곰도리.png',
    나나:    'nana.gif',
    세오:    '세오.jpg',
    캘리:    'kelly.jpg',
    스카:    'ska.jpg',
    니오:    'neo.jpg',
    미키:    'miki.jpg',
    쥴리:    'julie.jpg',
    빵이:    '빵이.jpg',
    률이:    '률이.jpg',
    로미:    'romi.jpg',
    romi:    'romi.jpg',
    비비안:  'vivian.jpg',
    수:      'sue.jpg',
    sue:     'sue.jpg',
    좐:      'john.jpg',
    존:      'john.jpg',
    john:    'john.jpg',
    레프티:   'john.jpg',
    혀니:     '쩐주.jpg',
    사슴:     '사슴.jpg',
    사슴이다:  '사슴.jpg',
    리스:     '리스.jpg',
    나오키:   '나오키.jpg',
    미셸:     '미셸.jpg',
    미쉘:     '미셸.jpg',
    유슬:     '유슬.jpg',
    윤슬:     '유슬.jpg',
    겨울이:   '겨울이.jpg',
    랑유:     '랑유.jpg',
    곤:       '곤.jpg',
    미칸:     '미칸.jpg',
    쿵푸팬더:  '쿵푸팬더.jpg',
    뽀냥:     '뽀냥.jpg',
    푸에르:   '푸에르.jpg',
    먼시:     '먼시.jpg',
    레이:     '레이.jpg',
    빌리:     '빌리.jpg',
    페르소나:  '페르소나.jpg',
    임과장:   '임과장.jpg',
    사이:     '사이.jpg',
    늦동이:   '늦둥이.jpg',
    풍이:     '풍이.jpg',
    sophia:  'sophia.jpg',
}

let random = null;

export async function get({ url }) {
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
    let sort;

    let recents = [];
    json?.values?.forEach(function(item, i) {
        sort = 0

        if (!item.length) { return;  }  // Skip empty rows.

        let name  = item[colName].trim();
        let sex   = item[colSex];
        let referer = '';

        numTotal++;

        let backgroundImage = `/img/special/bear.jpg`;

        if (sex == '남(men)') {
            sex = 'male';
            numMen++;
            backgroundImage = `/img/special/male.jpg`;
        }
        if (sex == '여(women)') {
            sex = 'female';
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
            if (referalCount[referer.toLowerCase()]) {
                referalCount[referer.toLowerCase()]++;
            } else {
                referalCount[referer.toLowerCase()] = 1;
            }
        }

        if (specialImages[name.toLowerCase()]) {
            sort = 1;
            backgroundImage = `/img/special/${specialImages[name.toLowerCase()]}`;
        }

        if (testId && i == 0) {
            sort = 1000;
            name = testId;
            backgroundImage = `/img/special/${specialImages[name.toLowerCase()]}`;
        }

        members.unshift({ name, sex, referer, backgroundImage, sort });
    }); // json?.values?.forEach

    members.forEach(function(member) {
        let count = referalCount[member.name.toLowerCase()];
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
            sheetsId: config.sheetsId
        }
    }

}