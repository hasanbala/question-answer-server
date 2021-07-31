const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getAccessToRoute,
  getAnswerOwnerAccess,
} = require("../middlewares/authorization/auth");
const {
  checkQuestionAndAnswerExist,
} = require("../middlewares/database/databaseErrorHelpers");

const {
  addNewAnswerToQuestions,
  getAllAnswerByQuestions,
  getSingleAnswerByQuestions,
  editAnswer,
  deleteAnswer,
  likeAnswers,
  undoLikeAnswers,
} = require("../controllers/answer");

router.post("/", getAccessToRoute, addNewAnswerToQuestions);
router.get("/", getAllAnswerByQuestions);
router.get(
  "/:answer_id",
  checkQuestionAndAnswerExist,
  getSingleAnswerByQuestions
);
router.get(
  "/:answer_id/like",
  checkQuestionAndAnswerExist,
  getAccessToRoute,
  likeAnswers
);
router.get(
  "/:answer_id/undolike",
  checkQuestionAndAnswerExist,
  getAccessToRoute,
  undoLikeAnswers
);

router.put(
  "/:answer_id/edit",
  [checkQuestionAndAnswerExist, getAccessToRoute, getAnswerOwnerAccess],
  editAnswer
);
router.delete(
  "/:answer_id/delete",
  [checkQuestionAndAnswerExist, getAccessToRoute, getAnswerOwnerAccess],
  deleteAnswer
);

module.exports = router;
