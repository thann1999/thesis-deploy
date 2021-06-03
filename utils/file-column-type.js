const COLUMN_TYPE = {
  ID: 0,
  STRING: 1,
  NUMBER: 2,
  BOOLEAN: 3,
  DATE_TIME: 4,
  EMAIL: 5,
  URL: 6,
};

const FILE_TYPES = {
  CSV: 'csv',
  JSON: 'json',
};

function validateTypeValue(value, typeColumn) {
  let isValid = false;
  switch (typeColumn) {
    case COLUMN_TYPE.ID:
      isValid = true;
      break;
    case COLUMN_TYPE.STRING:
      isValid = typeof value === 'string';
      break;

    case COLUMN_TYPE.NUMBER:
      isValid = !isNaN(parseFloat(value));
      break;

    case COLUMN_TYPE.BOOLEAN:
      isValid = typeof value === 'boolean';
      break;

    case COLUMN_TYPE.DATE_TIME:
      const dateTime = /([12]\d{3}[\/\-](0[1-9]|1[0-2])[\/\-](0[1-9]|[12]\d|3[01]))/;
      isValid = dateTime.test(value);
      break;

    case COLUMN_TYPE.EMAIL:
      const email = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(( [a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      isValid = email.test(value);
      break;

    case COLUMN_TYPE.URL:
      const url = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
      isValid = url.test(value);
      break;
  }
  return isValid;
}

module.exports = {
  COLUMN_TYPE: COLUMN_TYPE,
  validateTypeValue: validateTypeValue,
  FILE_TYPES: FILE_TYPES,
};
