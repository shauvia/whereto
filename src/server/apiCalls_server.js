// const fetch = require('node-fetch');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)); //from https://www.npmjs.com/package/node-fetch#difference-from-client-side-fetch fixing issues with fetch 3 not supporting require()
const dotenv = require('dotenv');
dotenv.config();

const baseURL = "https://pixabay.com/api/?";
const apiKey = "&key=" + process.env.pixabay_API_Key;
const orientation = "&orientation=horizontal";
const query = "&q=";


async function getPicture(inputDestination){
  const response = await fetch(baseURL+apiKey+orientation+query+inputDestination);
  if (!response.ok) {
    const err = new Error('fetch failed, pixabay, response.status: ' + response.status + ' response.statusText: ' + response.statusText); 
    throw err;
  }
  const content = await response.json(); //oddżejsonowuje
  if (content.hits.length == 0) {
    let picNotFound = null;
    return picNotFound;
  } else {
    return content.hits[0].webformatURL;
  }
  
}

module.exports = getPicture; // tu module.exports - eksportowanie funkcji do testowania;
