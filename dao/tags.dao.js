const BaseDao = require('./base.dao');
const Tags = require('../models/tags.model');

class TagsDao extends BaseDao {
  datasetsPopulate = 'datasets';
  accountPopulate = 'owner';

  /*Create tags */
  insertMultipleTags = async (tags) => {
    return await super.insertMany(Tags, tags);
  };

  /* Find one dataset by id */
  findTagByName = async (tags) => {
    const query = {
      name: tags,
    };
    return await super.findOne(Tags, query);
  };

  /* Find tags in array name */
  findTagInArrayName = async (arrName = []) => {
    const stringTags = arrName.map((objectName) => objectName.name);
    const query = {
      name: { $in: stringTags },
    };
    return await super.find(Tags, query);
  };

  /* Find all tags */
  findAllTags = async () => {
    const query = {};
    return await super.find(Tags, query);
  };

  /* Push dataset id to datasets field */
  pushDatasetOrAccountInTags = async (data, arrName = [], type) => {
    const stringTags = arrName.map((objectName) => objectName.name);
    const query = {
      name: { $in: stringTags },
    };

    //1: dataset, 2: followers
    const update =
      type === 1
        ? {
            $push: { datasets: data },
            $inc: { datasetsLength: 1 },
          }
        : {
            $push: { followers: data },
            $inc: { followersLength: 1 },
          };

    return await super.updateMany(Tags, query, update);
  };

  /* Remove dataset id from datasets field */
  removeDatasetOrFollowerInTags = async (data, arrName = [], type) => {
    const stringName = arrName.map((objectName) => objectName.name);
    const query = {
      name: { $in: stringName },
    };

    //1: dataset, 2: followers
    const update =
      type === 1
        ? {
            $pull: { datasets: data },
            $inc: { datasetsLength: -1 },
          }
        : {
            $pull: { followers: data },
            $inc: { followersLength: -1 },
          };

    return await super.updateMany(Tags, query, update);
  };

  /* Find 5 tags have largest dataset and info of 4 dataset most like */
  find5LargestTags = async () => {
    const sort = {
      datasetsLength: -1,
    };
    const select = '_id name username avatar email';
    const nestedSort = {
      countLike: -1,
    };
    return await super.findSortLimitPopulateAndNestedQuery(
      Tags,
      {},
      sort,
      5,
      this.datasetsPopulate,
      nestedSort,
      4,
      0,
      this.accountPopulate,
      select
    );
  };

  /* Find dataset with query, sort... in one tags */
  findDatasetInTags = async (
    tags,
    title,
    fileType,
    minSize,
    maxSize,
    like,
    date,
    limit,
    skip
  ) => {
    const query = {
      name: tags[0],
    };

    const select = '_id name username avatar email';
    let nestedSort = {};
    if (like) {
      nestedSort = like === 'desc' ? { countLike: -1 } : { countLike: 1 };
    }
    const nestedQuery = super.createQuery(title, fileType, minSize, maxSize);
    return await super.findOneSortLimitPopulateAndNestedQuery(
      Tags,
      query,
      this.datasetsPopulate,
      nestedSort,
      limit,
      skip,
      nestedQuery,
      this.accountPopulate,
      select
    );
  };

  /* Find all dataset with query, sort... in one tags */
  countDatasetInTags = async (
    tags,
    title,
    fileType,
    minSize,
    maxSize,
    date
  ) => {
    const query = {
      name: tags[0],
    };

    const nestedQuery = super.createQuery(title, fileType, minSize, maxSize);
    const select = '_id';
    return await super.findOneAndPopulate(
      Tags,
      query,
      {},
      this.datasetsPopulate,
      nestedQuery,
      select
    );
  };
}

const instance = new TagsDao();
module.exports = instance;
