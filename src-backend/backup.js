require("isomorphic-fetch");
const Dropbox = require("dropbox").Dropbox;
const dbx = new Dropbox({ accessToken: process.env.DROPBOX_TOKEN });

const backupDBLocal = () => {
  return new Promise((resolve, reject) => {
    const path = require("path");
    const backup = require("mongodb-backup");
    const now = new Date();
    const fileName =
      now.getUTCFullYear() +
      "." +
      (now.getMonth() + 1).toString().padStart(2, "0") +
      "." +
      now.getDate().toString().padStart(2, "0") +
      ".tar";
    backup({
      uri: process.env.MONGO_URL,
      root: path.join(__dirname, "..", "backup"),
      collections: ["status", "users", "data"],
      tar: fileName,
      callback: (error) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            path: path.join(__dirname, "..", "backup", fileName),
            filename: fileName,
          });
        }
      },
    });
  });
};

const backupDBCloud = (source, target) => {
  return new Promise((resolve, reject) => {
    dbx
      .filesUpload({
        contents: require("fs").createReadStream(source),
        path: "/" + target,
        mode: { ".tag": "add" },
        autorename: false,
        mute: false,
        strict_conflict: false,
      })
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

module.exports = {
  backupDBLocal,
  backupDBCloud,
};
