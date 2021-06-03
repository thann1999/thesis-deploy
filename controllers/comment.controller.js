const CommentDao = require('../dao/comment.dao');
const Comment = require('../models/comment.model');
const {
  RESPONSE_MESSAGE,
  RESPONSE_STATUS,
} = require('../utils/response-message-status.const');

async function postComment(req, res, next) {
  try {
    const { datasetId, content, parent } = req.body;
    const { id } = req.user;
    const newComment = new Comment({
      datasetId: datasetId,
      commentator: id,
      content: content,
      accountId: id,
      like: [],
      countLike: 0,
    });
    if (parent) newComment.parent = parent;
    let result = await CommentDao.createComment(newComment);
    result = await CommentDao.findOneCommentAndPopulateById(result._id);
    console.log(result);
    res.status(200).json({ data: result[0] });
  } catch (error) {
    next(error);
  }
}

async function getAllCommentInDataset(req, res, next) {
  try {
    const { datasetId } = req.body;
    const result = await CommentDao.getCommentByDatasetId(datasetId);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
}

async function countAllCommentInDataset(req, res, next) {
  try {
    const { datasetId } = req.body;
    const result = await CommentDao.countAllCommentByDatasetId(datasetId);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
}

async function likeOrUnLikeComment(req, res, next) {
  try {
    const { commentId } = req.body;
    const accountId = req.user.id;
    const checkLike = await CommentDao.checkLikeOrNot(commentId, accountId);
    await CommentDao.likeOrUnLike(
      commentId,
      accountId,
      checkLike ? false : true
    );
    res.status(200).json({ message: 'Cập nhật thành công' });
  } catch (error) {
    next(error);
  }
}

async function updateComment(req, res, next) {
  try {
    const { commentId, content } = req.body;
    await CommentDao.updateComment(commentId, content);
    res.status(200).json({ message: 'Cập nhật thành công' });
  } catch (error) {
    next(error);
  }
}

async function deleteComment(req, res, next) {
  try {
    const { commentId } = req.body;
    await CommentDao.deleteComment(commentId);
    res.status(200).json({ message: RESPONSE_MESSAGE.DELETE_SUCCESS });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  postComment: postComment,
  getAllCommentInDataset: getAllCommentInDataset,
  countAllCommentInDataset: countAllCommentInDataset,
  likeOrUnLikeComment: likeOrUnLikeComment,
  updateComment: updateComment,
  deleteComment: deleteComment,
};
