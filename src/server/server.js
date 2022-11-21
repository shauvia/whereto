const pictureRetrival = require('./apiCalls_server.js');
const getPicture = pictureRetrival.getPicture;
const downloadImage = pictureRetrival.downloadImage;
const resizeImage = pictureRetrival.resizeImage
const getGeoCoordinates = require('./geoNames_server.js');
const getForecastFor16Days = require('./weatherbit_server.js');
const returnForecastFor1Day = require('./oneDayForecast_server.js');

const storage = require('./index.js');
const saveDataMongo = storage.saveDataMongo;
const loadDatafromMongo = storage.loadDatafromMongo;


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

// zrobić ściaganie zdjęcia z pixabay, przycinanie zdjęcia, zapamiętywanie zdjęcia w MongoDB

function listening(){
  console.log('server runnning');
  console.log(`runnning on localhost ${port}`);
}

app.get('/users/:accId/trips', async function(req,res){
  try{
    let userId = req.params.accId;
    let user = await loadDatafromMongo(userId);
    let destinationList = user.trips;
    console.log("Sending trips", destinationList.length);
    res.send(destinationList);
  } catch(error){
    console.log('Error on the server, getting trip list failed: ', error)
    res.status(500).send();
  }  
})

app.get('/users/:accId/trips/:id', async function (req, res){
  try{
    let userId = req.params.accId;
    let tripID = req.params.id;
    // let oneTrip = await loadOneTrip(userId, tripID);
    // console.log("Loading one trip: ", oneTrip)
    let user = await loadDatafromMongo(userId);
    let destinationList = user.trips;
    for (let i = 0; i < destinationList.length; i++){
      if (tripID == destinationList[i].tripID){
        res.send(destinationList[i]);
        break;
      }
    }  
  } catch(error){
    console.log('Error on the server, retrieving one trip failed: ', error);
    res.status(500).send();
    
  }
})



app.post('/users/:accId/trips', async function(req, res){
  try {
    console.time("AddTripRequest", "city:", req.body.location);
    let userId = req.params.accId;
    console.time("LoadFromMongo");
    let user = await loadDatafromMongo(userId);
    console.timeEnd("LoadFromMongo");
    let trips = user.trips;
    let nextTripID = user.nextTripID;
    let wetPredict = {
      city: '',
      temp: null,
      weather: '',
      image: '',
      forecastDate: '',
      inputStartDate: '',
      inputEndDate: '',
      isNotFound: false,
      dateNotFound: false,
      tripID: -1
    };
    wetPredict.city = req.body.location;
    let startDay = req.body.startDay;
    console.time("getGeoCoordinates");
    let geoCoord = await getGeoCoordinates(wetPredict.city); // getting geocoordinates
    console.timeEnd("getGeoCoordinates");
    console.time("getGeoCoordinates");
    wetPredict.image = await getPicture(wetPredict.city); // getting picture, link
    console.timeEnd("getGeoCoordinates");
    await downloadImage(wetPredict.image, "/userimages/fotka.jpg");
    await resizeImage();
    if (!wetPredict.image && geoCoord.country){ //if there is no picure found base on user input a request is sent again but with country name  
      wetPredict.image = await getPicture(geoCoord.country);
    }
    if (!wetPredict.image) {
      wetPredict.isNotFound = true;
      res.send(wetPredict);
      return;
    }
    console.time("getForecastFor16Days");
    let forecastArr = await getForecastFor16Days(geoCoord.lat, geoCoord.long); //returns an object with a list of forecast for 16 days
    console.timeEnd("getForecastFor16Days");
    let forecast = returnForecastFor1Day(forecastArr, startDay); // returns a forecast for provided user start date or the last day of 16 day forecast 
    wetPredict.temp = forecast.temp;
    wetPredict.weather = forecast.description;
    wetPredict.forecastDate = forecast.date;
    wetPredict.dateNotFound = forecast.dateNotFound;
    wetPredict.inputStartDate = req.body.startDay;
    wetPredict.inputEndDate = req.body.endDay;
    wetPredict.tripID = nextTripID;
    nextTripID = nextTripID + 1;
    user.nextTripID = nextTripID;
    console.log("nextTripID", nextTripID)
    trips.push(wetPredict);
    await saveDataMongo(user);
    res.send(wetPredict);
  } catch(error) {
      if (error.isNotFound) {
        wetPredict.isNotFound = true;
        res.send(wetPredict);
      } else { 
        res.status(500).send();
        console.log('Error on the server, trip adding failed: ', error);
      }
  }
  console.timeEnd("AddTripRequest");
});


app.delete('/users/:accId/trips/:id', async function (req, res){
  try{
    let tripID = req.params.id;
    let userId = req.params.accId;
    let user = await loadDatafromMongo(userId);
    let destinationList = user.trips; //list of trips
    for (let i = 0; i < destinationList.length; i++){
      if (tripID == destinationList[i].tripID){
        destinationList.splice(i, 1);
        await saveDataMongo(user);
        res.send();
      }
    }
  }catch(error){
    res.status(500).send();
    console.log('Error on the server, deleting trip failed: ', error);
  }  
})


app.put('/users', async function (req, res){
  try{
    let userAccName = req.body;
    let userExists = await loadDatafromMongo(userAccName);
    console.log("Sprawdzam czy konto istnieje", userExists);
    let accCheck = {
      alreadyCreated : false
    };
    if (!userExists){
      let user = {
        _id : userAccName,
        trips: [],
        nextTripID: 0,

      }
      await saveDataMongo(user);
      res.send(accCheck);
    } else {
      accCheck.alreadyCreated = true;
      console.log('Konto już jest ', userAccName);
      res.send(accCheck);
    }
  }catch(error){
    res.status(500).send();
    console.log('Error on the server, account creating failed: ', error);
  }  
});

app.get('/users/:accId', async function(req, res){
  try{
    let userAcc = req.params.accId;
    let userExists = await loadDatafromMongo(userAcc); 
    console.log('Zczytalo', userAcc)
    let accCheck = {
      isCreated : true
    };
    if (!userExists){
      accCheck.isCreated = false;
      console.log('konto nie istnieje, accCheck: ', accCheck)
      res.send(accCheck);
    } else {
      accCheck.alreadyCreated = true;
      console.log('Juz jest ', userAcc);
      res.send(accCheck);
    }
  }catch(error){
    res.status(500).send();
    console.log('Error on the server, loggin to account failed: ', error);
  }    
});


async function handlingDataLoad(){
  try {
    users = await loadDatafromMongo();
    // console.log("server", users);
  } catch(error){
    console.log('Error on the server: ', error, "Unable to load from database");
  }
}

handlingDataLoad();

const server = app.listen(port, listening);

