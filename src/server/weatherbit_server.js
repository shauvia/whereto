const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)); //from https://www.npmjs.com/package/node-fetch#difference-from-client-side-fetch fixing issues with fetch 3 not supporting require()
const dotenv = require('dotenv');
dotenv.config();

const baseURL = "http://api.weatherbit.io/v2.0/forecast/daily?"
const apiKey = "&key=" + process.env.weatherbit_API_Key;
const latApi = 'lat=';
const longAPi = '&lon='
const numberOfDays = '&days=2';
// później ewentualnie zwiększyć ilość dni do 16, bo trzeba bedzie przeiterować przez nie, aby znaleźć właściwą date i zwrócić użytkownikowi właściwą datę i prognozę pogody 

async function getForecast(lat, long){
  const response = await fetch(baseURL+latApi+lat+longAPi+long+apiKey+numberOfDays);
  console.log("getForecast_url: ", baseURL+latApi+lat+longAPi+long+apiKey+numberOfDays);
  console.log("getForecast-res: ", response);
  const content = await response.json(); //oddżejsonowuje
  let forecast = {
    temp: content.data[0].temp,
    description: content.data[0].weather.description,
    date:   content.data[0].datetime
  }
  console.log("forecast-obj", forecast);
  // console.log('url', content.hits[0].largeImageURL)
  return forecast;
}
 

module.exports = getForecast; 