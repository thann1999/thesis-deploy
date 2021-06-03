const mongoose = require('mongoose');

const TagsSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  accountId: { type: mongoose.Types.ObjectId, ref: 'Account' },
  datasetsLength: { type: Number, required: true },
  description: { type: String },
  datasets: [{ type: mongoose.Types.ObjectId, ref: 'Dataset' }],
  followers: [{ type: mongoose.Types.ObjectId, ref: 'Account' }],
  followersLength: { type: Number },
  createdDate: { type: String, required: true, default: Date.now() },
});

module.exports = mongoose.model('Tag', TagsSchema);
