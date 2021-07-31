const CustomError = require("../../helpers/error/CustomError");
const jwt = require("jsonwebtoken");
const {isTokenIncluded, getAccessTokenFromHeader} = require("../../helpers/authorization/tokenHelpers");
const asyncErrorWrapper = require("express-async-handler");
const User = require("../../models/User");
const Question = require("../../models/Question");

const getAccessToRoute = (req, res, next) =>{

    const {JWT_SECRET_KEY} = process.env;

    //token
    if(!isTokenIncluded(req)){
        return next(new CustomError("you are not authorizes to access", 401));
    };
    
    const accessToken = getAccessTokenFromHeader(req);

    jwt.verify(accessToken, JWT_SECRET_KEY, (err, decoded) => {

        if(err){
            return next(new CustomError("you are not authorizes to access", 401));
        }
        req.user = {
            id: decoded.id, 
            name: decoded.name
        };
        next();
    });
};

const getAdminAccess = asyncErrorWrapper(async (req, res, next)=>{

    const {id} = req.user;
    const user = await User.findById(id);

    if(user.role !== "admin"){
        return next(new CustomError("only admins can access this route", 403));
    }

    next();
}); 

const getQuestionOwnerAccess = asyncErrorWrapper((req, res, next)=>{

    const userId = req.user.id;
    // const questionId = req.params.id;
    // const question = await Question.findById(questionId);


    if(req.data.user != userId){
        return next(new CustomError("only owner can handle this operation", 403));
    }
    next();
});

const getAnswerOwnerAccess = asyncErrorWrapper((req, res, next)=>{

    const userId = req.user.id;
    // const questionId = req.params.id;
    // const question = await Question.findById(questionId);


    if(req.data.user != userId){
        return next(new CustomError("only owner can handle this operation", 403));
    }
    next();
}); 

module.exports = {
    getAccessToRoute,
    getAdminAccess,
    getQuestionOwnerAccess,
    getAnswerOwnerAccess
}