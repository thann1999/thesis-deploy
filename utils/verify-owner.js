const AccountDao = require('../dao/account.dao');
const DatasetDao = require('../dao/dataset.dao');
const CommentDao = require('../dao/comment.dao');
const {
  RESPONSE_STATUS,
  RESPONSE_MESSAGE,
} = require('./response-message-status.const');
/*Check owner dataset */
async function ownerDataset(req, res, next) {
  try {
    const { datasetId } = req.body;
    const account = await AccountDao.findAccountById(req.user.id);
    if (!account.datasets.includes(datasetId)) {
      return res
        .status(400)
        .json({ message: 'Không có quyền cập nhật dataset' });
    }
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Request không đúng' });
  }
}

/* Verify owner file */
async function ownerFile(req, res, next) {
  try {
    const { datasetId, fileId } = req.body;
    const account = await AccountDao.findAccountById(req.user.id);
    if (!account.datasets.includes(datasetId)) {
      return res
        .status(400)
        .json({ message: 'Không có quyền cập nhật dataset' });
    }
    const dataset = await DatasetDao.findDatasetById(datasetId);
    if (!dataset[0].files.includes(fileId)) {
      return res.status(400).json({ message: 'Không có quyền cập nhật file' });
    }
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Request không đúng' });
  }
}

/* Verify owner comment */
async function ownerComment(req, res, next) {
  try {
    const { commentId } = req.body;
    const comment = await CommentDao.findCommentById(commentId);
    if (comment.commentator === req.user.id) {
      return res
        .status(RESPONSE_STATUS.FORBIDDEN)
        .json({ message: RESPONSE_MESSAGE.NOT_PERMISSION });
    }
    next();
  } catch (error) {
    return res
      .status(RESPONSE_STATUS.NOT_FOUND)
      .json({ message: RESPONSE_MESSAGE.NOT_FOUND });
  }
}

module.exports = {
  ownerDataset: ownerDataset,
  ownerFile: ownerFile,
  ownerComment: ownerComment,
};
