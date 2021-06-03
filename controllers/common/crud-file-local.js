const { FILE_TYPES } = require('../../utils/file-column-type');
const csv = require('csv-parser');
const fs = require('fs');

//read file and convert to json
async function readFileByPath(path) {
  try {
    return new Promise((resolve, reject) => {
      const fileType = path.split('.');

      //read file content to json
      const results = [];
      fileType[fileType.length - 1] === FILE_TYPES.CSV
        ? fs
            .createReadStream(path, 'utf8')
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
              resolve(results);
            })
        : fs.readFile(path, 'utf8', (err, data) => {
            if (err) reject(err);
            resolve(JSON.parse(data));
          });
    });
  } catch (error) {
    throw error;
  }
}

//read utf-8 file
async function readUtf8File(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) reject(err);
      resolve(JSON.parse(data));
    });
  });
}

//delete array file by path
function deleteFiles(path) {
  path.forEach((item) => {
    fs.unlink(item, (err) => {
      if (err) throw err;
    });
  });
}

function deleteFolder(dir) {
  fs.rmdir(dir, { recursive: true }, (err) => {
    if (err) throw err;
  });
}

module.exports = {
  readFileByPath: readFileByPath,
  readUtf8File: readUtf8File,
  deleteFiles: deleteFiles,
  deleteFolder: deleteFolder,
};
