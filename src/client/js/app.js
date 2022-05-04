let tripsApi = "/trips/"

const tripUrl = ""; // Empty url means it will call the server that serves the website

let currentTripNum = -1;

function gatherUserInput(){
  const dateStart = document.getElementById('tripStart').value;
  const destination = document.getElementById('tripPlace').value;
  const dateEnd = document.getElementById('tripEnd').value;
  
  const userInput = {
    startDay: dateStart,
    endDay: dateEnd,
    location: destination
  };
  return userInput
}

function displayTrip(trip){
  if (trip.isNotFound){
    document.getElementById('temp').innerHTML = "Location not found";
  } else if(trip.dateNotFound){
    document.getElementById('unavailable').innerHTML = "Weather forecast is unavailable for provided date range.";
    document.getElementById('temp').innerHTML = 'temp:' + ' ' + trip.temp + 'C';
    document.getElementById('weather').innerHTML = 'weather: ' + trip.weather;
    document.getElementById('img').setAttribute('src', trip.image); 
    document.getElementById('city').innerHTML = trip.city;
    document.getElementById('start').innerHTML = 'start: ' + trip.inputStartDate;
    document.getElementById('end').innerHTML = 'end: ' + trip.inputEndDate;
  } else { 
    document.getElementById('temp').innerHTML = 'temp:' + ' ' + trip.temp + 'C';
    document.getElementById('weather').innerHTML = 'weather: ' + trip.weather;
    document.getElementById('img').setAttribute('src', trip.image); 
    document.getElementById('city').innerHTML = trip.city;
    document.getElementById('start').innerHTML = 'start: ' + trip.inputStartDate;
    document.getElementById('end').innerHTML = 'end: ' + trip.inputEndDate;
  }
}


function displayTripList(trips){
  let ul = document.getElementById('tripList');
  for( let i = 0; i < trips.length; i++){
    let li = document.createElement("li");
    li.innerHTML = trips[i].city;
    let tripNum = trips[i].tripID;
    let eventHandler = async (event) => {
      await fetchAndDisplayTrip(tripNum);
    };
    li.addEventListener('click', eventHandler);
    // li.setAttribute("id", trips[i].tripID);
    ul.appendChild(li);
  }
}

function clearTripList(){
  let ul = document.getElementById('tripList');
  while (ul.firstChild) { // code from https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild 
    ul.removeChild(ul.firstChild); 
  }
}

function displayErrorMessage(){
  document.getElementById('errorMsg').innerHTML = "Internal Server Error";
}

function displayNoInputMessage(){
  document.getElementById('notStringMsg').innerHTML = "Please enter a destination or dates of your trip." 
}

function clearNoInputMessage(){
  document.getElementById('notStringMsg').innerHTML = "";
}

function showForm(){
  document.getElementById("formWrapper").style.display = "block";
  document.getElementById("newTripDisplay").style.display='none';
}

function showTrip(){
  document.getElementById("formWrapper").style.display = "none";
  document.getElementById("newTripDisplay").style.display='block';
}

function cleanFrom(){
  document.getElementById('tripStart').value = '';
  document.getElementById('tripPlace').value = '';
  document.getElementById('tripEnd').value = '';
}

function disableBtn() {
  document.getElementById("sendButton").disabled = true; // from https://www.w3schools.com/jsref/prop_pushbutton_disabled.asp
}

function enableBtn() {
  document.getElementById("sendButton").disabled = false; //from https://www.w3schools.com/jsref/prop_pushbutton_disabled.asp
}

function setCursorWait() {
  document.body.style.cursor = "wait";
}
function setCursorDefault() {
  document.body.style.cursor = "default";
}

// Fetches

async function fetchTrip(url, tripsApi, tripNumber){
  let response = await fetch(url + tripsApi + tripNumber, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    let err = new Error('fetch failed, fetchTrip, response.status: ' +  response.status, ' response.statusText: ' +  response.statusText);
    throw err;
  }
  let content = await response.json();
  return content;
}

async function getTrips(url, tripsApi){
  let response = await fetch(url + tripsApi, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    let err = new Error('fetch failed, getTrips, response.status: ' +  response.status, ' response.statusText: ' +  response.statusText);
    throw err;
  }
  let content = await response.json();
  return content;
}

async function addTrip(url, tripsApi, uInput){
  let response = await fetch(url + tripsApi, { 
    method: 'POST' , 
    body: JSON.stringify(uInput),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    let err = new Error('fetch failed, addTrip and get forecast, response.status: ' +  response.status, ' response.statusText: ' +  response.statusText);
    throw err;
  }
  let content = await response.json(); // dobranie sie do tresci jest asynchroniczne, trzeba czekac; .json() oddżejsonowuje
  return content;
}

async function removeTrip(url, tripsApi, currentTripNum){
  let response = await fetch(url + tripsApi + currentTripNum, { 
    method: 'DELETE', 
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    const err = new Error('fetch failed, removeTrip, response.status: ' +  response.status, ' response.statusText: ' +  response.statusText); 
    throw err;
  }
}

// mixed html and server interactions

async function fetchAndDisplayTrip(tripNumber){
  console.log("url", tripUrl,  "nr", tripNumber);
  showTrip();
  document.getElementById('unavailable').innerHTML = "";
  let oneTrip = await fetchTrip(tripUrl, tripsApi, tripNumber);
  currentTripNum = tripNumber;
  displayTrip(oneTrip);
}

async function saveTripHandler(event) {
  let userInput = gatherUserInput();
  if(!userInput.location || !userInput.startDay || !userInput){
    displayNoInputMessage();
    return
  }
  disableBtn();
  setCursorWait()
  try {
    let weather = await addTrip(tripUrl, tripsApi, userInput);
    displayTrip(weather, userInput.startDay);
    let trips = await getTrips(tripUrl, tripsApi);
    showTrip();
    clearTripList();
    displayTripList(trips);
    cleanFrom();
    clearNoInputMessage()
    currentTripNum = weather.tripID;
  } catch(error){
    console.log("error", error.message);
    displayErrorMessage();
  }
  setCursorDefault() 
  enableBtn();
  
}

async function removeTripHandler(event) {
  try{
    await removeTrip(tripUrl, tripsApi, currentTripNum);
    let trips = await getTrips(tripUrl, tripsApi);
    clearTripList();
    displayTripList(trips);
    currentTripNum = -1;
    showForm();

  } catch (error){
    displayErrorMessage();
  }
}

async function loadWindowHandler(event) {
  let trips = await getTrips(tripUrl, tripsApi);
    displayTripList(trips)
}

function initializeForms() {
  
  document.getElementById('buttonAddTrip').addEventListener('click', showForm);
  buttonRemoveTrip.addEventListener('click', removeTripHandler);
  window.addEventListener('load', loadWindowHandler);
}


export {initializeForms};
export {saveTripHandler};
