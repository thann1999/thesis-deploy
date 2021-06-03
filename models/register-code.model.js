const mongoose = require("mongoose");

const codeSchema = new mongoose.Schema({
  code: { type: String, required: true },
  accountId: { type: mongoose.Types.ObjectId, required: true },
  isAlreadyUse: { type: Boolean, default: false, required: true },
  createdDate: { type: Date, default: Date.now, required: true },
});

module.exports = mongoose.model("RegisterCode", codeSchema);
