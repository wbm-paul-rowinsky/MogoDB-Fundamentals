const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;

async function processDB() {
  const url = "mongodb://127.0.0.1:27017";
  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db("trainingDB");
    let collection = db.collection("cars");

    await collection.insertOne({
      brand: "Ford",
      name: "Focus",
      color: "red",
    });
    await collection.insertOne({
      brand: "Ford",
      name: "Fiesta",
      color: "black",
    });

    const cars = [
      { brand: "Hyundai", name: "Pony", color: "yellow" },
      { brand: "Hyundai", name: "eLantra", color: "pink" },
    ];

    const options = { ordered: true };
    const result = await collection.insertMany(cars, options);
    console.log(`${result.insertedCount} cars were saved`);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

processDB();
