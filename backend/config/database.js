import mongoose from "mongoose";
import neo4j from "neo4j-driver";
import { config } from "./env.js";

const connectDatabse = async () => {
  try {
    const { connection } = await mongoose.connect(config.mongoUri, {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 30000, // Keep trying to send operations for 30 seconds
      socketTimeoutMS: 30000, // Close sockets after 30 seconds of inactivity
    });
    console.log(`MongoDB connected: ${connection.host}/${connection.name}`);
  } catch (error) {
    console.log("mongodb connection error:", error.message);
    process.exit(1);
  }
};

const connectGraphDB = async () => {
  let driver;
  try {
    driver = neo4j.driver(
      config.neo4j.uri,
      neo4j.auth.basic(config.neo4j.user, config.neo4j.password)
    );
    const serverInfo = await driver.getServerInfo();
    console.log("connection established with neo4j database");
    console.log(serverInfo);
    return driver;
  } catch (error) {
    console.log(`connection error\n${error}\nCause: ${error.cause}`);
    await driver?.close();
  }
};

export { connectDatabse, connectGraphDB };