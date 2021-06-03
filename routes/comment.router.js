const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const { auth } = require('../utils/verify-token');
const { ownerComment } = require('../utils/verify-owner');

/* Get all comment in dataset */
router.post('/all', auth, commentController.getAllCommentInDataset);

/* Create new comment */
router.post('/create', auth, commentController.postComment);

/* Like comment */
router.post('/like', auth, commentController.likeOrUnLikeComment);

/* Count all comment in dataset */
router.post('/count', auth, commentController.countAllCommentInDataset);

/* Update comment */
router.post('/update', auth, ownerComment, commentController.updateComment);

/* Delete comment */
router.post('/delete', auth, ownerComment, commentController.deleteComment);

module.exports = router;
