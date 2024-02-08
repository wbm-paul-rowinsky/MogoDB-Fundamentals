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
    const db = client.db("carstestdb");
    let collection = db.collection("cars");
    const cars = [
      { brand: "Ford", name: "Mustang", year: 1967 },
      { brand: "Dodge", name: "Charger", year: 1971 },
      { brand: "Dodge", name: "Viper", year: 1976 },
    ];
    const result = await collection.insertMany(cars, { ordered: true });
    console.log(`${result.insertedCount} cars were saved. `);
  } catch (error) {
    console.error(error);
  }
}

async function showCars(collection, options = {}, resultsLimit = 5) {
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

async function updateCarsByName(collection, name, updateFields) {
  await collection.updateMany({ name }, { $set: updateFields });
}

async function updateCarByName(collection, name, updateFields) {
  await collection.updateOne({ name }, { $set: updateFields });
}

async function main() {
  let client = null;

  try {
    client = await initDB();
    //await addDataToDB(client);
    const collection = client.db("carstestdb").collection("cars");

    await updateCarsByName(collection, "Mustang", {
      color: "red",
      topSpeed: 290,
    });
    await updateCarByName(collection, "Viper", {
      color: "black",
      topSpeed: 230,
      data: {
        seats: ["seat 1", "seat 2"],
      },
    });

    const cars = await showCars(collection, {}, 10);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

main();
