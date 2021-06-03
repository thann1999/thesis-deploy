const Account = require('../models/account.model');
const RefreshToken = require('../models/refresh-token.model');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { sendEmail, createMailCode, createMailLink } = require('./send-email');
const AccountDao = require('../dao/account.dao');
const RefreshTokenDao = require('../dao/refresh-token.dao');
const RegisterCodeDao = require('../dao/register-code.dao');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');

/* Hashing password by SHA256 */
function hashPassword(password) {
  const hash = crypto.createHash('sha256').update(password).digest('base64');
  return hash;
}

/* Check account is correct or wrong */
async function login(req, res, next) {
  //Validate account before query
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }
  //Query account
  const user = await AccountDao.findAccountByUsernamePassword(
    req.body.username,
    hashPassword(req.body.password)
  );
  if (user && user.isVerify) {
    const token = await createJWTToken(user._id, user.name, user.avatar);
    const data = {
      accountId: user._id,
      avatar: user.avatar,
      username: user.username,
      name: user.name,
    };
    res
      .status(200)
      .header(process.env.AUTH_TOKEN, token)
      .json({ token: token, data: data });
  } else {
    res.status(401).json({ message: 'Sai tên tài khoản hoặc mật khẩu' });
  }
}

/* Forgot password */
async function forgotPassword(req, res, next) {
  //Send code to confirm forgot password
  const email = req.body.email;
  const result = await AccountDao.findAccountByUsernameOrEmail(email, null);
  if (!result || !result.isVerify) {
    return res.status(400).json({ message: 'Email này chưa được đăng ký' });
  }
  sendEmail(createMailLink(result));
  res.status(200).json({ message: 'Link đã được gửi' });
}

/* verify email to register account */
async function verifyAccount(req, res, next) {
  // Get auth header value
  try {
    const { verifyCode, accountId } = req.body;
    if (!verifyCode) {
      return res.status(401).json({ message: 'Từ chối truy cập' });
    }

    const result = await RegisterCodeDao.findRegisterCodeByUserId(accountId);
    const findCode = result.find((item) => item.code === verifyCode);
    if (findCode === undefined) {
      return res.status(400).json({ message: 'Mã xác nhận sai' });
    } else if (findCode.isAlreadyUse) {
      return res.status(400).json({ message: 'Mã xác nhận đã được sử dụng' });
    }

    //check expired code
    const minute = Math.abs(new Date() - findCode.createdDate) / (1000 * 60);
    if (minute > process.env.EXPIRE_MINUTE_REGISTER_CODE) {
      return res.status(400).json({ message: 'Mã xác nhận đã quá hạn' });
    }
    const isVerify = true;

    await AccountDao.updateAccount(accountId, 5, isVerify);
    await RegisterCodeDao.updateAlreadyUse(findCode._id);
    res.status(200).json({ message: 'Mã xác nhận đúng' });
  } catch (error) {
    next(error);
  }
}

/* Check login or not */
async function checkLogin(req, res, next) {
  try {
    const user = await AccountDao.findAccountById(req.user.id);
    const data = {
      accountId: user._id,
      avatar: user.avatar,
      username: user.username,
      name: user.name,
    };
    res.status(200).json({ data: data });
  } catch (error) {
    next(error);
  }
}

/* Change password */
async function changePassword(req, res, next) {
  const { password } = req.body;
  if (!password) {
    return res.status(200).json({ message: 'Token chính xác' });
  }
  console.log(password, req.user);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: errors.array() });
  }
  try {
    await AccountDao.updateAccount(req.user.id, 4, hashPassword(password));
    res.status(200).json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    next(error);
  }
}

/* Create jwt token for login success */
async function createJWTToken(id, name, avatar) {
  const refreshToken = jwt.sign(
    { id: id, name: name, avatar: avatar },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '20d' }
  );

  try {
    await RefreshTokenDao.createToken(
      new RefreshToken({ token: refreshToken })
    );
    return {
      accessToken: jwt.sign(
        { id: id, name: name, avatar: avatar },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' }
      ),
      refreshToken: refreshToken,
    };
  } catch (error) {
    throw error;
  }
}

/* Login with google */
async function loginGoogle(req, res, next) {
  const oAuth2Client = new OAuth2Client();
  const { accessToken, profile } = req.body;
  try {
    const tokenInfo = await oAuth2Client.getTokenInfo(accessToken);
    const { email } = tokenInfo;
    const user = await AccountDao.findAccountByUsernameOrEmail(email, null);
    let token, data;
    if (!user) {
      const newUser = new Account({
        email: email,
        avatar: profile.imageUrl,
        name: profile.name,
        username: email.split('@')[0],
        bio: '',
        company: '',
        location: '',
        dateOfBirth: new Date(),
        website: '',
        github: '',
        password: '',
        isVerify: true,
        role: process.env.ROLE_USER,
        recommends: [],
        datasets: [],
      });
      const result = await AccountDao.createAccount(newUser);
      data = {
        accountId: result._id,
        avatar: result.imageUrl,
        username: result.username,
        name: result.name,
      };
      token = await createJWTToken(result._id, result.name, profile.imageUrl);
    } else {
      data = {
        accountId: user._id,
        avatar: user.avatar,
        username: user.username,
        name: user.name,
      };
      token = await createJWTToken(user._id, user.name, user.avatar);
    }
    res
      .status(200)
      .header(process.env.AUTH_TOKEN, token)
      .json({ token: token, data: data });
  } catch (error) {
    res.status(400).json({ message: 'Access token không đúng' });
  }
}

/* Login facebook */
async function loginFacebook(req, res, next) {
  const { accessToken, profile } = req.body;
  try {
    const userInfo = await axios.get(
      `https://graph.facebook.com/me?access_token=${accessToken}`
    );
    const user = await AccountDao.findAccountByUsernameOrEmail(
      profile.email,
      null
    );
    let token, data;
    if (!user) {
      const newUser = new Account({
        email: profile.email,
        avatar: profile.avatar,
        name: userInfo.data.name,
        username: profile.email.split('@')[0],
        password: null,
        bio: '',
        company: '',
        location: '',
        dateOfBirth: new Date(),
        website: '',
        github: '',
        isVerify: true,
        role: process.env.ROLE_USER,
        recommends: [],
        datasets: [],
      });
      const result = await AccountDao.createAccount(newUser);
      data = {
        avatar: result.avatar,
        accountId: result._id,
        username: result.username,
        name: result.name,
      };
      token = await createJWTToken(result._id, result.name, profile.avatar);
    } else {
      data = {
        avatar: user.avatar,
        username: user.username,
        accountId: user._id,
        name: user.name,
      };
      token = await createJWTToken(user._id, user.name, profile.avatar);
    }
    res
      .status(200)
      .header(process.env.AUTH_TOKEN, token)
      .json({ token: token, data: data });
  } catch (error) {
    res.status(400).json({ message: 'Access token không đúng' });
  }
}

/* Register account */
async function register(req, res, next) {
  //Validate account before save into database
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }
  try {
    const user = await AccountDao.findAccountByUsernameOrEmail(
      req.body.email,
      req.body.username
    );

    const newUser = new Account({
      email: req.body.email,
      avatar: '',
      username: req.body.username,
      password: hashPassword(req.body.password),
      name: req.body.firstName + ' ' + req.body.lastName,
      bio: '',
      company: '',
      location: '',
      recommends: [],
      dateOfBirth: new Date(),
      website: '',
      github: '',
      role: process.env.ROLE_USER,
      datasets: [],
    });

    //If account exist
    if (user) {
      if (!user.isVerify) {
        await AccountDao.deleteAccountByIdOrEmail(null, user.email);
      } else {
        if (user.email === newUser.email)
          return res.status(400).json({ message: 'Email đã tồn tại' });
        else if (user.username === newUser.username)
          return res.status(400).json({ message: 'Tên tài khoản đã tồn tại' });
      }
    }
    const result = await AccountDao.createAccount(newUser);
    sendEmail(createMailCode(result.email, result._id));
    res.status(200).json({ data: result._id });
  } catch (error) {
    next(error);
  }
}

async function getNewAccessToken(req, res, next) {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Không có refresh token' });
  }
  const result = await RefreshTokenDao.findRefreshTokenByToken(refreshToken);
  if (!result) {
    return res.status(403).json({ message: 'Refresh token sai' });
  }
  try {
    const verified = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const { id, name, avatar } = verified;
    const account = await AccountDao.findAccountById(id);
    const data = {
      accountId: account._id,
      avatar: account.avatar,
      username: account.username,
    };
    const token = jwt.sign(
      { id: id, name: name, avatar: avatar },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    );
    res.status(200).json({ token: token, data: data });
  } catch (error) {
    return res.status(403).json({ message: 'Refresh token sai' });
  }
}

async function deleteRefreshToken(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Không có refresh token' });
    }
    await RefreshTokenDao.deleteToken(refreshToken);
    res.status(200).json({ message: 'Đăng xuất thành công' });
  } catch (error) {
    return res.status(401).json({ message: 'Refresh token sai' });
  }
}

module.exports = {
  login: login,
  register: register,
  checkLogin: checkLogin,
  verifyAccount: verifyAccount,
  forgotPassword: forgotPassword,
  changePassword: changePassword,
  loginGoogle: loginGoogle,
  loginFacebook: loginFacebook,
  createJWTToken: createJWTToken,
  getNewAccessToken: getNewAccessToken,
  deleteRefreshToken: deleteRefreshToken,
};
