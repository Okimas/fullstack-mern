const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("mongoose-type-email");

mongoose.SchemaTypes.Email.defaults.message = "Email inválido";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  email: {
    type: mongoose.SchemaTypes.Email,
    required: true,
    unique: true,
  },
  password: { type: String, required: true, minlength: 5, maxlength: 1024 },
});

userSchema.methods.generateToken = function () {
  const EXPIRES_MILLI = 3600000;
  const user = {
    _id: this._id,
    name: this.name,
    email: this.email,
    expires: new Date().getTime() + EXPIRES_MILLI,
  };
  return jwt.sign(user, process.env.APP_KEY);
};

module.exports.User = mongoose.model("User", userSchema, "users");
