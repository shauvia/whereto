function pickingValue(){
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

function displayResult(result, date){
  if (result.isNotFound){
    document.getElementById('temp').innerHTML = "Location not found";
  } else if(date != result.forecastDate){
    document.getElementById('unavailable').innerHTML = "Weather forecast is unavailable for provided date range.";
    document.getElementById('date').innerHTML = 'date: ' + result.forecastDate;
    document.getElementById('temp').innerHTML = 'temp:' + ' ' + result.temp + 'C';
    document.getElementById('weather').innerHTML = 'weather: ' + result.weather;
    document.getElementById('img').setAttribute('src', result.image); 
    // console.log('result.image', result.image);
    document.getElementById('city').innerHTML = result.city;
  } else { 
    document.getElementById('date').innerHTML = 'date: ' + result.forecastDate;
    document.getElementById('temp').innerHTML = 'temp:' + ' ' + result.temp + 'C';
    document.getElementById('weather').innerHTML = 'weather: ' + result.weather;
    document.getElementById('img').setAttribute('src', result.image); 
    // console.log('result.image', result.image);
    document.getElementById('city').innerHTML = result.city;
  }
}

function displayTrips(trips){
  let ul = document.getElementById('tripList');
  for( let i = 0; i < trips.length; i++){
    let li = document.createElement("li");
    li.innerHTML = trips[i].city;
    ul.appendChild(li);
  }
}

function displayErrorMessage(errorMessage){
  // document.getElementById('loading').innerHTML = error;
  document.getElementById('temp').innerHTML = errorMessage; //"Internal Server Error";
}

function clearTripList(){
  let ul = document.getElementById('tripList');
  while (ul.firstChild) { // code from https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild 
    ul.removeChild(ul.firstChild); 
  }
}

function displayNoStringMessage(){
  document.getElementById('notStringMsg').innerHTML = "Please enter a destination or dates of your trip." 
}


async function getTrips(url){
  let response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  let content = await response.json();
  
  return content;
}

async function sendRequest(url, uInput){
  let response = await fetch(url, { 
    method: 'POST' , 
    body: JSON.stringify(uInput),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  console.log("Fetch returned -client:", response);
  let content = await response.json(); // dobranie sie do tresci jest asynchroniczne, trzeba czekac; .json() oddżejsonowuje
  console.log('content-client', content);
  return content;
}




window.addEventListener('load', async (event) => {
  console.log('page is fully loaded');
  let trips = await getTrips("http://localhost:3000/trips");
    console.log('list of trips: ', trips);
    displayTrips(trips)
});


// window.onload = (event) => {
//   console.log('page is fully loaded');
// };



async function performAction(event){
  let userInput = pickingValue();
  if(!userInput.location || !userInput.startDay || !userInput){
    displayNoStringMessage();
    return
  }
  console.log('uInput', userInput);
  try {
    clearTripList();
    let weather = await sendRequest("http://localhost:3000/weatherForecast", userInput);
    displayResult(weather, userInput.startDay);
    let trips = await getTrips("http://localhost:3000/trips");
    console.log('list of trips: ', trips);
    displayTrips(trips);
  } catch(error){
    console.log("error", error.message);
    displayErrorMessage(error.message);
  } 
}


function initializeForms() {
  document.getElementById('sendButton').addEventListener('click', performAction);
}

export {initializeForms};