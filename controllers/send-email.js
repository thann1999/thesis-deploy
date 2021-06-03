const nodemailer = require('nodemailer');
const cryptoRandomString = require('crypto-random-string');
const RegisterCode = require('../models/register-code.model');
const RegisterCodeDao = require('../dao/register-code.dao');
const jwt = require('jsonwebtoken');

/* Send code to email */
function sendEmail(mail) {
  console.log(process.env.EMAIL_USERNAME, process.env.EMAIL_PASSWORD);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  transporter.sendMail(mail, function (error, info) {
    if (error) {
      throw error;
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

function createMailCode(email, accountId) {
  const randomCode = cryptoRandomString({ length: 6, type: 'numeric' });
  const code = new RegisterCode({
    code: randomCode,
    accountId: accountId,
  });
  RegisterCodeDao.createCode(code);
  const mail = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: '[Data World] Xác thực email',
    html: `
        <h2>Chào mừng bạn đến với Data World. Mã xác thực của bạn là: </h2>
        <p>${randomCode}</p>
        <p>Mã kích hoạt sẽ hết hạn sau 10 phút. Vui lòng không reply email này.</p> `,
  };

  return mail;
}

function createMailLink(account) {
  const resetCode = jwt.sign(
    { id: account._id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '2h',
    }
  );

  const mail = {
    from: process.env.EMAIL_USERNAME,
    to: account.email,
    subject: '[Data World] Đặt lại mật khẩu',
    html: `
        <h2>Click vào link dưới đây để đặt lại mật khẩu: </h2>
        <a href="${process.env.CLIENT_URL}/auth/reset-password/${resetCode}">Click here</a>
        <p>Link sẽ hết hạn trong 2 giờ. Vui lòng không reply email này.</p> `,
  };

  return mail;
}

module.exports = {
  sendEmail: sendEmail,
  createMailCode: createMailCode,
  createMailLink: createMailLink,
};
