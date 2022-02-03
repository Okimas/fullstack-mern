/*
ROUTE "api/upload" HANDLER
USER UPLOAD IMAGE(FILE): local(with thumbnail) and dropbox
*/
const fs = require("fs");
const path = require("path");
const imageThumbnail = require("image-thumbnail");
const multer = require("multer");
const express = require("express");
const router = express.Router();
const auth = require("./auth");

const storageImage = multer.diskStorage({
  destination: (req, file, callback) => {
    const folder = path.join(process.env.FRONTEND_FOLDER, "uploads");
    fs.mkdirSync(folder, { recursive: true });
    callback(null, folder);
  },
  filename: (req, file, callback) => {
    const now = new Date();
    const filename =
      now.getUTCFullYear() +
      "." +
      (now.getMonth() + 1).toString().padStart(2, "0") +
      "." +
      now.getDate().toString().padStart(2, "0") +
      "-" +
      now.getTime() +
      "-original." +
      (file.mimetype === "image/png" ? "png" : "jpg");
    callback(null, filename);
  },
});
const uploadFile = multer({ storage: storageImage }).single("file");

router.post("/", auth, (req, res) => {
  uploadFile(req, res, async (err) => {
    if (!req.file)
      return res.send({ error: { code: -1, message: "Erro na requisição" } });

    if (err) {
      console.log(err);
      return res.send({ error: { code: err.code, message: err.message } });
    }

    const fullpath = req.file.path;
    const filename = fullpath.substring(fullpath.lastIndexOf(path.sep) + 1);
    const fullpathThumb = fullpath.replace("-original", "-thumb");
    try {
      const thumbnail = await imageThumbnail(fullpath, {
        width: 128,
        height: 128,
        fit: "inside",
      });
      fs.writeFileSync(fullpathThumb, thumbnail);
    } catch (err) {
      console.log(err);
      return res.send({ error: { code: err.code, message: err.message } });
    }

    require("../backup")
      .backupDBCloud(fullpath, "IMAGES/" + filename)
      .then((response) =>
        res.send({ imagePath: fullpath, thumbPath: fullpathThumb })
      )
      .catch((error) => {
        if (!error) {
          // dropbox could send a empty error
          error = {
            code: -1,
            message: "Dropbox undefined error. Check yoy account and space",
          };
        }
        console.log(error);
        res.send({
          error: { code: error.code, message: error.message },
        });
      });
  });
});

module.exports = router;
