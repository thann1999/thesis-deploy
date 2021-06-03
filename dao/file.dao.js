const BaseDao = require('./base.dao');
const File = require('../models/file.model');

class FileDao extends BaseDao {
  /*Create account */
  insertMultipleFile = async (files) => {
    return await super.insertMany(File, files);
  };

  /* Find one file by id */
  findFileById = async (fileId) => {
    const query = {
      _id: fileId,
    };
    return await super.findOne(File, query);
  };

  /* Find many dataset by id */
  findManyFileById = async (fileId) => {
    const query = {
      _id: { $in: fileId },
    };
    return await super.find(File, query);
  };

  updateColumns = async (fileId, columns) => {
    const query = {
      _id: fileId,
    };
    const update = {
      columns: columns,
      lastUpdate: Date.now(),
    };
    return await super.updateOne(File, query, update);
  };

  updateDescription = async (fileId, description) => {
    const query = {
      _id: fileId,
    };
    const update = {
      description: description,
      lastUpdate: Date.now(),
    };
    return await super.updateOne(File, query, update);
  };

  deleteManyFilesById = async (fileId) => {
    const query = {
      _id: { $in: fileId },
    };
    return await super.deleteMany(File, query);
  };
}

const instance = new FileDao();
module.exports = instance;
