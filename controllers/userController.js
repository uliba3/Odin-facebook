//controllers/userController.js
const User = require("../models/user");
const { body, validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async(req, res) => {
    if(req.user){
        res.render("index.jade");
    } else {
        res.render("auth", { user: req.user });
    }
});