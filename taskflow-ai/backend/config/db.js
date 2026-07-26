const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  try {
    let connUri = process.env.MONGODB_URI;

    if (connUri) {
      try {
        const conn = await mongoose.connect(connUri);
        console.log(`[Database] Connected to MongoDB Atlas / Provided URI: ${conn.connection.host}`);
        return;
      } catch (err) {
        console.warn(`[Database] Could not connect to provided MONGODB_URI (${err.message}). Falling back to MongoMemoryServer...`);
      }
    }

    // Fallback to MongoMemoryServer for instant execution without manual setup
    console.log('[Database] Starting local in-memory MongoDB instance...');
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    console.log(`[Database] In-Memory MongoDB connected successfully at ${mongoUri}`);
  } catch (error) {
    console.error(`[Database Error] ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
