/*
SECURE LOGIN
*/
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const { Data } = require("../models/data");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res, next) => {
  if (!req.body.email || !req.body.password)
    return res.send({
      error: { code: -1, message: "invalid email/password" },
    });

  let user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.send({
      error: { code: -1, message: "invalid email/password" },
    });

  const isValid = await bcrypt.compare(req.body.password, user.password);
  if (!isValid)
    return res.send({
      error: { code: -1, message: "invalid email/password" },
    });

  const data = await Data.find().select("-_id");
  if (data && data.length > 0) {
    const result = {
      user: {
        token: user.generateToken(),
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      data,
    };
    res.send(result);
  } else
    res.send({
      error: { code: 1000, message: "no data" },
    });
});

module.exports = router;
