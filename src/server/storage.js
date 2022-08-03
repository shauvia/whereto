const fs = require('fs');



async function saveData(filename, input){
  const data = JSON.stringify(input);

  // write JSON string to a file
  await fs.promises.writeFile(filename, data)
    console.log("JSON data is saved.");
}

function loadData(filename){
  // read JSON object from file
  const data = fs.readFileSync(filename, 'utf-8')
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
