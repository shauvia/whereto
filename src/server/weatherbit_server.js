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
  // console.log('user date', date);
  for (i = 0; i < content.data.length; i++){
    if (date == content.data[i].datetime){
      let forecast = {
        temp: content.data[i].temp,
        description: content.data[i].weather.description,
        date:   content.data[i].datetime,
        dateNotFound: false
      }
      return forecast;
    }
  }
  let forecast = {
    temp: content.data[content.data.length-1].temp,
    description: content.data[content.data.length-1].weather.description,
    date:   content.data[content.data.length-1].datetime,
    dateNotFound: true
  }
  // console.log('forecast', forecast);
  return forecast;
}
 
module.exports = getForecast;

