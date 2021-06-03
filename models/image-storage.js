const multer = require('multer');
const AccountDao = require('../dao/account.dao');
const { IMAGE_TYPE } = require('../common/image-dataset.const');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      cb(null, './images');
    } catch (error) {
      cb(error);
    }
  },

  filename: async (req, file, cb) => {
    try {
      const { imageType } = req.body;
      const account = await AccountDao.findAccountById(req.user.id);
      if (
        parseInt(imageType) === IMAGE_TYPE.BANNER ||
        parseInt(imageType) === IMAGE_TYPE.THUMBNAIL
      ) {
        const { datasetId } = req.body;
        if (!account.datasets.includes(datasetId)) {
          return cb(new Error('Không có quyền cập nhật dataset'));
        }
      } else {
        const { username } = req.body;
        if (account.username !== username) {
          return cb(new Error('Không có quyền cập nhật avatar'));
        }
      }
      const fileName = file.originalname.split('.');
      cb(null, `${fileName[0]}-${Date.now()}.${fileName[1]}`);
    } catch (error) {
      cb(error);
    }
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(
        new Error('Định dạng file không đúng. Chỉ có thể tải lên file ảnh')
      );
    }
  },
}).single('image');

module.exports = upload;
