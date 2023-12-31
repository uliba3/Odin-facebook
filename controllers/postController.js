//controllers/postController.js
const Post = require("../models/post");
const User = require("../models/user");
const Friendship = require("../models/friendship");
const { body, validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async(req, res, next) => {
  const myId = req.user._id;
  const myUserName = req.user.username;
  const friendUsers1Friendship = await Friendship.find({user: myId, status: 'accepted'});
  const friendUsers2Friendship = await Friendship.find({friend: myId, status: 'accepted'});
  const requestedUsersFriendship = await Friendship.find({user: myId, status: 'pending'});
  const requestFromUsersFriendship = await Friendship.find({friend: myId, status: 'pending'});

  const friendUsers1Ids = friendUsers1Friendship.map(friendship => friendship.friend);
  const friendUsers2Ids = friendUsers2Friendship.map(friendship => friendship.user);
  const requestedUsersIds = requestedUsersFriendship.map(friendship => friendship.friend);
  const requestFromUsersIds = requestFromUsersFriendship.map(friendship => friendship.user);

  // Fetch user information for friendUsers1
  const friendUsers1 = await User.find({ _id: { $in: friendUsers1Ids } }).exec();

  // Fetch user information for friendUsers2
  const friendUsers2 = await User.find({ _id: { $in: friendUsers2Ids } }).exec();

  // Fetch user information for requestedUsers
  const requestedUsers = await User.find({ _id: { $in: requestedUsersIds } }).exec();

  // Fetch user information for requestFromUsers
  const requestFromUsers = await User.find({ _id: { $in: requestFromUsersIds } }).exec();


  const excludedUserIds = [
    myId, // Exclude the current user
    ...friendUsers1.map(user => user._id ),
    ...friendUsers2.map(user => user._id ),
    ...requestedUsers.map(user => user._id ),
    ...requestFromUsers.map(user => user._id ),
  ];

  const users = await User.find({ _id: { $nin: excludedUserIds } }).exec();
  /*console.log("posts: ", userPosts);
  
  console.log("friends1: ", friendUsers1);
  console.log("friendUsers2: ", friendUsers2);
  console.log("requestedUsers: ", requestedUsers);
  console.log("requestFromUsers: ", requestFromUsers);
  console.log("users: ", users);*/

  const friendsIds = [
    ...friendUsers1.map(user => user._id ),
    ...friendUsers2.map(user => user._id ),
  ]
  //console.log("friendsIds: ", friendsIds);

  const myPosts = await Post.find({author: myId}).exec();

  const myUser = await User.find({_id: myId }).exec();

  myPosts.sort((a, b) => b.date - a.date);

  res.render("index", {
    title: "Friends' posts",
    myUserName: myUserName,
    friends1: friendUsers1,
    friends2: friendUsers2,
    requesteds: requestedUsers,
    requests: requestFromUsers,
    users: users, // Pass the excluded users to the template
    myPosts: myPosts,
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
          authorName: req.user.username,
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

exports.friendsPosts = asyncHandler(async(req, res, next) => {
  const myId = req.user._id;
  const myUserName = req.user.username;

  const friendUsers1Friendship = await Friendship.find({user: myId, status: 'accepted'});
  const friendUsers2Friendship = await Friendship.find({friend: myId, status: 'accepted'});

  const friendUsers1Ids = friendUsers1Friendship.map(friendship => friendship.friend);
  const friendUsers2Ids = friendUsers2Friendship.map(friendship => friendship.user);

  const friendUsers1 = await User.find({ _id: { $in: friendUsers1Ids } }).exec();
  const friendUsers2 = await User.find({ _id: { $in: friendUsers2Ids } }).exec();

  const friendsIds = [
    ...friendUsers1.map(user => user._id ),
    ...friendUsers2.map(user => user._id ),
  ]

  const friendsPosts = await Post.find({ author: { $in: friendsIds } }).exec();
  // Your existing code to fetch userPosts, friendUsers, requestedUsers, and requestFromUsers

  friendsPosts.sort((a, b) => b.date - a.date);

  res.render("friendsPosts", {
    title: "Friends' posts",
    myUserName: myUserName,
    friends1: friendUsers1,
    friends2: friendUsers2,
    friendsPosts: friendsPosts,
  });
});

exports.friendPosts = asyncHandler(async(req, res, next) => {
  const friendId = req.params.id;
  //console.log(friendId);
  const friend = await User.findOne({_id: friendId}).exec();
  console.log(friend);
  const friendName = friend.username;
  console.log(friend.username);
  const friendPosts = await Post.find({author: friendId}).exec();
  friendPosts.sort((a, b) => b.date - a.date);
  res.render("friendPosts", {
    title: "Friend's posts",
    friendName: friendName,
    friendPosts: friendPosts,
  })
});