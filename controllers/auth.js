const User = require("../models/User");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const {sendJwtToClient} = require("../helpers/authorization/tokenHelpers");
const {validateUserInput, comparePassword} = require("../helpers/input/loginHelpers");
const sendEmail = require("../helpers/libraries/sendEmail");    

const register = asyncErrorWrapper(async (req,res,next) =>{
    // const name = "john rambo";
    // const email = "rambo@gmail.com";
    // const password = "12456";
    
    const {name, email, password, role} = req.body;
    
    const user = await User.create({
        name,
        email,
        password,
        role

    });

    sendJwtToClient(user, res);
});

const login = asyncErrorWrapper(async (req,res,next) =>{
    
    const {email, password} = req.body;
    const user = await User.findOne({ email }).select("+password");

    // console.log(user,email, password);

    if(!validateUserInput(email, password)){
        return next(new CustomError("please check your inputs",400));
    }

    if(!user || !comparePassword(password, user.password)){
        return next(new CustomError("please check your credentials",403));
    }
    sendJwtToClient(user, res);

});

const logout = asyncErrorWrapper(async (req,res,next) => {
    const {NODE_ENV} = process.env;

    return res.status(200).cookie({
        httpOnly: true,
        expires: new Date(Date.now()),
        secure: NODE_ENV === "development" ? false : true
    })
    .json({
        success: true,
        message: "Logout Successfull" 
    })
});

const getUser = (req, res, next) => {
    res.json({
        success: true,
        data: {
            id: req.user.id,
            name: req.user.name 
        }
    });
};

const imageUpload = asyncErrorWrapper(async (req,res,next) => {

    const user = await User.findByIdAndUpdate(req.user.id,{
        "profile_image" : req.savedProfileImaged
    }, {
        new: true,
        runValidators : true
    });

    res.status(200)
    .json({
        success: true,
        message: "image upload successful",
        data: user 
    })
});

const forgotPassword = asyncErrorWrapper(async (req, res, next) => {

    const resetEmail = req.body.email;

    const user = await User.findOne({email : resetEmail});

    if(!user){
        return next(new CustomError("there is no user with the email", 400));
    };

    const resetPasswordToken = user.getResetPasswordTokenFromUser();

    await user.save();

    const resetPasswordUrl = `http://localhost:5500/api/sauth/resetpassword?resetPasswordToken=${resetPasswordToken}`;

    const emailTemplate =`
    <h3>reset your email</h3>
    <p>this <a href= '${resetPasswordUrl}' target = '_blank'> link </a> will expire in 1 hour</p>
    `;

    try{
        await sendEmail({
            from : process.env.SMTP_USER,
            to: resetEmail,
            subject: "reset your password",
            html: emailTemplate
        });
        return  res.status(200).json({
            success: true,
            message: "token send to your email"
        });
    }
    catch(err){
        user.resetPasswordToken =undefined;
        user.resetPasswordExpire =undefined;
        await user.save();
        return next(new CustomError("email could not be sent",500));
    }


     
});


const resetPassword = asyncErrorWrapper(async (req, res, next) => {

    const {resetPasswordToken} = req.query;

    const {password} = req.body;

    if(!resetPasswordToken){
        return next(new CustomError("please provide a valid token", 400));
    };

    let user = await User.findOne({
        resetPasswordToken : resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()}
    });

    if(!user){
        return next(new CustomError("invalid token or session expired", 400));
    };

    user.password = password;
    user.resetPasswordToken =undefined;
    user.resetPasswordExpire =undefined;
    await user.save();

    return res.status(200).json({
        success:true,
        message: "reset password process successful"
    })

});

const editDetails = asyncErrorWrapper(async (req, res, next) => {

    const editInfo = req.body;

    const user = await User.findByIdAndUpdate(req.user.id, editInfo, {
        new : true,
        runValidators: true
    });

    return res.status(200).json({
        success: true,
        data: user
    })

});

module.exports = {
    register,
    getUser,
    login,
    logout,
    imageUpload,
    forgotPassword,
    resetPassword,
    editDetails
};