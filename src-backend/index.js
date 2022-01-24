const server = require("./server");
const logger = require("./utils/logger");

/* UNCAUGHT EXCEPTIONS */
process.on("uncaughtException", (error) => {
  console.log("Uncaught", error);
  logger.log("Unkown", error);
});

/* SET VARIABLES */
if (!server.setVariables()) {
  console.log("Error", "Variables not defined");
  logger.log("Variables", "Variables not setted");
  process.exit(1);
}

/* SERVER/DATABASE */
server
  .setDatabase()
  .then(() => {
    server
      .startServer({ protocol: "http" })
      .then((result) => {
        console.log(
          `Success! Server is running: ${result.PROTOCOL}://${result.IP}:${result.PORT}`
        );
        /* IN PRODUCTION IS A GOOD THING TO KNOW WHEN THE SERVICE WAS STARTED */
        // logger.log("MAIN", {
        //   message:
        //     "Server Started (" + new Date() + "), " + JSON.stringify(result),
        // });

        /* DAILY LOCALLY AND DROPBOX BACKUP (CHECKED HOURLY) */
        let lastBackupDay = new Date().getDate();
        setInterval(() => {
          const day = new Date().getDate();
          if (day !== lastBackupDay) {
            const backup = require("./backup");
            backup
              .backupDBLocal()
              .then((file) => {
                /* SET, MAYBE, SOME BACKUP STATUS ON DB TO INFORM ADMIN USERS */
                backup
                  .backupDBCloud(file.path, "BACKUP/" + file.filename)
                  .then((response) => {
                    lastBackupDay = day;
                    // console.log("DROPBOX", response.result);
                  })
                  .catch((error) => {
                    logger.log("Cloud backup", error);
                  });
              })
              .catch((error) => {
                logger.log("Local backup", error);
              });
          }
        }, 60 * 60 * 1000);
      })
      .catch((error) => {
        console.log("Error", "Server not created: " + error.message);
        logger.log("Server", error);
        process.exit(1);
      });
  })
  .catch((error) => {
    console.log("Error", "MongoDB:" + error.message);
    logger.log("Database", error);
    process.exit(1);
  });
