// controllers/friendshipController.js
const Post = require("../models/post");
const User = require("../models/user");
const Friendship = require("../models/friendship");
const { body, validationResult } = require("express-validator");

const Friendship = require('./models/friendship'); // Import the Friendship model

exports.request = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user._id; // Assuming req.user contains the logged-in user's information
    const requestFriendId = req.params.id; // Assuming this is the friend's ID obtained from the URL parameter

    // Check if there's an existing friend request or friendship
    const existingFriendship = await Friendship.findOne({
      $or: [
        { user: userId, friend: requestFriendId },
        { user: requestFriendId, friend: userId }
      ]
    }).exec();

    if (existingFriendship) {
      // You might want to handle this case, like sending an error response
      return res.status(400).json({ message: 'Friend request or friendship already exists.' });
    }

    // Create a new friendship document to represent the friend request
    const friendship = new Friendship({
      user: userId,
      friend: requestFriendId,
      status: 'sent' // Friendship status
    });

    // Save the friendship document to the database
    await friendship.save();

    return res.status(200).json({ message: 'Friend request sent successfully.' });
  } catch (error) {
    // Handle any errors that occur during the process
    return res.status(500).json({ message: 'Error sending friend request.', error: error.message });
  }
});


const asyncHandler = require("express-async-handler");