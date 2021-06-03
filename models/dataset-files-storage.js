const multer = require('multer');
const AccountDao = require('../dao/account.dao');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const { username, url } = req.body;
      const dir = createDir(username, url);
      fs.access(dir, (error) => {
        if (error) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
      });
    } catch (error) {
      cb(error);
    }
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadDataset = multer({
  storage: storage,
  fileFilter: (req, files, cb) => {
    try {
      if (files) {
        const typeFile = files.originalname.split('.')[1].toLocaleLowerCase();
        const acceptFile = ['csv', 'json'];
        if (!acceptFile.includes(typeFile)) {
          cb(null, false);
          return cb(
            new Error(
              'Định dạng file không đúng. Sử dụng file có định dạng: csv, json'
            )
          );
        }
        const { username, url } = req.body;
        const dir = `${process.env.PATH_UPLOAD_FILE}/${username}/dataset/${url}`;
        fs.access(dir, (error) => {
          if (!error) {
            cb(null, false);
            return cb(new Error('URL của dataset đã tồn tại'));
          } else {
            cb(null, true);
          }
        });
      } else {
        cb(null, false);
        return cb(new Error('Dataset phải có ít nhất 1 file'));
      }
    } catch (error) {
      cb(error);
    }
  },
}).any();

const updateVersion = multer({
  storage: storage,
  fileFilter: async (req, file, cb) => {
    try {
      if (file) {
        const typeFile = file.originalname.split('.')[1];
        const acceptFile = ['csv', 'json', 'zip'];
        if (!acceptFile.includes(typeFile)) {
          cb(null, false);
          return cb(
            new Error(
              'Định dạng file không đúng. Sử dụng file có định dạng: csv, json, zip'
            )
          );
        }

        const { datasetId } = req.body;
        const account = await AccountDao.findAccountById(req.user.id);
        if (!account.datasets.includes(datasetId)) {
          return cb(new Error('Không có quyền cập nhật dataset'));
        }

        const { username, url, previousFiles } = req.body;
        const dir = createDir(username, url);
        fs.access(`${dir}${file.originalname}`, (error) => {
          if (!error) {
            if (
              JSON.parse(previousFiles).some(
                (element) => (element.fileName = file.originalname)
              )
            ) {
              const fileName = file.originalname.split('.');
              const newName = `${fileName[0]}-${Date.now()}.${
                fileName[fileName.length - 1]
              }`;
              req.fileModifies.set(file.originalname, newName);
              fs.renameSync(`${dir}${file.originalname}`, `${dir}${newName}`);
            }
          }
          cb(null, true);
        });
      } else {
        cb(null, false);
        return cb(new Error('Dataset phải có ít nhất 1 file'));
      }
    } catch (error) {
      cb(error);
    }
  },
}).any();

const createDir = (username, url) => {
  return `${process.env.PATH_UPLOAD_FILE}/${username}/dataset/${url}/files/`;
};
module.exports = {
  uploadDataset: uploadDataset,
  updateVersion: updateVersion,
};
