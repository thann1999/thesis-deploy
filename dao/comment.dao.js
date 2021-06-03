const BaseDao = require('./base.dao');
const Comment = require('../models/comment.model');

class CommentDao extends BaseDao {
  accountPopulate = 'commentator';
  commentPopulate = 'parent';
  /* Create new comment */
  async createComment(comment = new Comment()) {
    return await super.insertOne(comment);
  }

  async findCommentById(commentId) {
    const query = {
      _id: commentId,
    };
    return await super.findOne(Comment, query);
  }

  async findOneCommentAndPopulateById(commentId) {
    const query = {
      _id: commentId,
    };
    const select = '_id name username avatar email';
    return await super.findAndMultiplePopulate(
      Comment,
      query,
      this.accountPopulate,
      {},
      select,
      this.commentPopulate,
      {},
      {},
      this.accountPopulate,
      select
    );
  }

  async getCommentByDatasetId(datasetId) {
    const query = {
      datasetId: datasetId,
    };
    const select = '_id name username avatar email';
    return await super.findAndMultiplePopulate(
      Comment,
      query,
      this.accountPopulate,
      {},
      select,
      this.commentPopulate,
      {},
      {},
      this.accountPopulate,
      select
    );
  }

  async countAllCommentByDatasetId(datasetId) {
    const query = {
      datasetId: datasetId,
    };
    return super.countDocuments(Comment, query);
  }

  /* Check user like or not */
  async checkLikeOrNot(commentId, accountId) {
    const query = { _id: commentId, like: [accountId] };
    return await super.findOne(Comment, query);
  }

  /* Like or unlike dataset */
  async likeOrUnLike(commentId, accountId, like) {
    const query = { _id: commentId };
    let update;
    if (like) {
      update = {
        $push: { like: accountId },
        $inc: { countLike: 1 },
      };
    } else {
      update = {
        $pull: { like: accountId },
        $inc: { countLike: -1 },
      };
    }
    return await super.updateOne(Comment, query, update);
  }

  /* Update comment */
  async updateComment(commentId, content) {
    const query = {
      _id: commentId,
    };
    const update = {
      content: content,
      lastUpdate: Date.now(),
    };

    return await super.updateOne(Comment, query, update);
  }

  /* Delete comment */
  async deleteComment(commentId, content) {
    const query = {
      _id: commentId,
    };

    return await super.deleteOne(Comment, query);
  }

  async deleteAllCommentInDataset(datasetId) {
    const query = {
      datasetId: datasetId,
    };

    return await super.deleteMany(Comment, query);
  }
}

const instance = new CommentDao();
module.exports = instance;
