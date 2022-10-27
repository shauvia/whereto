const tripsApi = "/trips/"

const tripUrl = ""; // Empty url means it will call the server that serves the website

const accUrl = "/users/"

let userLogin = "";

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

function clearAndDisplTripList(trips){
  clearTripList();
  displayTripList(trips)
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


async function fetchTrip(url, accountURL, accName, tripsApi, tripNumber){
  let response = await fetch(url + accountURL + accName + tripsApi + tripNumber, {
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

async function getTrips(url, accountURL, accName, tripsApi){
  console.log("url, accountURL, accName, tripsApi", url, accountURL, accName, tripsApi)
  let response = await fetch(url + accountURL + accName + tripsApi, {
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


async function addTrip(url, accountURL, accName, tripsApi, uInput){
  console.log("addTrip in SaveTripHandler", url, accountURL, accName, tripsApi, uInput)
  console.log("app.js, addTrip URL: ", url+accountURL+accName+tripsApi)
  let response = await fetch(url+accountURL+accName+tripsApi, { 
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

async function removeTrip(url, accountURL, accName, tripsApi, currentTripNum){
  let response = await fetch(url + accountURL + accName + tripsApi + currentTripNum, { 
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
  let oneTrip = await fetchTrip(tripUrl, accUrl, userLogin, tripsApi, tripNumber);
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
    let weather = await addTrip(tripUrl, accUrl, userLogin, tripsApi, userInput); 
    // console.log("addTrip in SaveTripHandler", tripUrl, accUrl, userLogin, tripsApi, userInput)
    displayTrip(weather, userInput.startDay);
    let trips = await getTrips(tripUrl, accUrl, userLogin, tripsApi);
    showTrip();
    clearAndDisplTripList(trips);
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
    await removeTrip(tripUrl, accUrl, userLogin, tripsApi, currentTripNum);
    let trips = await getTrips(tripUrl, accUrl, userLogin, tripsApi);
    clearAndDisplTripList(trips)
    currentTripNum = -1;
    showForm();

  } catch (error){
    displayErrorMessage();
  }
}

function loadWindowHandler(event) {
  showHomePage()
}

// async function OnLoginHandler(event){
//   showTripsAndFormOnLogin();
// }

async function onCreatingAccHAndler(event){
  showLoginPage()
}





function showHomePage(){
  document.getElementById("logOrCreateAcc").style.display = "grid";
  document.getElementById("tripsDisplay").style.display='none';
  document.getElementById("logoutForm").style.display = 'none';
}

function showLoginPage(){
  document.getElementById('loginForm').style.display = "grid";
  document.getElementById('createAccForm').style.display = 'none';
  document.getElementById("tripsDisplay").style.display='none';
  document.getElementById("logoutForm").style.display = 'none';
}

async function showTripsAndFormOnLogin(){
  let trips = await getTrips(tripUrl, accUrl, userLogin, tripsApi);
  clearAndDisplTripList(trips);
  document.getElementById("logOrCreateAcc").style.display = "none";
  document.getElementById("tripsDisplay").style.display='grid';
  showForm();
  document.getElementById("logoutForm").style.display = 'block';
}

function cleanLogin(){
  document.getElementById('login').value = "";
}

function cleanCreateAccInput(){
  document.getElementById('createAccount').value = "";
}

function logOutAcc(){
  userLogin = ""
  showHomePage();
  document.getElementById("logoutForm").style.display = 'none';
}

function clearLoginLogoutMessages(){
  // usunąć wycieczki, i formularz wycieczek i powrócić do strony logowania
  document.getElementById('jestesZalogowana').innerHTML = '';
  document.getElementById("jestesLogOut").innerHTML = '';
  document.getElementById("emptyAccName").innerHTML = '';
  document.getElementById("accExists").innerHTML = '';
  document.getElementById("tymczasowo").innerHTML = '';

}


async function createAcc(tripUrl, accUrl, userAccName){
  console.log("Creating acc. TripUrl ", tripUrl, "acUrl", accUrl, "userName", userAccName);
  let response = await fetch(tripUrl + accUrl, {
    method: 'PUT',
    body: JSON.stringify(userAccName),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    let err = new Error('fetch failed, createAcc failed, response.status: ' +  response.status, ' response.statusText: ' +  response.statusText);
    throw err;
  }
  let answer = await response.json();
  return answer;
}

async function logToAcc(tripUrl, accUrl, accId) {
  let response = await fetch(tripUrl + accUrl + accId, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    let err = new Error('fetch failed, logToAcc failed, response.status: ' +  response.status, ' response.statusText: ' +  response.statusText);
    throw err;
  }
  let content = await response.json();
  return content;
}

async function preventInputSendingHandler(event){
  if (event.key === "Enter") {
    event.preventDefault();
    // wsadzić tu funkcję która loguje albo tworzy konto? 
  }
}


async function createAccountHandler(event){ 
  let userName = document.getElementById('createAccount').value;
  console.log("userName: ", userName)
  if (!userName || userName ==""){
    clearLoginLogoutMessages();
    document.getElementById('emptyAccName').innerHTML = 'Account username cannot be empty.'
    return;
  }
  let account = await createAcc(tripUrl, accUrl, userName);
  console.log("tripUrl, accUrl, userName: ", tripUrl, accUrl, userName)
  console.log("account: ", account);
  cleanCreateAccInput()
  if (!account.alreadyCreated){
    clearLoginLogoutMessages();
    showHomePage();
    document.getElementById('tymczasowo').innerHTML = 'Your account ' + userName + ' has been set up.';
    
  } else {
    clearLoginLogoutMessages();
    document.getElementById("accExists").innerHTML = "You have already created account: " + userName;
  
  }
  
};

async function loginToAccHandler(event){
  let userAccName = document.getElementById('login').value;
  if (!userAccName || userAccName ==""){
    clearLoginLogoutMessages();
    document.getElementById('emptyAccName').innerHTML = 'Account username cannot be empty.'
    return;
  }
  let accExists = await logToAcc(tripUrl, accUrl, userAccName);
  console.log("tripUrl, accUrl, login: ", tripUrl, accUrl, userAccName)
  cleanLogin()
  if (!accExists.isCreated){
    clearLoginLogoutMessages();
    document.getElementById('jestesZalogowana').innerHTML = 'Account: ' + userAccName + " doesn't exist. Please create your account."
  } else {
    userLogin = userAccName;
    console.log("login in else: ", userLogin)
    clearLoginLogoutMessages();
    // document.getElementById('jestesZalogowana').innerHTML = 'Jesteś zalogowana, a tu są twoje fajoskie wycieczki'
    showTripsAndFormOnLogin();
    console.log('userLogin in function loginTo:',  userLogin);
  }
  
}

function logOutAndClearDispHandler(event){
  logOutAcc();
  console.log('userLogin logout', userLogin);
  clearLoginLogoutMessages();
  currentTripNum = -1;
}




function initializeForms() {
  
  window.addEventListener('load', loadWindowHandler);
  document.getElementById('buttonAddTrip').addEventListener('click', showForm);
  buttonRemoveTrip.addEventListener('click', removeTripHandler);
  document.getElementById('logOrCreateAcc').addEventListener("keydown", preventInputSendingHandler)
  document.getElementById('loginForm').addEventListener("keydown", preventInputSendingHandler)
  document.getElementById('createAccBtn').addEventListener('click', createAccountHandler);
  // document.getElementById('createAccBtn').addEventListener('click', onCreatingAccHAndler); 
  document.getElementById('loginButton').addEventListener('click',loginToAccHandler);
  // document.getElementById('loginButton').addEventListener('click', OnLoginHandler);
  document.getElementById('logoutButton').addEventListener('click', logOutAndClearDispHandler)
}

// czy mogę mieć event listenera na dwóch eventach dotyczących tego samego przycisku? Np listener na click i na enter?


export {initializeForms};
export {saveTripHandler};

// do zrobienia
// po wylogowaniu się chcę się ponownie zalogować, i nie utworzono konta, to powinna się pojawić plansza: utwórz konto 
