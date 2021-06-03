const FILE_STATUS = {
  ADD: 0,
  MODIFIED: 1,
  DELETE: 2,
};

class FileVersion {
  constructor(fileName, status, changeDetails) {
    this.fileName = fileName;
    this.status = status;
    this.changeDetails = changeDetails;
  }
}

module.exports = {
  FILE_STATUS: FILE_STATUS,
  FileVersion: FileVersion,
};
