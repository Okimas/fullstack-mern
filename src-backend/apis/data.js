const express = require("express");
const router = express.Router();
const { Data } = require("../models/data");
const auth = require("./auth");

router.post("/", auth, async (req, res) => {
  const data = await Data.find().select("-_id");
  if (data && data.length > 0) {
    res.send(data);
  } else
    res.send({
      error: { code: -1, message: "Dados não encontrados" },
    });
});

module.exports = router;
