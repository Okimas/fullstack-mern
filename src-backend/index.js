const { getLocalIP } = require("./utils/utils");

// VARIABLES
require("dotenv").config();
const variablesOK =
  process.env.NODE_ENV &&
  (process.env.PORT || process.env.SERVER_PORT) &&
  process.env.DATABASE_URL;
if (!variablesOK) {
  console.log("Error", "Variables not defined");
  process.exit(1);
}

// ROUTERS AND SERVER
startServer = () => {
  const express = require("express");
  const app = express();
  app.use(express.json());
  app.use(express.static("build"));
  app.use("/api/login", require("./apis/login"));
  app.use("/api/data", require("./apis/data"));
  app.use("/api/info", require("./apis/info"));

  const PORT = process.env.PORT || process.env.SERVER_PORT;
  require("http")
    .createServer(app)
    .listen(PORT, () => {
      console.log("> SERVER IS RUNNING: http://" + getLocalIP() + ":" + PORT);
    });
};

// MONGO DATABASE
require("mongoose")
  .connect(process.env.DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    startServer();
  })
  .catch((error) => {
    console.log("Error", "MongoDB:" + error.message);
    process.exit(1);
  });
