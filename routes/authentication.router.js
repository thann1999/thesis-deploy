var express = require('express');
const authenticationController = require('../controllers/authentication.controller');
const { validate } = require('../utils/validation-account');
const { auth } = require('../utils/verify-token');
const router = express.Router();

/* POST username, password and login */
router.post('/login', validate.validateLogin(), authenticationController.login);

/* GET login or not */
router.get('/login', auth, authenticationController.checkLogin);

/* GET activate account */
router.post('/verify-account', authenticationController.verifyAccount);

/* POST info and register */
router.post(
  '/register',
  validate.validateRegisterAccount(),
  authenticationController.register
);

/* Forgot password */
router.post('/forgot-password', authenticationController.forgotPassword);

/* Login with google */
router.post('/login-google', authenticationController.loginGoogle);

/* Login with google */
router.post('/login-facebook', authenticationController.loginFacebook);

/* Refresh token */
router.post('/refresh-token', authenticationController.getNewAccessToken);

/* Logout  */
router.post('/logout', authenticationController.deleteRefreshToken);

/* Reset password */
router.post(
  '/reset-password',
  auth,
  validate.validatePassword(),
  authenticationController.changePassword
);

module.exports = router;
