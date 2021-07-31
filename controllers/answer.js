const Answer = require("../models/Answer");
const Question = require("../models/Question");
// const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");

const addNewAnswerToQuestions = asyncErrorWrapper(async (req,res,next) =>{

    const {question_id} = req.params;
    const user_id = req.user.id;
    const info = req.body;

    const answer = await Answer.create({
        ...info,
        question: question_id,
        user: user_id
    });
    
    return res.status(200).json({
        success: true,
        data: answer
    });
});

const getAllAnswerByQuestions = asyncErrorWrapper(async (req,res,next) =>{

    const {question_id} = req.params;
    const question = await Question.findById(question_id).populate("answers");
    const answer = question.answers
    
    return res.status(200).json({
        success: true,
        count: answer.length,
        data: answer
    });
});

const getSingleAnswerByQuestions = asyncErrorWrapper(async (req,res,next) =>{

    // const {answer_id} = req.params;
    // const answer = await Answer.findById(answer_id);
    // answer ile birlikte quesiton ve user ınıda göstermek istediğimiz için "data: req.data" yerine populate kullanacağız.
    
    const {answer_id} = req.params;
    const answer = await Answer.findById(answer_id)
    .populate({
        path: "question",
        select: "title"
    })
    .populate({
        path: "user",
        select: "name profile_image"
    });

    return res.status(200).json({
        success: true,
        data: answer
    });
});

const editAnswer = asyncErrorWrapper(async (req,res,next) =>{

    const {content} = req.body;
    req.data.content = content;

    req.data = await req.data.save();
 
    return res.status(200).json({
        success: true,
        data: req.data
    });
});

const deleteAnswer = asyncErrorWrapper(async (req,res,next) =>{

    const {answer_id} = req.params;
    const {question_id} = req.params;

    await Answer.findByIdAndRemove(answer_id);
    const question = await Question.findById(question_id);

    question.answers.splice(question.answers.indexOf(answer_id),1);
    question.answerCount = question.answers.length;

    await question.save();
 
    return res.status(200).json({
        success: true,
        message: "answer delete operation successful"
    });
});

const likeAnswers = asyncErrorWrapper(async (req,res,next) =>{

    if(req.data.likes.includes(req.user.id)){
        return next(new CustomError("you already likes this answers", 400));
    };

    req.data.likes.push(req.user.id);    

    await req.data.save();

    return res.status(200).json({
        success: true,
        data: req.data
    });
});

const undoLikeAnswers = asyncErrorWrapper(async (req,res,next) =>{

    if(!req.data.likes.includes(req.user.id)){
        return next(new CustomError("you can not undo likes this answers", 400));
    };
    const index = req.data.likes.indexOf(req.user.id);
    req.data.likes.splice(index, 1);
    await req.data.save();

    return res.status(200).json({
        success: true,
        data: req.data
    });
});


module.exports = {
    addNewAnswerToQuestions,
    getAllAnswerByQuestions,
    getSingleAnswerByQuestions,
    editAnswer,
    deleteAnswer,
    undoLikeAnswers,
    likeAnswers
};