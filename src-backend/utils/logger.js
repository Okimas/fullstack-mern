const fs = require("fs");
const path = require("path");

const log = (location, error) => {
  const d = new Date();
  const file = path.join(
    __dirname,
    "..",
    "..",
    "log",
    d.getFullYear() +
      (d.getMonth() + 1).toString().padStart(2, "0") +
      d.getDate().toString().padStart(2, "0") +
      ".txt"
  );

  const line =
    "[" +
    d.getFullYear() +
    "/" +
    (d.getMonth() + 1).toString().padStart(2, "0") +
    "/" +
    d.getDate().toString().padStart(2, "0") +
    " " +
    d.getHours().toString().padStart(2, "0") +
    ":" +
    d.getMinutes().toString().padStart(2, "0") +
    '] "' +
    location +
    '" => ' +
    error.message +
    "\n";

  fs.access(file, (err) => {
    if (!err) {
      fs.appendFile(file, line, (err) => {
        if (err)
          throw new Error("LOGGING: " + error.message + " : " + err.message);
      });
      return;
    }
    fs.writeFile(file, line, (err, data) => {
      if (err)
        throw new Error("LOGGING: " + error.message + " : " + err.message);
    });
  });
};

module.exports = {
  log,
};
