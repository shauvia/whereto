const getPicture = require('./apiCalls_server.js');
const getGeoCoordinates = require('./geoNames_server.js');
const getForecast = require('./weatherbit_server.js');

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



function listening(){
  console.log('server runnning');
  console.log(`runnning on localhost ${port}`);
}

const destinationList = [];

let nextTripID = 0;

app.get('/trips', function(req,res){
  res.send(destinationList);
  }
)

app.post('/weatherForecast', async function(req, res){
  let wetPredict = {
    temp: null,
    weather: '',
    image: '',
    city: '',
    forecastDate: '',
    inputStartDate: '',
    inputEndDate: '',
    isNotFound: false,
    tripID: -1

  };

  try {
    wetPredict.city = req.body.location;
    let startDay = req.body.startDay;
    let geoCoord = await getGeoCoordinates(wetPredict.city);
    wetPredict.image = await getPicture(wetPredict.city);
    // console.log('pic1', wetPredict.image, "country: ", geoCoord.country);
    if (!wetPredict.image && geoCoord.country){
      wetPredict.image = await getPicture(geoCoord.country);
      // console.log('pic2', wetPredict.image);
    }
    if (!wetPredict.image) {
      wetPredict.isNotFound = true;
      res.send(wetPredict);
      // console.log('pic3', wetPredict.image);
      return;
    }
    let forecast = await getForecast(geoCoord.lat, geoCoord.long, startDay);
    // console.log("forecast", forecast);
    wetPredict.temp = forecast.temp;
    wetPredict.weather = forecast.description;
    wetPredict.forecastDate = forecast.date;
    wetPredict.inputStartDate = req.body.startDay;
    wetPredict.inputEndDate = req.body.endDay;
    wetPredict.tripID = nextTripID;
    nextTripID = nextTripID + 1;
    destinationList.push(wetPredict);
    console.log('destinationList', destinationList);
    res.send(wetPredict);
  } catch(error) {
      if (error.isNotFound) {
        wetPredict.isNotFound = true;
        res.send(wetPredict);
      } else { 
        res.status(500).send();
        console.log('Error on the server: ', error);
      }
  }
});


const server = app.listen(port, listening);

// dopisać properties inputStartDate, inputEndDate z info podanego przez użytkownika oraz wepchnąć ten obiekt wetPredict to listy DestinationList przed wysłaniem odpowiedzi do użytkownika.


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