/*
EMAIL SENDER
*/
const express = require("express");
const router = express.Router();
const auth = require("./auth");
var nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false,
  },
});

router.post("/", auth, async (req, res) => {
  if (!req.body.email || !req.body.message)
    return res.send({ error: { code: -1, message: "Erro na requisição" } });

  try {
    const html = require("fs").readFileSync(
      require("path").join(__dirname, "..", "htmlTemplates", "email.html"),
      { encoding: "utf-8" }
    );

    transporter.sendMail(
      {
        subject: req.body.subject ? req.body.subject : "NO SUBJECT",
        from: process.env.EMAIL_ADDRESS,
        to: req.body.email,
        html: html
          .replace(
            "XXXXXXXXXX",
            req.body.subject ? req.body.subject : "NO SUBJECT"
          )
          .replace("YYYYYYYYYY", req.body.message),
      },
      (error, info) => {
        if (error)
          return res.send({ error: { code: -1, message: error.message } });
        res.send("OK");
      }
    );
  } catch (error) {
    res.send({ error: { code: -1, message: error.message } });
  }
});

module.exports = router;
