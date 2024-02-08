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

async function findCars(client, brand, resultsLimit) {
  try {
    const data = client
      .db("trainingDB")
      .collection("cars")
      .find({ brand })
      .limit(resultsLimit);

    const results = await data.toArray();
    if (results.length > 0) {
      console.log(`Found ${results.length} data: `);
      results.forEach((result, i) => {
        console.log(result);
      });
      return results;
    } else {
      console.log("DB not found...");
      return null;
    }
  } catch (err) {
    console.error(err);
  }
}

async function main() {
  let client = null;

  try {
    client = await initDB();
    const students = await findCars(client, "Hyundai", 5);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

main();
