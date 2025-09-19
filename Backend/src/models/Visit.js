const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
  link: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Link",
    required: true,
  },
  at: { type: Date, default: Date.now },
  referer: String,
  ip: String,
  agent: String,
  region: String,
  channel: String,
});

module.exports = mongoose.model("Visit", visitSchema);
