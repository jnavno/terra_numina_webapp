const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URI_PROD || "mongodb://localhost:27017/knowledge-platform";

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
