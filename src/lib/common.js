import { seedRandom } from '$lib/random.js'
// import {extractAlbum} from "gphotos-scraper";

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
      라이언: 'ryan',
      레오: 'leo',
      꾸기: '꾹이',
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
const GOOGLE_PHOTOS_ALBUM = 'https://photos.app.goo.gl/hmSxuujqsS2Em2Y98'

let random = null;

export async function processUrl(url) {
  const testId = url.searchParams.get('testid') || null;
  const gallery = url.searchParams.has('gallery') || false;
  const alias = url.searchParams.has('alias') || false;
  let titleOverride = url.searchParams.get('t') || '';
  let list = url.searchParams.get('a') || null; // "Attending."

  const party = url.searchParams.get('party') || url.searchParams.has('party');

  const clazz  = url.searchParams.get('class') || null

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
    config.sheetsId= '1TVjaMPhqccX7bqQ6k1icslajh5yAAbPtghJtzU0cvRI'
  } else if (party) {
    config.urlForm = 'https://forms.gle/8EKEMbfpDu4sSxsU9'
    config.urlSheets = `https://sheets.googleapis.com/v4/spreadsheets/1oylL0ICASvekFKRjpkxmFE_MIB2bO8TtrofS2DdVBhI/values/%EC%84%A4%EB%AC%B8%EC%A7%80+%EC%9D%91%EB%8B%B5+%EC%8B%9C%ED%8A%B81?majorDimension=ROWS&key=${GCP_API_KEY}`
    config.ctaUrl = '/form?party=tue'
    config.sheetsId= '1oylL0ICASvekFKRjpkxmFE_MIB2bO8TtrofS2DdVBhI'
  }

  if (clazz == 'tue') {
    config.urlForm = 'https://url.kr/eab5c1'
    config.urlSheets = `https://sheets.googleapis.com/v4/spreadsheets/1PFqHC16qs7fxKlhUfGQuuHqNzUZf75v9mt8kWaOMJwg/values/%EC%84%A4%EB%AC%B8%EC%A7%80+%EC%9D%91%EB%8B%B5+%EC%8B%9C%ED%8A%B81?majorDimension=ROWS&key=${GCP_API_KEY}`
    config.ctaUrl = '/form?class=tue'
    config.sheetsId= '1PFqHC16qs7fxKlhUfGQuuHqNzUZf75v9mt8kWaOMJwg'
  }


  const subdomain = url.hostname.split(".")[0];

  if (subdomain == 'balboa') {
      config = {
          ...config,
          urlForm: 'https://forms.gle/uMDtB5DUnkxhvZvZ9',
          urlSheets: `https://sheets.googleapis.com/v4/spreadsheets/1PAMTvGLetBM0wVjCslgKg36326NqSnGJz-OF8zDMnM8/values/%EC%84%A4%EB%AC%B8%EC%A7%80+%EC%9D%91%EB%8B%B5+%EC%8B%9C%ED%8A%B81?majorDimension=ROWS&key=${GCP_API_KEY}`
      }
  }

  const album = {
    "id": "AF1QipMG8bsyXw_gxHpBaMiIErQtqKOGq9J57ngCaH8IUqRePF6D4ICYYRnAGZ_lJ9WvCQ",
    "title": "나인빠",
    "url": "https://photos.app.goo.gl/hmSxuujqsS2Em2Y98",
    "photos": [
      {
        "id": "AF1QipNB_rBwMGGv81EWYoemGZYVfqsPbpwBjoXnO6MM",
        "description": "",
        "filename": "IMG_4184.MOV",
        "createdAt": 1662981577000,
        "size": 215663936,
        "width": 1080,
        "height": 1920,
        "mimeType": "video/quicktime",
        "url": "https://lh3.googleusercontent.com/Os-za4iU6ecY4NHyezlbKOARGxbyqAweLI5ieDL6SfCt2TYzbWG9mar4ZpwedakMPRl6Z6CvUO3mx8Dt3onH0xYNVGs73YrTtXyPgIoJyAtJuHQbMQnajOyBSCj-VpWZDc6qTgGv19U"
      },
      {
        "id": "AF1QipOonzYga07eK1vuMEYzAGNQB2JrkZGZJcRVcSL5",
        "description": "",
        "filename": "XiaoYing_Video_1661734971457.mp4",
        "createdAt": 1661734975000,
        "size": 906966,
        "width": 368,
        "height": 640,
        "mimeType": "video/mp4",
        "url": "https://lh3.googleusercontent.com/ljM78i_sDzbPr3gbxW8L7H2oZGBk_RB-ltKdA4-7AJBEZwgVH2T_Mk_lGzLtDDG1A237aKDHSgfLdvCA2m8cjDEPjW6H7dP26ALK5fxxAmSXipy6TkBSNjWsBggu0yjO4Yoe69lk9bc"
      },
      {
        "id": "AF1QipNaESeM5SDm3liMEdzW5gyFE2ZsaNnXq-eLo9n0",
        "description": "",
        "filename": "1661729863095-0.jpg",
        "createdAt": 1661729863000,
        "size": 438004,
        "width": 810,
        "height": 1440,
        "mimeType": "image/jpeg",
        "url": "https://lh3.googleusercontent.com/nDLDy5AeQXHWEMnE1DcEBR95o5tJmdO5Uag37WqukPqngiOQMLhZoo26lr0Fgaw1XUKGExQAgYgCChLLBL-3_hwdcvY2CISt9epAi_z5AQr2pG9jLa5fqZe-rimGteRfw9xxidc-Ow"
      },
      {
        "id": "AF1QipO4_BOlrVwQto1YA2LYwCsvwLKJoGNrem-uV_e3",
        "description": "",
        "filename": "1661729863095-1.jpg",
        "createdAt": 1661729863000,
        "size": 467333,
        "width": 810,
        "height": 1440,
        "mimeType": "image/jpeg",
        "url": "https://lh3.googleusercontent.com/cWTdzzNAvTQQU00MeYKheRjEIm_48C18Ih3WIymJtuBEBQx8zS-j6rPjWBUtFSrDXvGYG8Fqc8198nMgfeseh-gUSl79znX2KaIk9gzY8Fhw-tsZfYPNs1UDRE1od6Ji1yeah4_s2w"
      },
      {
        "id": "AF1QipMmnjneuHKtvUGK6ELdZYzundJSNtb2jqGwNhFS",
        "description": "",
        "filename": "20220828_235702.jpg",
        "createdAt": 1661698621000,
        "size": 866945,
        "width": 4032,
        "height": 2268,
        "mimeType": "image/jpeg",
        "url": "https://lh3.googleusercontent.com/t7tjQu6_s9FpyA1vHgouPvLbl7wFCPCTWTEvFgoStYSTSX79qZkLV52WI_RRQsiMVqdY7G_cyqHhR8la8flFd65LxXMqMph8kJRyLRh6iLRKNHm5oQ3SFtPlg-dxNsvGNaS1V8LGdX4"
      },
      {
        "id": "AF1QipNYrv-1z0H_xVyos3hed5-XaUJv_6WEKyxAzjFs",
        "description": "",
        "filename": "B612_20220828_201342_274.jpg",
        "createdAt": 1661685222000,
        "size": 400540,
        "width": 2560,
        "height": 1440,
        "mimeType": "image/jpeg",
        "url": "https://lh3.googleusercontent.com/QCLP3-NxhDj_27tm75hxczQdlETsOXNqvvUqaeEI4TwqXSNqkynRl2UL5F_qw4zTzpXGyrzXiSv-vY6-aw3p5o59--EitCMGPH97OFBuKqBtjTcA2ACF8ME130tW6j3dTwENgeBlcx0"
      },
      {
        "id": "AF1QipMEvOMoqxD0DisZZPDNnxDwvh2MaQKNvk4dbJN6",
        "description": "",
        "filename": "IMG_4178.HEIC",
        "createdAt": 1661674166000,
        "size": 2673013,
        "width": 4032,
        "height": 3024,
        "mimeType": "image/heic",
        "url": "https://lh3.googleusercontent.com/jPzB8eV9oEHJLLyhlbl26Jc07syVtGSazXQTj99WEFDPwsxi8gC0fCD4GhJg5Fs5YZ9bMH3ODwPBWELjV2iBNl75DjsdLCWXiPxGwKFsS_7xqLhdXMfiK_qqEz-cFygJxa3ZLUWmsvg"
      },
      {
        "id": "AF1QipMBXogUYD0teCyOCZk6cfTLATqpQ5z2MESWFOqE",
        "description": "",
        "filename": "IMG_4177.HEIC",
        "createdAt": 1661674122000,
        "size": 2937790,
        "width": 4032,
        "height": 3024,
        "mimeType": "image/heic",
        "url": "https://lh3.googleusercontent.com/RK137mgDBk_iF9uuRPeqQFuDeXpwkKTWXR-wXuOGmwJjA2Wo5PIC81jbl_HBeJpMV0CYby29qR9lIHmK_5hLO8Es7EMNtgqSOfkQw1ArmCghiU9AKvQR2VZtVW4yGSejfZ7pjtbUFns"
      },
      {
        "id": "AF1QipNOjM7efVXeJBp8UhiWFaxomHVYDnsu4E6k4VhB",
        "description": "",
        "filename": "IMG_4176.HEIC",
        "createdAt": 1661674112000,
        "size": 2735217,
        "width": 3024,
        "height": 4032,
        "mimeType": "image/heic",
        "url": "https://lh3.googleusercontent.com/Hd2X-NBkE86YY6_bl9Vag4x47uKfpRyRu90bYfp2vcRTYHxxl7Q_Ymat1mSnVPTeYeqMgEb1Zl9lvgz9ylZ85XGyWvJFbwWVRab2coau_x7IcFZeCwY8hW3TctuW3onzSKBPZ332jc8"
      },
      {
        "id": "AF1QipP278wkbL4rlaL0ul9NOzsjpg9IyhTzwrTCQs8e",
        "description": "",
        "filename": "IMG_4175.HEIC",
        "createdAt": 1661674039000,
        "size": 783008,
        "width": 3024,
        "height": 4032,
        "mimeType": "image/heic",
        "url": "https://lh3.googleusercontent.com/_2KrtXyMxGuB6qDdPy_3Y8qdQG0NAAJESDcVNSaYcKungi0tMYhVnJlFXyHUJZ9HFFnw8234rJRZO6otje-EFOcp6P4htfYhPdUkRD-PvyhHE5UvKAg_K1I4w2-A0zkcxx044_fgWs0"
      },
      {
        "id": "AF1QipPr1XMBQpZslf46kmY7Ln1jzv2kBQwSnVKyQo9b",
        "description": "",
        "filename": "IMG_4174.HEIC",
        "createdAt": 1661674011000,
        "size": 3287465,
        "width": 4032,
        "height": 3024,
        "mimeType": "image/heic",
        "url": "https://lh3.googleusercontent.com/uOjW4jxx7-je-2j1M7SM-9wFeBDnVLQjwsbXujqb3Oz-ZBXUN-x_i9_kj8oQYT-1KSPgOqXN5eCqRYyN0hSFq7TmuX6aV-JA8-98NNI0A7BgxeKbPcZjtoIeK_-Z8P2QYLc9c2Fudq4"
      },
      {
        "id": "AF1QipPYFDcun48r8g-phDXv12f4iAnXBmTFnF2G-TSj",
        "description": "",
        "filename": "IMG_4173.HEIC",
        "createdAt": 1661673970000,
        "size": 3040204,
        "width": 4032,
        "height": 3024,
        "mimeType": "image/heic",
        "url": "https://lh3.googleusercontent.com/ftzJ4i-f-GT3Xx9-ZbfUte68hKgU7wgVjsEROLwJTiMVUv85EzElE1bUn_txyQT3UIXzN6el4ecndwTRpgmYJALx6wuAuSJRH3yqNGWCVHqbGxwZzAk_dkJU68Rj9aV16OvsotSSrsA"
      }
    ],
    "createdAt": 1661734235605,
    "updatedAt": 1663048224659,
    "cover": {
      "id": "AF1QipPr1XMBQpZslf46kmY7Ln1jzv2kBQwSnVKyQo9b",
      "description": "",
      "filename": "IMG_4174.HEIC",
      "createdAt": 1661674011000,
      "size": 3287465,
      "width": 4032,
      "height": 3024,
      "mimeType": "image/heic",
      "url": "https://lh3.googleusercontent.com/uOjW4jxx7-je-2j1M7SM-9wFeBDnVLQjwsbXujqb3Oz-ZBXUN-x_i9_kj8oQYT-1KSPgOqXN5eCqRYyN0hSFq7TmuX6aV-JA8-98NNI0A7BgxeKbPcZjtoIeK_-Z8P2QYLc9c2Fudq4"
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
  let colName = -1, colSex = -1, colReferer = -1, colMessage = -1, colGift = -1;

  resp = await fetch(config.urlSheets);

  const sexes = {
    m: 'male',
    f: 'female',
  }
  if (gallery) {
      colName = 0;
      colSex = 1;

      for (const key in avatars) {
          const [sex, ...rest] = key.split('-')
          const name = rest.join('-')
          json.values.unshift([name, sexes[sex]]);
      }
      json.values = json.values.sort((a, b) => b[0].localeCompare(a[0]))
  } else if (alias) {
      colName = 0;
      colSex = 1;
      for (const key in aliases) {
          json.values.unshift([key]);
      }
  } else if (list) {
      colName = 0;
      colSex = 1;
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
          if (header.includes('성별') || header.includes('리드 / 팔로우')) {
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
          if ((colGift == -1) && header.includes('만원의 행복 신청')) {
            colGift = i;
          }
      });
  }

  let members = [];
  let numMen = 0;
  let numWomen = 0;
  let numTotal = 0;
  let referalCount = {};
  let sort;
  let messages = [];

  let recents = [];

  if (!alias) {
    json.values = uniqByKeepLast(json.values, item => normalize(item[colName]));
  }

  for (const [i, item] of json?.values?.entries()) {
      sort = 0

      if (!item.length) { continue;  }  // Skip empty rows.

      let timestamp  = item[0];
      let name       = item[colName].trim();
      let sex        = item[colSex];
      let referer    = '';
      let rawMessage = item[colMessage];
      let gift       = item[colGift];

      // console.log([i, item])
      // Skip previous tue class signups and 'mj'.
      if (timestamp?.includes('2022. 11.') || !timestamp && name === 'mj') {
        continue;
      }

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

      if (avatars[`m-${normalize(name)}`]) {
        sex = 'male';
      } else if (avatars[`f-${normalize(name)}`]) {
        sex = 'female'
      }

      let backgroundImage = `/img/special/bear.jpg`;

      if (['male', '남(men)', '리더', '리드'].includes(sex)) {
          sex = 'male';
          numMen++;
          backgroundImage = `/img/special/male.jpg`;
      }
      if (['female', '여(women)', '팔로어', '팔뤄', '팔로우'].includes(sex)) {
          sex = 'female'
          numWomen++;
          backgroundImage = `/img/special/female.jpg`;
      }

      if (item[colReferer]) {
          sort = 100;
          if (item[colReferer]?.length < 10 && (item[colReferer]?.length > 1)) {
              referer = item[colReferer];
          } else if (item[colReferer]?.length > 1) {
              referer = '???';
          }
          if (referalCount[normalize(referer)]) {
              referalCount[normalize(referer)]++;
          } else {
              referalCount[normalize(referer)] = 1;
          }
      }

      const key = `${sex[0]}-${normalize(name)}`

      if (avatars[key]) {
          sort = 1;
          backgroundImage = `/img/special/${avatars[key]}`;
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



      members.unshift({ name, sex, referer, backgroundImage, sort, gift });
  }; // for json?.values?.entries()

  members.forEach(function(member) {
      let count = referalCount[normalize(member.name)];
      if(count) {
          member.sort += 10 * count;
          member.referals = '💗'.repeat(count);
      }
      if (member.gift) {
        member.referals = `🎁${member.referals || ''}`
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
        party,
        album,
  }

}