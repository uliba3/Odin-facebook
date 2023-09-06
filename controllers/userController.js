//controllers/userController.js
const User = require("../models/user");
const Friendship = require("../models/friendship");
const { body, validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async(req, res) => {
    if(req.user){
        res.redirect("/index");
    } else {
        res.render("auth");
    }
});

exports.sendRequest = asyncHandler(async(req,res,next) => {
    const userId = req.params.id;
    console.log("friend request to ", userId);
    const friendship = new Friendship({
        user: req.user._id,
        friend: userId,
        status: 'pending',
    });
    await friendship.save();
    res.redirect("/index");
})