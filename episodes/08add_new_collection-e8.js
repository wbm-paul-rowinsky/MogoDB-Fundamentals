const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;

async function initDB() {
  const url = "mongodb://127.0.0.1:27017";
  let client = null;

  try {
    client = await new MongoClient(url);
    return client;
  } catch (error) {
    console.error(error);
  }
}
async function addDataToDB(client) {
  try {
    const db = client.db("trainingDB");
    let collection = db.collection("smartphones");
    const phones = [
      { brand: "Apple", name: "iPhone", color: "red" },
      { brand: "Apple", name: "iPhone", color: "white" },
      { brand: "Apple", name: "iPhone", color: "black" },
      { brand: "Apple", name: "iPhone", color: "green" },
    ];
    const result = await collection.insertMany(phones, { ordered: true });
    console.log(`${result.insertedCount} smartphones were added. `);
  } catch (error) {
    console.error(error);
  }
}

async function showSmartphones(collection, options = {}, resultsLimit = 10) {
  try {
    let cursor = collection.find(options).limit(resultsLimit);
    let results = await cursor.toArray();
    if (results.length > 0) {
      console.log(`Found ${results.length} listing(s): `);
      results.forEach((result, i) => {
        console.log(result);
      });
      return results;
    }
  } catch (error) {
    console.error(error);
  }
  return null;
}

async function updateSmartphonesByName(collection, name, updateFields) {
  await collection.updateMany({ name }, { $set: updateFields });
}

async function updateSmartphoneByName(collection, name, updateFields) {
  await collection.updateOne({ name }, { $set: updateFields });
}

async function main() {
  let client = null;

  try {
    client = await initDB();
    //await addDataToDB(client);
    const collection = client.db("trainingDB").collection("smartphones");

    await updateSmartphonesByName(collection, "iPhone", {
      model: "max",
    });
    await updateSmartphoneByName(collection, "iPhone", {
      color: "silver",
      screenSize: 6,
      data: {
        apps: ["chrome", "maps", "safari"],
      },
    });

    const phones = await showSmartphones(collection, {}, 10);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

main();
