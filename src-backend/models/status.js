const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema({
  backup: {
    type: {
      local: {
        type: Date,
        required: true,
      },
      cloud: {
        type: Date,
        required: true,
      },
    },
    required: true,
  },
  anything: [mongoose.Schema.Types.Mixed],
});

module.exports.Status = mongoose.model("Status", statusSchema, "status");
