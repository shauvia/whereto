const util = require('util');

const dotenv = require('dotenv');
dotenv.config();


const { MongoClient } = require("mongodb");
// Replace the uri string with your connection string.
const uri = process.env.database_Uri;
console.log("URI: ", uri)

async function saveDataMongo(data) {
  const client = new MongoClient(uri);
  console.log("index.js: I'm in")
  try {
    const database = client.db("wheretoWebsite");
    const users = database.collection("users");

    console.log(`Saving: ${(util.inspect(data, {depth: null}))}`);

    const id = "allUsers";
    data._id = id;
    const filter = {_id : id};

    console.log(`Deleting`);
    await users.deleteOne(filter);
    console.log(`Inserting`);
    const result = await users.insertOne(data);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
    await client.close();
  }
}
// runData().catch(console.dir);


async function loadDatafromMongo() {
  const client = new MongoClient(uri);
  try {
    const database = client.db("wheretoWebsite");
    const users = database.collection("users");
    // Query for a movie that has the title 'The Room'
    const query = { _id: "allUsers" };
    const allRecords = await users.findOne(query);
    // since this method returns the matched document, not a cursor, print it directly
    console.log(`Records has been read with _id: ${allRecords._id}`);
    console.log(`allRecords index.js: allRecords`)
    return allRecords;

    
  } finally {
    await client.close();
  }
}
// run().catch(console.dir);

let storage = {
  saveDataMongo: saveDataMongo,
  loadDatafromMongo: loadDatafromMongo
};

module.exports = storage;