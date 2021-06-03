const BaseDao = require("./base.dao");
const RegisterCode = require("../models/register-code.model");

class RegisterCodeDao extends BaseDao {
  /* Create register code */
  async createCode(code = new RegisterCode()) {
    return await super.insertOne(code);
  }

  /*Find register code by id*/
  async findRegisterCodeByUserId(userId) {
    const query = { accountId: userId };
    const sort = { createdDate: -1 };
    const limit = 1;
    return await super.findSortAndLimit(RegisterCode, query, sort, limit);
  }

  /* Update already use code */
  async updateAlreadyUse(id) {
    const query = { _id: id };
    const update = { isAlreadyUse: true };
    return await super.updateOne(RegisterCode, query, update);
  }
}

const instance = new RegisterCodeDao();
module.exports = instance;
