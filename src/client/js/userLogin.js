let userName = "";

let accUrl = "/users/"

// document.getElementById('createAccount').value;  //to powinno zczytywać gdy enter kliknięty -event handler 

async function createAcc(tripUrl, accUrl, userAccName){
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

function logOutAcc(){
  userLogin = ""
}

function clearDisplayAfterLogOut(){
  // usunąć wycieczki, i formularz wycieczek i powrócić do strony logowania
  document.getElementById('jestesZalogowana').innerHTML = ''
  document.getElementById("jestesLogOut").innerHTML = 'Wylogowałeś się'
}

function logOutAndClearDispHandler(event){
  logOutAcc();
  clearDisplayAfterLogOut();
}


async function createAccountHandler(event){
  let userName = document.getElementById('createAccount').value;
  let isAccount = createAcc(tripUrl, accUrl, userName);
  
  if (isAccount.isCreated == true){
    document.getElementById("accExists").innerHTML = "Account has already been created. Log in to your account and start creating your trips"
  } else {
    // zapytanie o listę wycieczek i wyświetlenie jej
    document.getElementById('tymczasowo').innerHTML = 'Wlasnie utworzyliśmy twoje konto. Brawo! A tera rob te wycieczki'
    // wyświetlić formularz tworzenia wycieczek;
  }
};

async function loginToAccHandler(event){
  let login = document.getElementById('login').value;
  let accExists = logToAcc(tripUrl, accUrl, login);
  if (accExists.isCreated == true){
    document.getElementById('jestesZalogowana').innerHTML = 'Jesteś zalogowana, a tu są twoje fajoskie wycieczki'
  } else {
    document.getElementById('jestesZalogowana').innerHTML = 'Konto nie istnieje. Utwoz prosze konto.'
  }
}



document.getElementById('logoutButton').addEventListener('click', logOutAndClearDispHandler)
document.getElementById('createAccount').addEventListener('input', createAccountHandler);
document.getElementById('loginButton').addEventListener('click',loginToAccHandler);

