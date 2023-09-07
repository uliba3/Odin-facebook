//controllers/postController.js
const Post = require("../models/post");
const User = require("../models/user");
const Friendship = require("../models/friendship");
const { body, validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async(req, res, next) => {
  const myId = req.user._id;
  const userPosts = await Post.find({ author: myId }).exec();
  const friendUsers1 = await Friendship.find({user: myId, status: 'accepted'});
  const friendUsers2 = await Friendship.find({friend: myId, status: 'accepted'});
  const requestedUsers = await Friendship.find({user: myId, status: 'pending'});
  const requestFromUsers = await Friendship.find({friend: myId, status: 'pending'});

  const excludedUserIds = [
    myId, // Exclude the current user
    ...friendUsers1.map(friendship => friendship.friend),
    ...friendUsers2.map(friendship => friendship.user),
    ...requestedUsers.map(friendship => friendship.friend),
    ...requestFromUsers.map(friendship => friendship.user),
  ];

  const users = await User.find({ _id: { $nin: excludedUserIds } }).exec();

  // Your existing code to fetch userPosts, friendUsers, requestedUsers, and requestFromUsers

  res.render("index", {
    title: "Posts",
    posts: userPosts,
    friends1: friendUsers1,
    friends2: friendUsers2,
    requesteds: requestedUsers,
    requests: requestFromUsers,
    users: users, // Pass the excluded users to the template
  });
});

exports.index_post = [
    // Validate and sanitize fields.
    body("content", "Content must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        const today = new Date(); 
    
        // Create a Post object with escaped and trimmed data.
        const post = new Post({
          author: req.user._id,
          content: req.body.content,
          date: today,
        });
    
        if (!errors.isEmpty()) {
          // There are errors. Render form again with sanitized values/error messages.
          const userPosts = await Post.find({ author: req.user._id }).exec();
          res.render("index", {
            title: "Posts",
            posts: userPosts,
            errors: errors.array(),
          });
        } else {
          // Data from form is valid. Save book.
          await post.save();
          res.redirect("/index");
        }
      })
]

exports.delete_post = asyncHandler(async (req, res, next) => {
  const postId = req.params.id;
  //console.log("Attempting to delete post with ID:", postId);

  try {
    // Find the post by ID and delete it
    const result = await Post.findByIdAndDelete(postId).exec();
    if (!result) {
      console.log("Post not found for deletion.");
      return res.redirect("/index");
    }

    console.log("Post successfully deleted:", result);
    res.redirect("/index");
  } catch (error) {
    console.error("Error deleting post:", error);
    res.redirect("/index");
  }
});
