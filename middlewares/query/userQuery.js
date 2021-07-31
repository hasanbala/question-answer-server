const asyncErrorWrapper = require("express-async-handler");
const { searchHelper, paginationHelper } = require("./queryHelpers");

const userQuery = function(model, options){

    return asyncErrorWrapper(async function(req,res,next){

        let query = model.find();
        query= searchHelper("name", query, req);
        const total = await model.countDocuments();

        const pagResult = await paginationHelper(total, query, req);
        query = pagResult.query;
        const pagination = pagResult.pagination;
        
        const queryResult = await query.find();

        res.queryResult = {
            success: true,
            count: queryResult.length,
            pagination: pagination,
            data: queryResult
        };

        next();
    });
};

module.exports = userQuery;