const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)); //from https://www.npmjs.com/package/node-fetch#difference-from-client-side-fetch fixing issues with fetch 3 not supporting require()
const dotenv = require('dotenv');
dotenv.config();

function returnForecastFor1Day(content, date){
  
  for (let i = 0; i < content.data.length; i++){
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

module.exports = returnForecastFor1Day;