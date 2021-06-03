const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  email: { type: String, required: true },
  username: {
    type: String,
    required: true,
  },
  password: { type: String },
  name: { type: String, required: true },
  avatar: { type: String },
  bio: { type: String },
  company: { type: String },
  location: { type: String },
  accountMode: { type: Number, default: 1, required: true },
  dateOfBirth: { type: Date },
  website: { type: String },
  github: { type: String },
  createdDate: { type: Date, default: Date.now, required: true },
  lastUpdate: { type: Date, default: Date.now(), required: true },
  role: { type: String, required: true },
  isVerify: { type: Boolean, default: false, required: true },
  recommend: { type: Array },
  datasets: [{ type: mongoose.Types.ObjectId, ref: 'Dataset' }],
});

module.exports = mongoose.model('Account', accountSchema);
