const express = require('express');
const { auth } = require('../utils/verify-token');
const datasetController = require('../controllers/dataset.controller');
const profileController = require('../controllers/profile.controller');
const router = express.Router();

/* Get all tags */
router.get('/all-tags', auth, datasetController.getAllTags);

/* Get recommend dataset */
router.get('/recommend-list', auth, datasetController.getRecommendList);

/* Get recommend dataset */
router.get('/trending', auth, datasetController.findTrendingDataset);

/* get all recommend list */
router.get('/my-recommend', auth, profileController.getMyRecommend);

module.exports = router;
