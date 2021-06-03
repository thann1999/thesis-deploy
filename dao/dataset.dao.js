const BaseDao = require('./base.dao');
const AccountDao = require('./account.dao');
const mongoose = require('mongoose');
const Dataset = require('../models/dataset.model');

class DatasetDao extends BaseDao {
  accountPopulate = 'owner';
  filesPopulate = 'files';

  /*Create dataset */
  insertDataset = async (dataset = new Dataset()) => {
    return await super.insertOne(dataset);
  };

  /* Find all file info of dataset */
  findAllFilesOfDataset = async (datasetId) => {
    const query = {
      _id: datasetId,
    };
    return await super.findOneAndPopulate(
      Dataset,
      query,
      {},
      this.filesPopulate,
      {},
      {}
    );
  };

  /* Find dataset and account info */
  findDatasetAndAccountInfo = async (url) => {
    const select = '_id name username avatar email';
    const query = {
      url: url,
    };
    return await super.findOneAndPopulate(
      Dataset,
      query,
      {},
      this.accountPopulate,
      {},
      select
    );
  };

  /* Find one dataset by id */
  findDatasetById = async (datasetId) => {
    const query = {
      _id: datasetId,
    };
    return await super.findOne(Dataset, query);
  };

  /* Find many dataset by id */
  findDatasetById = async (datasetIds) => {
    const query = {
      _id: { $in: datasetIds },
    };
    return await super.find(Dataset, query);
  };

  /*update description dataset */
  updateDescription = async (datasetId, description) => {
    const query = {
      _id: datasetId,
    };
    const update = {
      description: description,
    };
    return await super.updateOne(Dataset, query, update);
  };

  /*update visibility dataset */
  updateVisibility = async (datasetId, visibility) => {
    const query = {
      _id: datasetId,
    };
    const update = {
      visibility: visibility,
    };
    return await super.updateOne(Dataset, query, update);
  };

  /* update title and subtitle dataset */
  updateTitleAndSubtitle = async (datasetId, title, subtitle) => {
    const query = {
      _id: datasetId,
    };
    const update = {
      title: title,
      subtitle: subtitle,
      lastUpdate: Date.now(),
    };
    return await super.updateOne(Dataset, query, update);
  };

  /* update title and subtitle dataset */
  updateBanner = async (datasetId, banner) => {
    const query = {
      _id: datasetId,
    };
    const update = {
      banner: banner,
      lastUpdate: Date.now(),
    };
    return await super.updateOne(Dataset, query, update);
  };

  /* update title and subtitle dataset */
  updateThumbnail = async (datasetId, thumbnail) => {
    const query = {
      _id: datasetId,
    };
    const update = {
      thumbnail: thumbnail,
      lastUpdate: Date.now(),
    };
    return await super.updateOne(Dataset, query, update);
  };

  /* update title and subtitle dataset */
  updateTags = async (datasetId, tags) => {
    const query = {
      _id: datasetId,
    };
    const update = {
      tags: tags,
      lastUpdate: Date.now(),
    };
    return await super.updateOne(Dataset, query, update);
  };

  /* find dataset default sort by like */
  findDatasetSortByLike = async (
    title,
    tags,
    fileType,
    minSize,
    maxSize,
    like,
    date,
    limit,
    skip
  ) => {
    const query = super.createQuery(title, fileType, minSize, maxSize);
    if (tags) {
      const stringTags = tags.map((objectName) => objectName.name);
      query['tags.name'] = { $in: stringTags };
    }
    const sort = like && like === 'desc' ? { countLike: -1 } : { countLike: 1 };
    const select = `thumbnail banner title subtitle countLike downloads views 
      createdDate lastUpdate size fileTypes url like files`;
    const populateSelect = `_id name username avatar email`;

    return await super.findSortLimitSkipAndPopulate(
      Dataset,
      query,
      sort,
      limit,
      skip,
      select,
      this.accountPopulate,
      populateSelect
    );
  };

  /* Count datasets by query*/
  countDatasets = async (title, tags, fileType, minSize, maxSize, date) => {
    const query = super.createQuery(title, fileType, minSize, maxSize);
    if (tags) {
      const stringTags = tags.map((objectName) => objectName.name);
      query['tags.name'] = { $in: stringTags };
    }

    return await super.countDocuments(Dataset, query);
  };

  /* Check user like or not */
  checkLikeOrNot = async (datasetId, accountId) => {
    console.log(accountId);
    const query = { _id: datasetId, like: accountId };
    return await super.findOne(Dataset, query);
  };

  /* Like or unlike dataset */
  likeOrUnLike = async (datasetId, accountId, like) => {
    const query = { _id: datasetId };
    const update = like
      ? {
          $push: { like: accountId },
          $inc: { countLike: 1 },
        }
      : {
          $pull: { like: accountId },
          $inc: { countLike: -1 },
        };

    return await super.updateOne(Dataset, query, update);
  };

  updateFileIdInDataset = async (datasetId, fileId, isDelete) => {
    const query = { _id: datasetId };
    const update = isDelete
      ? { $pullAll: { files: fileId } }
      : { $push: { files: { $each: fileId } } };

    return await super.updateOne(Dataset, query, update);
  };

  createNewVersionDataset = async (datasetId, version, size) => {
    const query = { _id: datasetId };
    const update = {
      size: size,
      $push: {
        versions: {
          $each: [version],
          $sort: { createdDate: -1 },
        },
      },
      lastUpdate: Date.now(),
    };

    return await super.updateOne(Dataset, query, update);
  };

  deleteDatasetById = async (datasetId) => {
    const query = { _id: datasetId };
    return await super.deleteOne(Dataset, query);
  };

  increaseViewDownloadDataset = async (datasetId, isView) => {
    const query = { _id: datasetId };
    const update = isView
      ? {
          $inc: { views: 1 },
        }
      : {
          $inc: { downloads: 1 },
        };

    return await super.updateOne(Dataset, query, update);
  };
}

const instance = new DatasetDao();
module.exports = instance;
