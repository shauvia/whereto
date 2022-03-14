const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)); //from https://www.npmjs.com/package/node-fetch#difference-from-client-side-fetch fixing issues with fetch 3 not supporting require()
const dotenv = require('dotenv');
dotenv.config();

const baseURL = "http://api.weatherbit.io/v2.0/forecast/daily?"
const apiKey = "&key=" + process.env.weatherbit_API_Key;
const latApi = 'lat=';
const longAPi = '&lon='
const numberOfDays = '&days=16';

async function getForecast(lat, long, date){
  const response = await fetch(baseURL+latApi+lat+longAPi+long+apiKey+numberOfDays);
  // console.log("getForecast_url: ", baseURL+latApi+lat+longAPi+long+apiKey+numberOfDays);
  // console.log("getForecast-res: ", response);

  if (!response.ok) {
    console.log('weatherbit, response.status: ', response.status, 'response.statusText: ', response.statusText);
    const err = new Error(); 
    throw err;
  }
  const content = await response.json(); //oddżejsonowuje
  // console.log('content-bit', content);
  console.log('user date', date);
  for (i = 0; i < content.data.length; i++){
    console.log('i', i);
    console.log('API date', content.data[i].datetime);
    if (date == content.data[i].datetime){
      // console.log('user date', date, 'API date', content.data[i]);
      let forecast = {
        temp: content.data[i].temp,
        description: content.data[i].weather.description,
        date:   content.data[i].datetime
      }
      return forecast;
    }
  }
  let forecast = {
    temp: content.data[content.data.length-1].temp,
    description: content.data[content.data.length-1].weather.description,
    date:   content.data[content.data.length-1].datetime
  }
  console.log('forecast', forecast);
  return forecast;
}
 
module.exports = getForecast;

// jesli podana przez użytkownika data jest w zasięgu 16 dni prognozy pogody, to zwraca prognozę z data użytkownika i prognozą na tamten dzień. JEśli nie ma daty w tych 16 dniach, to zwraca ostATNI dzień z tych 16 i prognoze pogody na niego.


// const content = await response.json(); //oddżejsonowuje
//   // console.log("getPicture-content", content);
//   if (content.hits.length == 0) {
//      errorToThrow = new Error();
//      errorToThrow.isNotFound = true;
//     //  console.log('error', errorToThrow);
//      throw  errorToThrow;
//   } else {
//     // console.log("getPicture-content", content);
//     // console.log('url', content.hits[0].largeImageURL);
//     return content.hits[0].webformatURL;
//   }