const BaseDao = require('./base.dao');
const Account = require('../models/account.model');

class AccountDao extends BaseDao {
  datasetPopulate = 'datasets';

  /*Find account with username and password */
  async findAccountByUsernamePassword(username, password) {
    const query = {
      username: username,
      password: password,
    };
    return await super.findOne(Account, query);
  }

  /*Find account by Id */
  async findAccountById(id) {
    const query = {
      _id: id,
    };
    return await super.findOne(Account, query);
  }

  /*Find account by Id */
  async findAndPopulateDatasetFilter(id, visibility, fileType, sort) {
    const query = {
      _id: id,
    };

    const select = 'datasets';
    const nestedQuery = super.createQuery(
      null,
      fileType,
      null,
      null,
      visibility
    );
    let nestedSort = {};
    if (sort) {
      nestedSort = sort = 1 ? { lastUpdate: -1 } : { countLike: -1 };
    }
    return await super.findOneAndPopulate(
      Account,
      query,
      select,
      this.datasetPopulate,
      nestedQuery,
      {},
      nestedSort
    );
  }

  /*Find account with username or email */
  async findAccountByUsernameOrEmail(email, username) {
    const query = { $or: [{ email: email }, { username: username }] };
    return await super.findOne(Account, query);
  }

  /*Find account with username or email */
  async findAccountByUsernameOrEmailAndPopulate(email, username) {
    const query = { $or: [{ email: email }, { username: username }] };
    const select =
      '_id email avatar name username bio company location dateOfBirth website accountMode github recommend datasets ';
    const nestedSort = { lastUpdate: -1 };
    return await super.findOneAndPopulate(
      Account,
      query,
      select,
      this.datasetPopulate,
      {},
      {},
      nestedSort
    );
  }

  /*Create account */
  async createAccount(account = new Account()) {
    return await super.insertOne(account);
  }

  /*Update activate account */
  async updateVerifyAccount(accountId, isVerify) {
    const query = { _id: accountId };
    const update = { isVerify: isVerify };
    return await super.updateOne(Account, query, update);
  }

  /* Delete account */
  async deleteAccountByIdOrEmail(accountId, email) {
    const query = { $or: [{ email: email }, { _id: accountId }] };
    return await super.deleteOne(Account, query);
  }

  /* Update profile */
  async updateProfile(accountId, newProfile) {
    const query = { _id: accountId };
    const { bio, name, company, location, website, github, dateOfBirth } =
      newProfile;
    const update = {
      bio: bio,
      name: name,
      company: company,
      location: location,
      website: website,
      github: github,
      dateOfBirth: dateOfBirth,
      lastUpdate: Date.now(),
    };
    return await super.updateOne(Account, query, update);
  }

  /* Update datasetId into field dataset */
  async updateDatasetsOfAccount(accountId, datasetId, isAdd) {
    const query = { _id: accountId };
    const update = isAdd
      ? { $push: { datasets: datasetId } }
      : { $pull: { datasets: datasetId } };
    return await super.updateOne(Account, query, update);
  }

  /* Find all dataset of account*/
  findAllDatasetOfAccount = async (username) => {
    const query = {
      username: username,
    };
    return await super.findOneAndPopulate(
      Account,
      query,
      {},
      this.datasetPopulate,
      {},
      {}
    );
  };

  // update account: recommend, avatar, mode, password...
  updateAccount = async (accountId, updateType, updateData) => {
    const query = {
      _id: accountId,
    };
    let update = {};

    switch (updateType) {
      case 1: //update recommend tags
        update = {
          recommend: updateData,
        };
        break;
      case 2: //update avatar
        update = {
          avatar: updateData,
          lastUpdate: Date.now(),
        };
        break;
      case 3: //update account mode
        update = {
          accountMode: updateData,
        };
        break;
      case 4: //update password
        update = {
          password: updateData,
        };
        break;
      case 5: //update verify account
        update = {
          isVerify: updateData,
        };
        break;
    }

    return super.updateOne(Account, query, update);
  };
}

const instance = new AccountDao();
module.exports = instance;
