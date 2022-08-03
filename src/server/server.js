const getPicture = require('./apiCalls_server.js');
const getGeoCoordinates = require('./geoNames_server.js');
const getForecastFor16Days = require('./weatherbit_server.js');
const returnForecastFor1Day = require('./oneDayForecast_server.js');

const storage = require('./storage.js');
const saveData = storage.saveData;
const loadData = storage.loadData;

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const travelDatafile = 'travelData.json'


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

// let destinationList = [];

let nextTripID = 0;
let users = {};



app.get('/users/:accId/trips', function(req,res){
  let userId = req.params.accId;
  let destinationList = users[userId];
  console.log("Sendin grips", destinationList.length);
  res.send(destinationList);
  }
)

app.get('/users/:accId/trips/:id', function (req, res){
  let userId = req.params.accId;
  let tripID = req.params.id;
  let destinationList = users[userId];
  for (let i = 0; i < destinationList.length; i++){
    if (tripID == destinationList[i].tripID){
      res.send(destinationList[i]);
    }
  }
})



app.post('/users/:accId/trips', async function(req, res){
  let userId = req.params.accId;
  console.log("userId", userId);
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
    users[userId].push(wetPredict);
    await saveData(travelDatafile, users);
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


app.delete('/users/:accId/trips/:id', function (req, res){
  let tripID = req.params.id;
  let userId = req.params.accId;
  let destinationList = users[userId];
  for (let i = 0; i < destinationList.length; i++){
    if (tripID == destinationList[i].tripID){
      destinationList.splice(i, 1);
      saveData(travelDatafile, destinationList);
      res.send();
      //  does it need to send something? if not then what with response/content on client side?
    }
  }
})


app.put('/users', async function (req, res){
  let userAccName = req.body;
  console.log('Sprawdz', userAccName);
  let accCheck = {
    alreadyCreated : false
  };

  if (userAccName in users) {
    console.log('Juz jest ', userAccName);
    accCheck.alreadyCreated = true;
    console.log('accCheck: ', accCheck)
    res.send(accCheck);
  } else {
    users[userAccName] = [];
    console.log("users", users)
    console.log("account", users[userAccName])
    await saveData(travelDatafile, users);
    res.send(accCheck);
  }
});

app.get('/users/:accId', function(req, res){
  let userAcc = req.params.accId;
  console.log('Zczytalo', userAcc)
  let accCheck = {
    isCreated : true
  };
  if (userAcc in users) {
    console.log('Konto istnieje', userAcc);
    console.log('accCheck: ', accCheck)
    res.send(accCheck);
  } else {
    accCheck.isCreated = false;
    console.log('nieistnieje, accCheck: ', accCheck)
    res.send(accCheck);
  }
});

try{
  destinationList = loadData(travelDatafile);
} catch(error) {
    console.log('Error on the server: ', error, "Unable to read from file destlist");
}

try {
  users = loadData(travelDatafile);
} catch(error){
  console.log('Error on the server: ', error, "Unable to read from file userlist");
}

const server = app.listen(port, listening);

