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

function displayErrorMessage(){
  // document.getElementById('loading').innerHTML = error;
  document.getElementById('temp').innerHTML = "Internal Server Error";
}

async function getTrips(url){
  let response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  let content = await response.json();
  console.log('list of trips: ', content);
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



async function performAction(event){
  let userInput = pickingValue();
  console.log('uInput', userInput);
  try {
    let weather = await sendRequest("http://localhost:3000/weatherForecast", userInput);
    console.log('weather.date', weather.date)
    displayResult(weather, userInput.startDay);
    getTrips("http://localhost:3000/trips");
  } catch(error){
    displayErrorMessage();
  } 
}

// porównać datę użytkownika do dat, która została zwrócona i jeśli się różnią, to wyświetlić info, że prognoza pogody dla tej daty jest niedostepna


// async function getAllData(url, uInput) {
//   // Wrapping string in an object sis needed when express body-pareser runs with strict=true
//   let inputWrapper = { txt: uInput };
//   console.log("Strigified: " + JSON.stringify(inputWrapper));
//   let response = await fetch(url, { 
//     method: 'POST' , 
//     body: JSON.stringify(uInput),
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   }); // domyslnie zapytanie GET
//   console.log("Fetch returned:", response);

//   checkResponseOk(response);

//   let content = await response.json(); // dobranie sie do tresci jest asynchroniczne, trzeba czekac; .json() oddżejsonowuje
//   console.log('content', content);
//   return content;
//   // jeśli moj server rzuca błędem 500 to rzucić wyjątkiem (throw error/exception) na fetchu z wiadomością statusText: "Internal Server Error"; patrz console.log(fetch returned)
   
// }

function initializeForms() {
  document.getElementById('sendButton').addEventListener('click', performAction);
}

export {initializeForms};