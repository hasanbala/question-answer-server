const asyncErrorWrapper = require("express-async-handler");
const {
  populateHelper,
  searchHelper,
  questionSortHelper,
  paginationHelper,
} = require("./queryHelpers");

const questionQuery = function (model, options) {
  return asyncErrorWrapper(async function (req, res, next) {
    let query = model.find();
    query = searchHelper("title", query, req);

    if (options && options.population) {
      query = populateHelper(query, options.population);
    }

    query = questionSortHelper(query, req);

    const total = await model.countDocuments();
    const pagResult = await paginationHelper(total, query, req);

    query = pagResult.query;
    const pagination = pagResult.pagination;

    const queryResult = await query;

    res.queryResult = {
      success: true,
      count: queryResult.length,
      pagination: pagination,
      data: queryResult,
    };

    next();
  });
};

module.exports = questionQuery;
