// const fetch = require('node-fetch');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)); //from https://www.npmjs.com/package/node-fetch#difference-from-client-side-fetch fixing issues with fetch 3 not supporting require()
const dotenv = require('dotenv');
dotenv.config();

const baseURL = "https://pixabay.com/api/?";
const apiKey = "&key=" + process.env.pixabay_API_Key;
const orientation = "&orientation=horizontal";
const query = "&q=";


async function getPicture(inputDestination){
  console.log("inputDestination", inputDestination)
  const response = await fetch(baseURL+apiKey+orientation+query+inputDestination);
  // console.log("getPicture_url: ", baseURL+apiKey+orientation+query+inputDestination);
  // console.log("getPicture-res: ", response);
  // console.log('response.ok', response.ok);

  if (!response.ok) {
    console.log('pixabay, response.status: ', response.status, 'response.statusText: ', response.statusText);
    const err = new Error(); 
    throw err;
  }
  const content = await response.json(); //oddżejsonowuje
  // console.log("getPicture-content", content);
  if (content.hits.length == 0) {
    let picNotFound = null;
    // console.log('picNotFound', picNotFound);
    return picNotFound;
  } else {
    // console.log("getPicture-content", content);
    // console.log('url', content.hits[0].largeImageURL);
    return content.hits[0].webformatURL;
  }
  
}

module.exports = getPicture; // tu module.exports - eksportowanie funkcji do testowania;
