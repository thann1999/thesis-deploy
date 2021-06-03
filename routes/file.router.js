const express = require('express');
const router = express.Router();
const { auth } = require('../utils/verify-token');
const { ownerFile } = require('../utils/verify-owner');
const fileController = require('../controllers/file.controller');

/* Get all file in dataset */
router.post('/all', auth, fileController.getAllFilesInDataset);

/* Get one file in dataset by path */
router.post('/content', auth, fileController.getFileContentByPath);

/* Update file columns in dataset */
router.post('/update/columns', auth, ownerFile, fileController.updateColumns);

/* Update file description in dataset */
router.post(
  '/update/description',
  auth,
  ownerFile,
  fileController.updateDescription
);

/* Download file in dataset */
router.post('/download', auth, fileController.downloadFile);

module.exports = router;
