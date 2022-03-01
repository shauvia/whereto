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
  // console.log("getPicture_url: ", baseURL+apiKey+orientation+query+inputDestination);
  // console.log("getPicture-res: ", response);
  console.log('response.ok', response.ok);

  if (!response.ok) {
    console.log('response.status: ', response.status, 'response.statusText: ', response.statusText);
    const err = new Error(); 
    throw err;
  }
  const content = await response.json(); //oddżejsonowuje
  // console.log("getPicture-content", content);
  if (content.hits.length == 0) {
     errorToThrow = new Error();
     errorToThrow.isNotFound = true;
    //  console.log('error', errorToThrow);
     throw  errorToThrow;
  } else {
    // console.log("getPicture-content", content);
    // console.log('url', content.hits[0].largeImageURL);
    return content.hits[0].webformatURL;
  }
  
}

module.exports = getPicture; // tu module.exports - eksportowanie funkcji do testowania;


// async function getAnalysis(userInput){
//   const fixedInput = fixedEncodeURI(userInput);
//   const response = await fetch(baseURL+fixedInput+apiKey+lang);
//   console.log("Serv_url: ", baseURL+fixedInput+apiKey+lang);
//   console.log("Serv-res: ", response);
//   if (!response.ok){
//     const errorToThrow = new Error();
//     errorToThrow.isOutsideApiError = true;
//     // errorToThrow.message = "Serwer api.meaningcloud.com nie może teraz obsłużyć tego żądania."
//     throw errorToThrow;
//   }
//   const analysis = await response.json(); //oddżejsonowuje
//   console.log("serv-analysis", analysis);
//   return analysis;
// }