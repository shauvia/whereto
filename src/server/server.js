const getPicture = require('./apiCalls_server.js');
const getGeoCoordinates = require('./geoNames_server.js')

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
app.use(bodyParser.urlencoded( {extended: false} ));
// strict:false is needed to accept raw string
app.use(bodyParser.json({strict:false}));

app.use(cors());
app.use(express.static('dist'));
app.use(express.static('public'));

// app.use(express.static('src/client'));

const port = 3000;

const server = app.listen(port, listening);

function listening(){
  console.log('server runnning');
  console.log(`runnning on localhost ${port}`);
}



app.post('/weatherForecast', async function(req, res){
  let wetPredict = {
    temp: 25,
    weather: 'partly sunny',
    image: '',
    city: ''
  };

  // image: 'http://localhost:3000/torun_view.jpg',
  wetPredict.city = req.body.location;
  wetPredict.image = await getPicture(wetPredict.city);
  // console.log('image', wetPredict.image);
  let geoCoord = await getGeoCoordinates(wetPredict.city);
  console.log('moj_server_geoCoord', geoCoord);

  res.send(wetPredict);
});

// dostosować f-cję do przyjęcia informacji od klienta z datą i miejsce i zwrócenia informacji hardkodowanej o temperaturze, prognozie pogody i linku do zdjęcia; wysłąć obkiekt z properties:  temp, prognozie pogody oraz linku do zdjęcia; 
// app.post("/analysedText", async function(req, res){
//   console.log("serv-req.body", req.body);
//   try{
//     let analysis = await getAnalysis(req.body);
//     console.log("post-Analysis", analysis);
//     res.send(analysis);
//   }catch(error){
//     if (error.isOutsideApiError) {
//       res.status(566).send();
//     } else {
//     res.status(500).send();
//     console.log("serv-error", error);
//     }
//   }  
// });

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