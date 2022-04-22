const getPicture = require('./apiCalls_server.js');
const getGeoCoordinates = require('./geoNames_server.js');
const getForecastFor16Days = require('./weatherbit_server.js');
const returnForecastFor1Day = require('./oneDayForecast_server.js');

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

const port = process.env.PORT || 3000



function listening(){
  console.log('server runnning');
  console.log(`runnning on localhost ${port}`);
}

// napisać app.get, który bierze nr wycieczki i zwraca konkretną wycieczkę

const destinationList = [];

let nextTripID = 0;

app.delete('/trips/:id', function (req, res){
  let tripID = req.params.id;
  for (let i = 0; i < destinationList.length; i++){
    if (tripID == destinationList[i].tripID){
      destinationList.splice(i, 1);
      res.send();
      //  does it need to send something? if not then what with response/content on client side?
    }
  }
})

app.get('/trips', function(req,res){
  res.send(destinationList);
  }
)

app.get('/trips/:id', function (req, res){
  let tripID = req.params.id;
  for (let i = 0; i < destinationList.length; i++){
    if (tripID == destinationList[i].tripID){
      res.send(destinationList[i]);
    }
  }
})



app.post('/trips', async function(req, res){
  let wetPredict = {
    temp: null,
    weather: '',
    image: '',
    city: '',
    forecastDate: '',
    inputStartDate: '',
    inputEndDate: '',
    isNotFound: false,
    dateNotFound: false,
    tripID: -1
  };

  try {
    wetPredict.city = req.body.location;
    let startDay = req.body.startDay;
    let geoCoord = await getGeoCoordinates(wetPredict.city); // getting geocoordinates
    wetPredict.image = await getPicture(wetPredict.city); // getting picture
    if (!wetPredict.image && geoCoord.country){ //if there is no picure found base on user input a request is sent again but with country name  
      wetPredict.image = await getPicture(geoCoord.country);
    }
    if (!wetPredict.image) {
      wetPredict.isNotFound = true;
      res.send(wetPredict);
      return;
    }
    let forecastArr = await getForecastFor16Days(geoCoord.lat, geoCoord.long); //returns an object with a list of forecast for 16 days
    let forecast = returnForecastFor1Day(forecastArr, startDay); // returns a forecast for provided user start date or the last day of 16 day forecast 
    wetPredict.temp = forecast.temp;
    wetPredict.weather = forecast.description;
    wetPredict.forecastDate = forecast.date;
    wetPredict.dateNotFound = forecast.dateNotFound;
    wetPredict.inputStartDate = req.body.startDay;
    wetPredict.inputEndDate = req.body.endDay;
    wetPredict.tripID = nextTripID;
    nextTripID = nextTripID + 1;
    destinationList.push(wetPredict);
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

