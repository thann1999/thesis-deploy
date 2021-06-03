const mongoose = require('mongoose');

const datasetSchema = new mongoose.Schema({
  thumbnail: { type: String },
  title: { type: String, required: true },
  owner: { type: mongoose.Types.ObjectId, required: true, ref: 'Account' },
  subtitle: { type: String },
  description: { type: String },
  tags: { type: Array },
  like: [{ type: mongoose.Types.ObjectId, required: true }],
  countLike: { type: Number },
  url: { type: String, required: true },
  visibility: { type: Number, enum: [0, 1], required: true },
  path: { type: String, required: true },
  banner: { type: String },
  size: { type: Number, required: true },
  fileTypes: { type: Array },
  summary: { type: Object },
  views: { type: Number },
  downloads: { type: Number },
  files: [{ type: mongoose.Types.ObjectId, ref: 'File' }],
  versions: [
    {
      version: { type: String, required: true },
      fileChanges: [
        {
          fileName: { type: String, required: true },
          status: { type: Number, required: true },
          changeDetails: { type: Object },
        },
      ],
      createdDate: { type: Date, default: Date.now, required: true },
    },
  ],
  createdDate: { type: Date, default: Date.now, required: true },
  lastUpdate: { type: Date, default: Date.now, required: true },
});

datasetSchema.index({ owner: 1, url: 1, like: -1 });

module.exports = mongoose.model('Dataset', datasetSchema);
