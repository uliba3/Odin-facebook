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
    const myId = req.user._id;
    //console.log("friend request to ", userId);
    const friendship = new Friendship({
        user: myId,
        friend: userId,
        status: 'pending',
    });
    await friendship.save();
    res.redirect("/index");
})

exports.cancelRequest = asyncHandler(async(req,res,next) => {
    const userId = req.params.id;
    const myId = req.user._id;

    console.log("cancel request to ", userId);
    try {
        // Find the post by ID and delete it
        const result = await Friendship.findOneAndDelete({
                                            user: myId,
                                            friend: userId,
                                            status: 'pending'
                                        }).exec();
        if (!result) {
          console.log("request not found for cancelation.");
          return res.redirect("/index");
        }
    
        console.log("friendRequest successfully canceled:", result);
        res.redirect("/index");
      } catch (error) {
        console.error("Error canceling request:", error);
        res.redirect("/index");
      }
    

    res.redirect("/index");
});

exports.rejectRequest = asyncHandler(async(req,res,next) => {
    const userId = req.params.id;
    const myId = req.user._id;

    console.log("reject request from ", userId);
    try {
        // Find the post by ID and delete it
        const result = await Friendship.findOneAndDelete({
                                            user: userId,
                                            friend: myId,
                                            status: 'pending'
                                        }).exec();
        if (!result) {
          console.log("request not found for rejection.");
          return res.redirect("/index");
        }
    
        console.log("friendRequest successfully rejected:", result);
        res.redirect("/index");
      } catch (error) {
        console.error("Error rejecting request:", error);
        res.redirect("/index");
      }
    

    res.redirect("/index");
});

exports.acceptRequest = asyncHandler(async(req, res, next) => {
    try {
        const userId = req.params.id;
        const myId = req.user._id;

        // Check if a pending friendship request already exists
        const existingFriendship = await Friendship.findOne({
            user: userId,
            friend: myId,
            status: 'pending'
        }).exec();
        // Friendship request already exists, update its status to "accepted"
        existingFriendship.status = 'accepted';
        await existingFriendship.save(); // Save the updated status
        res.redirect("/index");
    } catch (error) {
        // Handle any errors that may occur during the process
        next(error);
    }
})

exports.deleteFriend = asyncHandler(async(req, res, next) => {
    const userId = req.params.id;
    const myId = req.user._id;

    await Friendship.findOneAndDelete({
        user: myId,
        friend: userId,
        status: 'accepted'
    }).exec();

    await Friendship.findOneAndDelete({
        user: userId,
        friend: myId,
        status: 'accepted'
    }).exec();

    res.redirect("/index");
})