const express = require('express');
const { auth } = require('../utils/verify-token');
const profileController = require('../controllers/profile.controller');
const util = require('util');
const multer = require('multer');
const uploadImage = require('../models/image-storage');
const router = express.Router();

/*Get info profile with filter dataset */
router.post(
  '/filter-dataset',
  auth,
  profileController.filterDatasetInOneAccount
);

/* Update profile */
router.post('/update-info', auth, profileController.updateProfile);

/* Update account mode is private or public */
router.get('/update-mode/:mode', auth, profileController.changeAccountMode);

/* Update profile */
router.post(
  '/update-avatar',
  auth,
  async (req, res, next) => {
    try {
      const upload = util.promisify(uploadImage);
      await upload(req, res);
      next();
    } catch (error) {
      if (error instanceof multer.MulterError || error) {
        // A Multer error occurred when uploading.
        return res.status(400).json({ message: error.message });
      }
    }
  },
  profileController.updateAvatar
);

/* delete account */
router.get('/delete', auth, profileController.deleteAccount);

/* Update recommend tags for account */
router.post('/update-recommend', auth, profileController.updateRecommend);

/*Get info profile */
router.get('/:username', auth, profileController.getProfile);

module.exports = router;
