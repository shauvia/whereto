function pickingValue(){
  const dateStart = document.getElementById('tripStart').value;
  const destination = document.getElementById('tripPlace').value;
  // const dateEnd = document.getElementById('tripEnd').value;
  
  const userInput = {
    startDay: dateStart,
    // endDay: dateEnd,
    location: destination
  };

  // console.log("1", userInput.startDay);
  // console.log('2', userInput.location);
  // console.log('3', userInput.endDay);
  // console.log('user input', userInput);
  return userInput
}

async function sendRequest(url, uInput){
  let response = await fetch(url, { 
    method: 'POST' , 
    body: JSON.stringify(uInput),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  console.log("Fetch returned:", response);
  let content = await response.json(); // dobranie sie do tresci jest asynchroniczne, trzeba czekac; .json() oddżejsonowuje
  console.log('content', content);
  return content;
}

function displayInput(result){
  document.getElementById('temp').innerHTML = result.temp;
  document.getElementById('weather').innerHTML = result.weather;
  document.getElementById('img').setAttribute('src', result.image); 
}

function performAction(event){
  let userInput = pickingValue();
  console.log('some Value', userInput);
  let weather = sendRequest("http://localhost:3000/weatherForecast", userInput);
  console.log('weather', weather)

  
}

// wysłać na mój serwer obiekt user Input, dostać z serwera obiekt z info o pogodzie i linkiem i wyświetlić te informacje.


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