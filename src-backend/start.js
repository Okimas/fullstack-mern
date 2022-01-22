module.exports = {
  start: () => {
    return new Promise((resolve, reject) => {
      require("dotenv").config();
      const variablesOK =
        process.env.NODE_ENV &&
        (process.env.PORT || process.env.SERVER_PORT) &&
        process.env.DATABASE_URL;
      if (!variablesOK) return reject(new Error("Error: Missing vaiables"));

      require("mongoose")
        .connect(process.env.DATABASE_URL, {
          useUnifiedTopology: true,
          useNewUrlParser: true,
        })
        .then(() => {
          const http = require("http");
          const express = require("express");
          const app = express();
          app.use(express.json());
          app.use(express.static("build"));
          app.use("/api/login", require("./apis/login"));
          app.use("/api/data", require("./apis/data"));

          const PORT = process.env.PORT || process.env.SERVER_PORT;
          http.createServer(app).listen(PORT, () => {
            resolve(true);
          });
        })
        .catch((error) => {
          reject(new Error(error.message));
        });
    });
  },
};
