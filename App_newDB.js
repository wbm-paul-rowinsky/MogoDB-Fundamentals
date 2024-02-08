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

const names = [
  "Danuta",
  "Lena",
  "Kasia",
  "Iwona",
  "Dorota",
  "Magdalena",
  "Grazyna",
  "Genowefa",
  "Maja",
];
const surnames = ["Kowalska", "Nowak", "Dyduch", "Kwiecińska"];
const cities = ["Lublin", "Warszawa", "Kraków", "Łęczna", "Świdnik", "Wrocław"];

function generateRandomStudents(names, surnames, cities) {
  const student = {
    name: `${names[Math.floor(Math.random() * names.length)]}`,
    surname: `${surnames[Math.floor(Math.random() * surnames.length)]}`,
    age: Math.floor(Math.random() * 32) + 18,
    city: `${cities[Math.floor(Math.random() * cities.length)]}`,
  };
  return student;
}

async function checkIfCollectionsExists(client) {
  const collectionName = "students";
  const exists =
    (await (
      await client.db("trainingDB").listCollections().toArray()
    ).findIndex((item) => item.name === collectionName)) !== -1;
  return exists;
}

async function createStudentsCollection(client) {
  let exists = await checkIfCollectionsExists(client);
  let collection;
  if (!exists) {
    collection = await client.db("trainingDB").collection("students");
    console.log("Collection created");
  } else {
    console.log("Collection already exists");
    collection = await client.db("trainingDB").collection("students");
  }
  return collection;
}
async function checkStudentsExists(collection, options = {}) {
  try {
    let cursor = collection.find(options);
    let results = await cursor.toArray();
    if (results.length < 50) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.error(error);
  }
}

async function addStudents(client) {
  try {
    const db = client.db("trainingDB");
    let collection = db.collection("students");
    if (!(await checkStudentsExists(collection))) {
      let studentsArr = [];
      for (let i = 0; i < 10; i++)
        studentsArr.push(generateRandomStudents(names, surnames, cities));
      const result = await collection.insertMany(studentsArr, {
        ordered: true,
      });
      console.log(`${result.insertedCount} students were added. `);
    } else {
      console.log("Students was already added");
    }
  } catch (error) {
    console.error(error);
  }
}

async function getStudents(collection, options = {}, resultsLimit = 100) {
  try {
    let cursor = collection.find(options).limit(resultsLimit);
    let results = await cursor.toArray();
    if (results.length > 0) {
      console.log(`Found ${results.length} listing(s): `);
      results.forEach((result, i) => {
        console.log(result);
      });
      return results;
    } else {
      console.log("I can't find any Students");
      result = null;
      return result;
    }
  } catch (error) {
    console.error(error);
  }
  return null;
}

async function updateStudents(collection, name, updateFields) {
  await collection.updateMany({ name }, { $set: updateFields });
}

async function updateStudent(collection, name, updateFields) {
  await collection.updateOne({ name }, { $set: updateFields });
}

async function deleteStudents(collection, name) {
  return await collection.deleteMany({ city: name });
}

async function main() {
  let client = null;

  try {
    client = await initDB();
    await addStudents(client);
    const collection = await createStudentsCollection(client);
    await updateStudent(collection, "Kasia", {
      name: "Katarzyna",
    });
    await updateStudents(collection, "Maja", {
      color: "silver",
      screenSize: 6,
      data: {
        apps: ["chrome", "maps", "safari"],
      },
    });
    let result = await deleteStudents(collection, "London");
    console.log(result);
    console.log(`Deleted ${result.deletedCount} student(s)`);
    const students = await getStudents(collection, { age: { $gt: 0 } }, 100);
  } catch (error) {
    console.error(error);
  } finally {
    if (client) await client.close();
  }
}

main();
