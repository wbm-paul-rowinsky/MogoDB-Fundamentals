const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;

async function processDB() {
  const url = "mongodb://127.0.0.1:27017";
  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db("schooldbtest");
    let collection = db.collection("students");

    await collection.insertOne({ name: "Asia", email: "asia@gm.pl" });
    await collection.insertOne({ name: "Janusz", email: "janusz@gm.pl" });

    const students = [
      { name: "Kasia", email: "kasia@gm.pl" },
      { name: "Tomek", email: "tomek@gm.pl" },
      { name: "Daniel", email: "daniel@gm.pl" },
    ];

    const options = { ordered: true };
    const result = await collection.insertMany(students, options);
    console.log(`${result.insertedCount} students were saved`);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

processDB();
