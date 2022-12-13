import { seedRandom } from '$lib/random.js'

//https://stackoverflow.com/a/2450976/117030

export function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }


  const imageModules = import.meta.glob('../../static/img/special/*.*');
  export const avatars = Object.keys(imageModules)
                      .map((modulePath) => modulePath.split('/').at(-1))
                      .filter(name => !['bear.jpg', 'male.jpg', 'female.jpg'].includes(name))
                      .reduce((a, v) => ({ ...a, [v.split('.')[0]]: v}), {});

  export const aliases = {
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
      시은: '비비안',
      진아: 'jin-a',
      푸에르다: '푸에르',
      늦동이: '늦둥이',
      쿵푸팬저: '쿵푸팬더',
      puer: '푸에르',
  };

 export function normalize(name) {

    let normalized = name.trim()
                         .replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '')
                         .toLowerCase()
                         .replace(/ /g, '-');

    return aliases[normalized] || normalized;
}

// https://stackoverflow.com/a/9229821/117030
export function uniqByKeepLast(a, key) {
    return [
        ...new Map(
            a.map(x => [key(x), x])
        ).values()
    ]
}

const GCP_API_KEY    = import.meta.env.VITE_GCP_API_KEY

const SPREADSHEET_ID = '1Tn03kxww080pAQ9ZBsIc0mitJX5TZPv8vuvL2Gv9ohs';
const URL_FORM = 'https://forms.gle/3onUGgqwoSHDmuVZ9'
const URL_SHEETS = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/%EC%84%A4%EB%AC%B8%EC%A7%80+%EC%9D%91%EB%8B%B5+%EC%8B%9C%ED%8A%B81?majorDimension=ROWS&key=${GCP_API_KEY}`

let random = null;

export async function processUrl(url) {
  const testId = url.searchParams.get('testid') || null;
  const gallery = url.searchParams.has('gallery') || false;
  const alias = url.searchParams.has('alias') || false;
  let titleOverride = url.searchParams.get('t') || '';
  let list = url.searchParams.get('a') || null; // "Attending."

  const party = url.searchParams.get('party') || url.searchParams.has('party');

  if (list) {

      if (list.includes(':')) {
          [titleOverride, list] = list.split(':');
          titleOverride = titleOverride.replace(/_/g, ' ');
          titleOverride += ':';
      }

      list = list.split(/[., ]/);
      list = uniqByKeepLast(list, el => el).reverse();
  }

  let config = {
      urlForm:   URL_FORM,
      urlSheets: URL_SHEETS,
      ctaUrl:    '/form',
      sheetsId:  SPREADSHEET_ID
  };

  if (party == 'sun') {
    config.urlForm = 'https://forms.gle/RwZpwLf64Y8MAkKw6'
    config.urlSheets = `https://sheets.googleapis.com/v4/spreadsheets/1TVjaMPhqccX7bqQ6k1icslajh5yAAbPtghJtzU0cvRI/values/%EC%84%A4%EB%AC%B8%EC%A7%80+%EC%9D%91%EB%8B%B5+%EC%8B%9C%ED%8A%B81?majorDimension=ROWS&key=${GCP_API_KEY}`
    config.ctaUrl = '/form?party=sun'
  } else if (party) {
    config.urlForm = 'https://forms.gle/8EKEMbfpDu4sSxsU9'
    config.urlSheets = `https://sheets.googleapis.com/v4/spreadsheets/1oylL0ICASvekFKRjpkxmFE_MIB2bO8TtrofS2DdVBhI/values/%EC%84%A4%EB%AC%B8%EC%A7%80+%EC%9D%91%EB%8B%B5+%EC%8B%9C%ED%8A%B81?majorDimension=ROWS&key=${GCP_API_KEY}`
    config.ctaUrl = '/form?party=tue'
  }


  const subdomain = url.hostname.split(".")[0];

  if (subdomain == 'balboa') {
      config = {
          ...config,
          urlForm: 'https://forms.gle/uMDtB5DUnkxhvZvZ9',
          urlSheets: `https://sheets.googleapis.com/v4/spreadsheets/1PAMTvGLetBM0wVjCslgKg36326NqSnGJz-OF8zDMnM8/values/%EC%84%A4%EB%AC%B8%EC%A7%80+%EC%9D%91%EB%8B%B5+%EC%8B%9C%ED%8A%B81?majorDimension=ROWS&key=${GCP_API_KEY}`
      }
  }

  let headers = []

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
  let colName = -1, colSex = -1, colReferer = -1, colMessage = -1;

  resp = await fetch(config.urlSheets);

  if (gallery) {
      for (const key in avatars) {
          json.values.unshift([key]);
          colName = 0;
      }
  } else if (alias) {
      for (const key in aliases) {
          json.values.unshift([key]);
      }
  } else if (list) {
      colName = 0;
      json.values = [];
      for (const key of list) {
          json.values.unshift([key]);
      }
  } else {
      json = await resp.json();

      // console.log(json)

      headers = json.values.shift();  // Get column headers.

      headers.forEach(function(header, i){
          if ((colName == -1) && header.includes('닉네임')) {
              colName = i;
          }
          if (header.includes('성별')) {
              colSex = i;
          }
          if (header.includes('추천인') ||
              header.includes('금발친소') ||
              header.includes('초대한')) {
              colReferer = i;
          }
          if (header.includes('협찬')) {
              colMessage = i;
          }
      });
      // console.log({colReferer})
  }

  let members = [];
  let numMen = 0;
  let numWomen = 0;
  let numTotal = 0;
  let referalCount = {};
  let sort;
  let messages = [];

  let recents = [];

  json.values = uniqByKeepLast(json.values, item => normalize(item[colName]));

  json?.values?.forEach(function(item, i) {
      sort = 0

      if (!item.length) { return;  }  // Skip empty rows.

      let name  = item[colName].trim();
      let sex   = item[colSex];
      let referer = '';
      let rawMessage = item[colMessage];

      if (rawMessage
          && !rawMessage.includes('빵이님 지인')
          && !rawMessage.includes('남성 9천원 / 여성 8천원')
          && !rawMessage.includes('나친소')
          && !rawMessage.includes('협찬을받습니다')
          && !rawMessage.includes('베스트드레서 월 4회  소셜 전액 무료입장')) {
          const addSponsor = headers[colMessage].includes('협찬') && !rawMessage.includes('협찬');
          let message = `${rawMessage} (${name}${addSponsor?' 협찬':''})`
          messages.unshift({
              message,
              name
          })
      }

      numTotal++;

      let backgroundImage = `/img/special/bear.jpg`;

      if (sex?.includes('남(men)') ||
          sex?.includes('리더')) {
          sex = 'male';
          numMen++;
          backgroundImage = `/img/special/male.jpg`;
      }
      if (['여(women)', '팔로어', '팔뤄'].includes(sex)) {
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


  if (titleOverride && list) {
      const formattedList = list.join(', ');
      titleOverride = `${titleOverride} ${numTotal}명 (${formattedList})`.trim();
  } else if(list) {
      const formattedList = list.join(', ');
      titleOverride = `${numTotal}명 (${formattedList})`.trim();
  }

  title = titleOverride || title;

  return {
        title,
        numTotal,
        numMen,
        numWomen,
        members,
        ctaUrl:   config.ctaUrl,
        sheetsId: config.sheetsId,
        subdomain,
        messages,
        party
  }

}