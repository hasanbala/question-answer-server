const express = require("express");
const { getSingleUser, getAllUser } = require("../controllers/user.js");
const {
  checkUserExist,
} = require("../middlewares/database/databaseErrorHelpers");
const userQuery = require("../middlewares/query/userQuery.js");
const User = require("../models/User.js");

const router = express.Router();

router.get("/:id", checkUserExist, getSingleUser);
router.get("/", userQuery(User), getAllUser);

module.exports = router;
