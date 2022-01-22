const mongoose = require("mongoose");
require("mongoose-type-url");

const dataSchema = new mongoose.Schema({
  theme: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 6,
  },
  language: {
    type: {
      code: String,
      name: String,
    },
    required: true,
  },
  profile: {
    type: {
      name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255,
      },
      role: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255,
      },
      image: {
        type: mongoose.SchemaTypes.Url,
        required: false,
      },
    },
    required: true,
  },
  script: [mongoose.Schema.Types.Mixed],
});

module.exports.Data = mongoose.model("Data", dataSchema, "data");
