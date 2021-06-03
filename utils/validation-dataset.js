const { check } = require('express-validator');

const validateTitleAndSubtitle = () => {
  return [
    validateTitle(),
    check('subTitle', 'subTitle không được trống').not().isEmpty(),
    check('subTitle', 'Sub title phải có 5-80 ký tự').isLength({
      min: 5,
      max: 50,
    }),
  ];
};

const validateTitle = () => {
  return [
    check('title', 'Title không được trống').not().isEmpty(),
    check('title', 'Title phải có 5-50 ký tự').isLength({ min: 5, max: 50 }),
  ];
};

const validateUrl = () => {
  return [
    check(
      'url',
      'Url có ít nhất 5 ký tự. Có thể sử dụng chữ, số và dấu gạch ngang'
    ).matches(/^(?=.{5,}$)(?![-])(?!.*[-]{2})[a-zA-Z0-9-]+(?<![-])$/),
  ];
};

const validateDataset = () => {
  return [
    check('visibility', 'Visibility không được trống').not().isEmpty(),
    validateTitle(),
    validateUrl()
  ];
};

let validate = {
  validateDataset: validateDataset,
  validateTitleAndSubtitle: validateTitleAndSubtitle,
};

module.exports = { validate };
