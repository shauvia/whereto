const fs = require('fs');


async function saveData(input){
  const data = JSON.stringify(input);

  // write JSON string to a file
  await fs.promises.writeFile('travelData', data)
    console.log("JSON data is saved.");
}

function loadData(){
  // read JSON object from file
  const data = fs.readFileSync('travelData', 'utf-8')
  // parse JSON object
  const user = JSON.parse(data.toString());

    // print JSON object
    console.log("storage:", user);
  return user;
}

let storage = {
  saveData: saveData,
  loadData: loadData
};


module.exports = storage;
