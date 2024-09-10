const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://subsjnn:<db_password>@dev-cluster.fj1uv.mongodb.net/?retryWrites=true&w=majority&appName=dev-cluster";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB!");
    return client.db("dev-cluster");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

module.exports = connectToMongoDB;
