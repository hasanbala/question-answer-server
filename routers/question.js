const express = require("express");
const router = express.Router();

const {
  askNewQuestions,
  getAllQuestions,
  getSingleQuestions,
  editQuestions,
  deleteQuestions,
  likeQuestions,
  undoLikeQuestions,
} = require("../controllers/question");

const {
  getAccessToRoute,
  getQuestionOwnerAccess,
} = require("../middlewares/authorization/auth");
const {
  checkQuestionExist,
} = require("../middlewares/database/databaseErrorHelpers");
const answer = require("./answer");
const Question = require("../models/Question");

const questionQuery = require("../middlewares/query/questionQuery");
const answerQuery = require("../middlewares/query/answerQuery");

router.get(
  "/",
  questionQuery(Question, {
    population: {
      path: "user",
      select: "name profile_image",
    },
  }),
  getAllQuestions
);

router.get(
  "/:id",
  checkQuestionExist,
  answerQuery(Question, {
    population: [
      {
        path: "user",
        select: "name profile_image",
      },
      {
        path: "answers",
        select: "content",
      },
    ],
  }),
  getSingleQuestions
);

router.post("/ask", getAccessToRoute, askNewQuestions);
router.put(
  "/:id/edit",
  [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess],
  editQuestions
);
router.delete(
  "/:id/delete",
  [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess],
  deleteQuestions
);
router.get("/:id/like", [getAccessToRoute, checkQuestionExist], likeQuestions);
router.get(
  "/:id/undolike",
  [getAccessToRoute, checkQuestionExist],
  undoLikeQuestions
);

router.use("/:question_id/answers", checkQuestionExist, answer);

module.exports = router;
