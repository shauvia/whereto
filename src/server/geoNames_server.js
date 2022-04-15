const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)); //from https://www.npmjs.com/package/node-fetch#difference-from-client-side-fetch fixing issues with fetch 3 not supporting require()
const dotenv = require('dotenv');
dotenv.config();

const baseURL = "http://api.geonames.org/searchJSON?";
const query = "q=";
const maxRows = "&maxRows=1";
const apiKey = "&username=" + process.env.geonames_API_key;


async function getGeoCoordinates(inputDestination){
  const response = await fetch(baseURL+query+inputDestination+maxRows+apiKey);
    if (!response.ok) {
      // console.log('geonames, response.status: ', response.status, 'response.statusText: ', response.statusText);
      let err = new Error('fetch failed, geonames, response.status: ' +  response.status, ' response.statusText: ' +  response.statusText);
      throw err;
    }
  let content = await response.json(); //oddżejsonowuje

  if (content.geonames.length == 0) {
    errorToThrow = new Error();
    errorToThrow.isNotFound = true;
    throw  errorToThrow;
 } else {
    let geoCoordinates = {
      lat: content.geonames[0].lat,
      long: content.geonames[0].lng, 
      country: content.geonames[0].countryName
    };
    return geoCoordinates;
  }
}

module.exports = getGeoCoordinates; 
