const MESSAGE = {
  CREATE_SUCCESS: 'Tải lên thành công',
  UPDATE_SUCCESS: 'Cập nhật thành công',
  NOT_PERMISSION: 'Không có thẩm quyền để thực hiện',
  REQUEST_WRONG: 'Request không đúng',
  WRONG_ACCESS_TOKEN: 'Access token không đúng. Hãy thử lại',
  DELETE_SUCCESS: 'Xóa thành công',
  NOT_FOUND: 'Không tìm thấy tài nguyên',
  ANALYSIS_FAILED: 'Có lỗi trong quá trình phân tích tệp',
};

const STATUS = {
  SUCCESS: 200,
  ERROR: 400,
  NOT_AUTHENTICATED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
};

module.exports = {
  RESPONSE_MESSAGE: MESSAGE,
  RESPONSE_STATUS: STATUS,
};
