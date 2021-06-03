const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  size: { type: Number, required: true },
  fileType: { type: String, required: true },
  path: { type: String, required: true },
  summary: { type: Object },
  columns: [{ type: Object }],
  description: { type: String },
  createdDate: { type: Date, default: Date.now, required: true },
  lastUpdate: { type: Date, default: Date.now, required: true },
});

module.exports = mongoose.model('File', fileSchema);
