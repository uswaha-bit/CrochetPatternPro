import { config } from "./config/env.js";
import { app, httpServer } from "./app.js";
import { connectDatabse, connectGraphDB } from "./config/database.js";
import { initializePostCache } from "./utils/userInteractedPosts.js";

process.on("uncaughtException", (error) => {
  console.log(`uncaught exception due to error ${error}`);
  process.exit(1);
});

//connecting to db
await connectDatabse();
// connectGraphDB();

const cacheInitialized = await initializePostCache();

if (cacheInitialized) {
  console.log("✅ Cache initialized successfully");
} else {
  console.log(cacheInitialized);
  console.log("⚠️ Cache initialization failed - continuing without cache");
}

const server = httpServer.listen(config.port, "0.0.0.0", () => {
 console.log(`server started in port ${config.port} in ${config.env} mode`);
});

process.on("unhandledRejection", (error) => {
  console.log(`ERROR: ${error.message}`);
  console.log("shutting down server due to unhandled promise rejection");
  server.close(() => {
    process.exit(1);
  });
});
