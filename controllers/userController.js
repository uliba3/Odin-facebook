//controllers/userController.js
const User = require("../models/user");
const { body, validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async(req, res) => {
    res.render("auth", { user: req.user });
});