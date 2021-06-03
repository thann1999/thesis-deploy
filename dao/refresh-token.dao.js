const BaseDao = require("./base.dao");
const RefreshToken = require("../models/refresh-token.model");

class RefreshTokenDao extends BaseDao {
  /* Create register code */
  async createToken(code = new RefreshToken()) {
    return await super.insertOne(code);
  }

  /*Find register code by id*/
  async findRefreshTokenByToken(refreshToken) {
    const query = { token: refreshToken };
    return await super.findOne(RefreshToken, query)
  }

  async deleteToken(refreshToken) {
    const query = {
      token: refreshToken
    }
    return await super.deleteOne(RefreshToken, query)
  }
}

const instance = new RefreshTokenDao();
module.exports = instance;
