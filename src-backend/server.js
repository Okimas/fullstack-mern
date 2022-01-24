const getLocalIP = () => {
  const networkInterfaces = require("os").networkInterfaces();
  for (const key of Object.keys(networkInterfaces)) {
    const arr = networkInterfaces[key];
    for (const item of arr) {
      if (
        "family" in item &&
        item.family === "IPv4" &&
        !item.address.startsWith("127")
      ) {
        return item.address;
      }
    }
  }
  return null;
};

const setVariables = () => {
  require("dotenv").config();
  return (
    process.env.APP_KEY &&
    process.env.MONGO_URL &&
    process.env.EMAIL_ADDRESS &&
    process.env.EMAIL_PASSWWORD &&
    process.env.DROPBOX_TOKEN &&
    process.env.FRONTEND_FOLDER &&
    (process.env.PORT || process.env.SERVER_PORT)
  );
};

const setDatabase = () => {
  return new Promise((resolve, reject) => {
    require("mongoose")
      .connect(process.env.MONGO_URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      })
      .then(() => {
        resolve(true);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const startServer = (options) => {
  return new Promise((resolve, reject) => {
    const express = require("express");
    const app = express();
    if (options.protocol === "https") app.use(require("cors")());
    app.use(express.json());
    app.use(express.static(process.env.FRONTEND_FOLDER));
    app.use("/api/login", require("./apis/login"));
    app.use("/api/data", require("./apis/data"));
    app.use("/api/email", require("./apis/email"));
    app.use("/api/upload", require("./apis/upload"));
    app.use("/api/status", require("./apis/status"));
    app.use("/api/info", require("./apis/info"));

    const PORT = process.env.PORT || process.env.SERVER_PORT;
    const server = require(options.protocol).createServer(
      options.protocol === "https"
        ? {
            key: fs.readFileSync(options.certificateKey),
            cert: fs.readFileSync(options.certificateFile),
          }
        : null,
      app
    );
    server.listen(PORT, () => {
      resolve({ PROTOCOL: options.protocol, IP: getLocalIP(), PORT });
    });
    server.on("error", (error) => {
      reject(error);
    });
  });
};

module.exports = {
  getLocalIP,
  setVariables,
  setDatabase,
  startServer,
};
