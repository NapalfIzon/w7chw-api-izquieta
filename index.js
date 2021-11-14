require("dotenv").config();
const initializeMongoDb = require("./database");
const { initializeServer } = require("./server");

const port = process.env.PORT || process.env.LOCAL_PORT || 8000;

(async () => {
  await initializeServer(port);
  await initializeMongoDb(process.env.MONGODB_STRING);
})();
