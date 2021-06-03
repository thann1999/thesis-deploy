const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  datasetId: {type: mongoose.Types.ObjectId, required: true, ref: "Dataset", indexes: true},
  commentator: {type: mongoose.Types.ObjectId, required: true, ref: "Account"},
  content: {type: String, required: true},
  like: [{type: mongoose.Types.ObjectId, required: true ,ref: "Account"}],
  countLike: {type: Number, required: true},
  parent: {type: mongoose.Types.ObjectId, ref: "Comment"},
  createdDate: { type: Date, default: Date.now, required: true },
  lastUpdate: {type: Date, default: Date.now, required: true}
});

module.exports = mongoose.model("Comment", commentSchema);
