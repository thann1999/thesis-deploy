const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
  token: {type: String, required: true},
  createdDate: { type: Date, default: Date.now, required: true },
});

module.exports = mongoose.model("RefreshToken", refreshTokenSchema);
