// controllers/friendshipController.js
const Post = require("../models/post");
const User = require("../models/user");
const Friendship = require("../models/friendship");
const { body, validationResult } = require("express-validator");

exports.request = asyncHandler(async(req, res, next) => {
    const userId = req.user._id;
    const requestFriendId = req.params.id;
    const friendship = new Friendship({
        user: userId,
        friend: requestFriendId,
        status: 'sent', // Friendship status
    })
});

const asyncHandler = require("express-async-handler");