const util = require('util');

const dotenv = require('dotenv');
dotenv.config();

//poszukać co zrobić jak sie baza danych wykrzaczy. Gdzie wsadzić // await client.close(); ?????

const { MongoClient } = require("mongodb");
// Replace the uri string with your connection string.
const uri = process.env.database_Uri;
console.log("URI: ", uri)

const client = new MongoClient(uri);

async function saveDataMongo(data) {
  // const client = new MongoClient(uri);
  console.log("index.js: I'm in")
  try {
    const database = client.db("wheretoWebsite");
    const users = database.collection("users");

    // console.log(`Saving: ${(util.inspect(data, {depth: null}))}`);

    const id = data._id; 
    console.log()
    const filter = {_id : id};

    console.log(`Deleting`);
    await users.deleteOne(filter);
    console.log(`Inserting`);
    const result = await users.insertOne(data);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
    // await client.close();
  }
}
// runData().catch(console.dir);


async function loadDatafromMongo(userId) {
  // const client = new MongoClient(uri);
  try {
    const database = client.db("wheretoWebsite");
    const users = database.collection("users");
   
    const query = {_id : userId};
    const allRecords = await users.findOne(query);
    // console.log(`Records has been read with _id: ${allRecords._id}`);
    return allRecords;

    
  } finally {
    // await client.close();
  }
}


let storage = {
  saveDataMongo: saveDataMongo,
  loadDatafromMongo: loadDatafromMongo
};

module.exports = storage;

// async function  test() {
// const result = await loadDatafromMongo("allUsers");
// console.log("Got", result)
// };
// test();