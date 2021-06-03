class BaseDao {
  insertOne(doc) {
    return new Promise((resolve, reject) => {
      doc.save((err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  insertMany(doc, arrValues) {
    return new Promise((resolve, reject) => {
      doc.insertMany(arrValues, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  find(model, query) {
    return new Promise((resolve, reject) => {
      model.find(query, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  findOne(model, query) {
    return new Promise((resolve, reject) => {
      model.findOne(query, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  updateMany(model, query, update) {
    return new Promise((resolve, reject) => {
      model.updateMany(query, update, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  updateOne(model, query, update) {
    return new Promise((resolve, reject) => {
      model.updateOne(query, update, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  deleteOne(model, query) {
    return new Promise((resolve, reject) => {
      model.deleteOne(query, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  deleteMany(model, query) {
    return new Promise((resolve, reject) => {
      model.deleteMany(query, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  findSortAndLimit(model, query, sort, limit) {
    return new Promise((resolve, reject) => {
      model
        .find(query)
        .sort(sort)
        .limit(limit)
        .exec((err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
    });
  }

  findOneAndPopulate(
    model,
    query,
    select,
    populate,
    nestedQuery,
    nestedSelect,
    nestedSort
  ) {
    return new Promise((resolve, reject) => {
      model
        .findOne(query)
        .populate({
          path: populate,
          select: nestedSelect,
          match: nestedQuery,
          sort: nestedSort,
        })
        .select(select)
        .exec((err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
    });
  }

  findAndPopulate(model, query, populate, nestedQuery, select) {
    return new Promise((resolve, reject) => {
      model
        .find(query)
        .populate({ path: populate, select: select, match: nestedQuery })
        .exec((err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
    });
  }

  findAndMultiplePopulate(
    model,
    query,
    populate1,
    nestedQuery1,
    select1,
    populate2,
    nestedQuery2,
    select2,
    populate3,
    select3
  ) {
    return new Promise((resolve, reject) => {
      model
        .find(query)
        .populate({ path: populate1, select: select1, match: nestedQuery1 })
        .populate({
          path: populate2,
          select: select2,
          match: nestedQuery2,
          populate: { path: populate3, select: select3 },
        })
        .exec((err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
    });
  }

  findSortLimitSkipAndPopulate(
    model,
    query,
    sort,
    limit,
    skip,
    select,
    populate,
    populateSelect
  ) {
    return new Promise((resolve, reject) => {
      model
        .find(query)
        .sort(sort)
        .limit(limit)
        .skip(skip)
        .select(select)
        .populate({ path: populate, select: populateSelect })
        .exec((err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
    });
  }

  findSortLimitPopulateAndNestedQuery(
    model,
    query,
    sort,
    limit,
    populate1,
    nestedSort,
    nestedLimit,
    nestedSkip,
    nestedPopulate,
    select
  ) {
    return new Promise((resolve, reject) => {
      model
        .find(query)
        .sort(sort)
        .limit(limit)
        .populate({
          path: populate1,
          populate: { path: nestedPopulate, select: select },
          sort: nestedSort,
          skip: nestedSkip,
          limit: nestedLimit,
        })
        .exec((err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
    });
  }

  findOneSortLimitPopulateAndNestedQuery(
    model,
    query,
    populate1,
    nestedSort,
    nestedLimit,
    nestedSkip,
    nestedQuery,
    nestedPopulate,
    select
  ) {
    return new Promise((resolve, reject) => {
      model
        .findOne(query)
        .populate({
          path: populate1,
          populate: {
            path: nestedPopulate,
            select: select,
          },
          match: nestedQuery,
          sort: nestedSort,
          skip: nestedSkip,
          limit: nestedLimit,
        })
        .exec((err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
    });
  }

  countDocuments(model, query) {
    return new Promise((resolve, reject) => {
      model.countDocuments(query).exec((err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  /* Handle common */
  createQuery(title, fileType, minSize, maxSize, visibility) {
    const query = {};
    if (fileType) query.fileTypes = [fileType];
    if (minSize && maxSize) query.size = { $gte: minSize, $lte: maxSize };
    if (title) query.title = { $regex: '.*' + title + '.*' };
    if (visibility) query.visibility = visibility;
    return query;
  }
}

module.exports = BaseDao;
