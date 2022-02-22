const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)); //from https://www.npmjs.com/package/node-fetch#difference-from-client-side-fetch fixing issues with fetch 3 not supporting require()
const dotenv = require('dotenv');
dotenv.config();

const baseURL = "http://api.geonames.org/searchJSON?";
const query = "q=";
const maxRows = "&maxRows=1";
const apiKey = "&username=" + process.env.geonames_API_key;


async function getGeoCoordinates(inputDestination){
  const response = await fetch(baseURL+query+inputDestination+maxRows+apiKey);
  console.log("getGeo_url: ", baseURL+query+inputDestination+maxRows+apiKey);
  console.log("getGeo-res: ", response);
  const content = await response.json(); //oddżejsonowuje
  console.log("getGeo_content", content);
  
  let geoCoordinates = {
    lat: content.geonames[0].lat,
    long: content.geonames[0].lng
  };
  console.log('lat', content.geonames[0].lat);
  console.log('long', content.geonames[0].lng)
  
  return geoCoordinates;
}

module.exports = getGeoCoordinates; 
