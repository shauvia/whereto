// const fetch = require('node-fetch');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)); //from https://www.npmjs.com/package/node-fetch#difference-from-client-side-fetch 
// fixing issues with fetch 3 not supporting require()
const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs').promises;
const sharp = require("sharp");

const baseURL = "https://pixabay.com/api/?";
const apiKey = "&key=" + process.env.pixabay_API_Key;
const orientation = "&orientation=horizontal";
const query = "&q=";


async function getPicture(inputDestination){
  const response = await fetch(baseURL+apiKey+orientation+query+inputDestination);
  console.log("Pixabay URL: " , baseURL+apiKey+orientation+query+inputDestination)
  if (!response.ok) {
    const err = new Error('fetch failed, pixabay, response.status: ' + response.status + ' response.statusText: ' + response.statusText); 
    throw err;
  }
  const content = await response.json(); //oddżejsonowuje
  if (content.hits.length == 0) {
    let picNotFound = null;
    return picNotFound;
  } else {
    return content.hits[0].largeImageURL;
  }
  
}

async function  downloadImage(url, filepath) {
  
  const res = await fetch(url);
  if (!res.ok) {
    let err = new Error('get picture failed, response.status: ' +  res.status, ' response.statusText: ' +  res.statusText);
    res.resume();
    throw err;
  }
  
  const buffer = await res.buffer();
  await fs.writeFile(filepath, buffer);
  // const stream = res.body.pipe(fs.createWriteStream("dupa.jpg"));
  // await new Promise(fulfill => stream.on("finish", fulfill));
  console.log("Udało się zapisać plik", filepath)
}

async function resizeImage() { // from https://www.digitalocean.com/community/tutorials/how-to-process-images-in-node-js-with-sharp
  try {
      await sharp("/userimages/fotka.jpg")
      .resize({
        width: 800,
        height: 600
      })
      .toFormat("jpeg", { mozjpeg: true })
      .toFile("/userimages/fotkaResized.jpeg");
  } catch (error) {
    console.log("resize Image", error);
  }
}

// jak wysyłać bloba do mongo



let pictureRetrival = {
  getPicture: getPicture,
  downloadImage: downloadImage,
  resizeImage: resizeImage
};




module.exports = pictureRetrival; // tu module.exports - eksportowanie funkcji do testowania;
