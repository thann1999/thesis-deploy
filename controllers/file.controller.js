const FileDao = require('../dao/file.dao');
const DatasetDao = require('../dao/dataset.dao');
const { columnsAnalysis } = require('./common/analysis-column');
const { readFileByPath } = require('./common/crud-file-local');

async function getFileContentByPath(req, res, next) {
  try {
    const jsonContent = await readFileByPath(req.body.path);
    res.status(200).json({ data: jsonContent });
  } catch (error) {
    next(error);
  }
}

const getAllFilesInDataset = async (req, res, next) => {
  try {
    const { datasetId } = req.body;
    const result = await DatasetDao.findAllFilesOfDataset(datasetId);
    const data = {
      files: result.files,
    };
    res.status(200).json({ data: data });
  } catch (error) {
    next(error);
  }
};

const updateColumns = async (req, res, next) => {
  try {
    const { fileId, columns, filePath } = req.body;
    const analysisColumns = await resetAnalysisFile(filePath, columns);
    await FileDao.updateColumns(fileId, analysisColumns);
    res
      .status(200)
      .json({ message: 'Cập nhật thành công', data: analysisColumns });
  } catch (error) {
    next(error);
  }
};

const updateDescription = async (req, res, next) => {
  try {
    const { fileId, description } = req.body;
    await FileDao.updateDescription(fileId, description);
    res.status(200).json({ message: 'Cập nhật thành công' });
  } catch (error) {
    next(error);
  }
};

const downloadFile = async (req, res, next) => {
  try {
    const { path, datasetId } = req.body;
    await DatasetDao.increaseViewDownloadDataset(datasetId, false);
    const name = path.split('/');
    res.download(path, name[name.length - 1]);
  } catch (error) {
    next(error);
  }
};

async function resetAnalysisFile(path, columns) {
  const jsonContent = await readFileByPath(path);
  const arrayColumns = columns;
  columnsAnalysis(arrayColumns, jsonContent);
  return arrayColumns;
}

module.exports = {
  getAllFilesInDataset: getAllFilesInDataset,
  getFileContentByPath: getFileContentByPath,
  updateColumns: updateColumns,
  updateDescription: updateDescription,
  downloadFile: downloadFile,
  resetAnalysisFile: resetAnalysisFile,
};
