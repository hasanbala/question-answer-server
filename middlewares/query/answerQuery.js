const asyncErrorWrapper = require("express-async-handler");
const { populateHelper, paginationHelper } = require("./queryHelpers");

const answerQuery = function(model, options){

    return asyncErrorWrapper(async function(req,res,next){

        const {id} = req.params;
        
        const arrayName = "answers";

        const total = (await model.findById(id))["answerCount"];

        const pagResult = await paginationHelper(total, undefined, req);

        const startIndex = pagResult.startIndex;
        const limit = pagResult.limit;

        let queryObjects = {};
        queryObjects[arrayName] = {$slice: [startIndex, limit]};
        let query = model.find({_id : id}, queryObjects);

        query = populateHelper(query, options.population)

        const queryResult = await query;
        res.queryResult = {
            success: true,
            pagination: pagResult.pagination,
            data: queryResult     
        }

        next();
    });
};

module.exports = answerQuery;