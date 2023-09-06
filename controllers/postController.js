//controllers/postController.js
const Post = require("../models/post");
const User = require("../models/user");
const Friendship = require("../models/friendship");
const { body, validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async(req, res, next) => {
    const userPosts = await Post.find({ author: req.user._id }).exec();
    const friendUsers = await Friendship.find({ 
      $or: [
        {user: req.user._id, status: 'accepted'},
        { friendId: req.user._id, status: 'accepted'}
      ] 
    });
    const requestedUsers = await Friendship.find({user: req.user._id, status: 'pending'});
    const requestFromUsers = await Friendship.find({friendId: req.user._id, status: 'pending'});

    const excludedUserIds = [
      req.user._id, // Exclude the current user
      ...friendUsers.map(friendship => friendship.friend),
      ...requestedUsers.map(friendship => friendship.friend),
      ...requestFromUsers.map(friendship => friendship.user),
    ];
  
    const users = await User.find({ _id: { $nin: excludedUserIds } }).exec();
  
    // Your existing code to fetch userPosts, friendUsers, requestedUsers, and requestFromUsers
  
    res.render("index", {
      title: "Posts",
      posts: userPosts,
      friends: friendUsers,
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
