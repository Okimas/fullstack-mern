const express = require("express");
const router = express.Router();
const { Status } = require("../models/status");
const auth = require("./auth");

router.post("/", auth, async (req, res) => {
  const status = await Status.find().select("-_id");
  if (status && status.length > 0) {
    res.send(status[0]);
  } else
    res.send({
      error: { code: -1, message: "Status inacessível" },
    });
});

module.exports = router;
