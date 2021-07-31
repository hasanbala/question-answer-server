const Question = require("../models/Question");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");

const getAllQuestions = asyncErrorWrapper(async (req, res, next) => {
  return res.status(200).json(res.queryResult);
});

const askNewQuestions = asyncErrorWrapper(async (req, res, next) => {
  const info = req.body;

  const question = await Question.create({
    ...info,
    user: req.user.id,
  });
  return res.status(200).json({
    success: true,
    data: question,
  });
});

const getSingleQuestions = asyncErrorWrapper(async (req, res, next) => {
  // const {id} = req.params;
  // const user = await User.findById(id);

  return res.status(200).json(res.queryResult);
});

const editQuestions = asyncErrorWrapper(async (req, res, next) => {
  // const {id} = req.params;
  // const user = await User.findById(id);

  const { title, content } = req.body;
  req.data.title = title;
  req.data.content = content;

  req.data = await req.data.save();

  return res.status(200).json({
    success: true,
    data: req.data,
  });
});

const deleteQuestions = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;
  await Question.findByIdAndDelete(id);

  return res.status(200).json({
    success: true,
    message: "question delete operation successful",
  });
});

const likeQuestions = asyncErrorWrapper(async (req, res, next) => {
  if (req.data.likes.includes(req.user.id)) {
    return next(new CustomError("you already likes this questions", 400));
  }

  req.data.likes.push(req.user.id);
  req.data.likeCount = req.data.likes.length;

  await req.data.save();

  return res.status(200).json({
    success: true,
    data: req.data,
  });
});

const undoLikeQuestions = asyncErrorWrapper(async (req, res, next) => {
  if (!req.data.likes.includes(req.user.id)) {
    return next(new CustomError("you can not undo likes this questions", 400));
  }
  const index = req.data.likes.indexOf(req.user.id);
  req.data.likes.splice(index, 1);
  req.data.likeCount = req.data.likes.length;

  await req.data.save();

  return res.status(200).json({
    success: true,
    data: req.data,
  });
});

module.exports = {
  askNewQuestions,
  getAllQuestions,
  getSingleQuestions,
  editQuestions,
  deleteQuestions,
  likeQuestions,
  undoLikeQuestions,
};
