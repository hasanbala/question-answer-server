const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");

const User = require("../models/User");

const getSingleUser = asyncErrorWrapper(async (req, res, next) => {

    // const {id} = req.params;

    // const user = await User.findById(id);
 
    return res.status(200).json({
        success: true,
        data: req.data
    });
});

const getAllUser = asyncErrorWrapper(async (req, res, next) => {

    // const users = await User.find();
 
    // return res.status(200).json({
    //     success: true,
    //     data: users
    // });

    return res.status(200).json(res.queryResult);

});

module.exports = {
    getSingleUser,
    getAllUser
};