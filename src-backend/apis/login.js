const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const { Data } = require("../models/data");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res, next) => {
  if (!req.body.email || !req.body.password)
    return res.send({
      error: { code: -1, message: "Email e/ou Senha invalidos" },
    });

  let user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.send({
      error: { code: -1, message: "Email e/ou Senha invalidos" },
    });

  const isValid = await bcrypt.compare(req.body.password, user.password);
  if (!isValid)
    return res.send({
      error: { code: -1, message: "Email e/ou Senha invalidos" },
    });

  const data = await Data.find().select("-_id");
  if (data) {
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
    return res.send({
      error: { code: -1, message: "Dados não encontrados" },
    });
});

module.exports = router;
