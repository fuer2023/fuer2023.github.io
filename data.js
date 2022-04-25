const axios = require('axios').default;
const fs = require("fs");

let coviddata;
let t;

function unique(arr) {
  return Array.from(new Set(arr))
}

async function fetchdata() {
  let covidurl = {
    f150: '%E8%8A%99%E8%93%89%E6%B1%9F%E8%B7%AF150%E5%BC%84',
    s386: '%E6%B0%B4%E5%9F%8E%E8%B7%AF386%E5%BC%84',
    s388: '%E6%B0%B4%E5%9F%8E%E8%B7%AF388%E5%BC%84',
    s408: '%E6%B0%B4%E5%9F%8E%E8%B7%AF408%E5%BC%84',
    s414: '%E6%B0%B4%E5%9F%8E%E8%B7%AF414%E5%BC%84',
    s417: '%E6%B0%B4%E5%9F%8E%E8%B7%AF417%E5%BC%84',
    s450: '%E6%B0%B4%E5%9F%8E%E8%B7%AF450%E5%BC%84',
    x415: '%E4%BB%99%E9%9C%9E%E8%B7%AF415%E5%BC%84',
    x435: '%E4%BB%99%E9%9C%9E%E8%B7%AF435%E5%BC%84',
    x451: '%E4%BB%99%E9%9C%9E%E8%B7%AF451%E5%BC%84',
    x471: '%E4%BB%99%E9%9C%9E%E8%B7%AF471%E5%BC%84',
    m455: '%E8%8C%85%E5%8F%B0%E8%B7%AF455%E5%BC%84'
  };

  coviddata = {
    f150: [],
    s386: [],
    s388: [],
    s408: [],
    s414: [],
    s417: [],
    s450: [],
    x415: [],
    x435: [],
    x451: [],
    x471: [],
    m455: [],
  };

  for (const [key, value] of Object.entries(covidurl)) {
    // console.log(`${key}: ${value}`);
    axios.get('https://chenfan.info/search_data/' + value)
      .then(function (response) {
        let rd = response.data.toString();
        let s;
        s = rd.replace(/长宁区/g, '').replace(/（住宅）/g, '').replace(/\n/g, '');
        s = s.replace(/芙蓉江路150/g, ',');
        s = s.replace(/水城路386/g, ',');
        s = s.replace(/水城路388/g, ',');
        s = s.replace(/水城路408/g, ',');
        s = s.replace(/水城路414/g, ',');
        s = s.replace(/水城路417/g, ',');
        s = s.replace(/水城路450/g, ',');
        s = s.replace(/仙霞路415/g, ',');
        s = s.replace(/仙霞路435/g, ',');
        s = s.replace(/仙霞路451/g, ',');
        s = s.replace(/仙霞路471/g, ',');
        s = s.replace(/茅台路455/g, ',');
        s = s.replace(/弄/g, ',').replace(/号/g, ',').replace(/,,/g, ',').replace(/,/g, '|');
        let t = s.split('||');
        let ut = unique(t);
        let fut = ut.filter(function(el) {
          return el != '';
        });
        let sfut = fut.sort(function(a, b) {
          return +new Date(b) - +new Date(a)
        });
        console.log(sfut)
        coviddata[key].push(sfut.join());
        console.log(coviddata)
        let json = JSON.stringify(coviddata);
        fs.writeFile('./data/coviddata.json', json, 'utf8', function (err) {
          if (err) throw err;
        });
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
      });
  }
}

async function main() {
  await fetchdata();

}

main();