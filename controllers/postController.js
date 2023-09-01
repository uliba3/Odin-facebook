//controllers/postController.js
const Post = require("../models/post");
const { body, validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async(req, res, next) => {
    const allPosts = await Post.find().exec();

    res.render("index", {title: "Posts", posts: allPosts});
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
    
        // Create a Book object with escaped and trimmed data.
        const post = new Post({
          author: req.user._id,
          content: req.body.content,
          date: today,
        });
    
        if (!errors.isEmpty()) {
          // There are errors. Render form again with sanitized values/error messages.
          const allPosts = await Post.find().exec();
          res.render("index", {
            title: "Posts",
            posts: allPosts,
            errors: errors.array(),
          });
        } else {
          // Data from form is valid. Save book.
          await post.save();
          res.redirect("/:username");
        }
      })
]

exports.delete_post = asyncHandler(async (req, res, next) => {
  const postId = req.params.id;
  console.log("Attempting to delete post with ID:", postId);

  try {
    // Find the post by ID and delete it
    const result = await Post.findByIdAndDelete(postId).exec();
    if (!result) {
      console.log("Post not found for deletion.");
      return res.redirect("/");
    }

    console.log("Post successfully deleted:", result);
    res.redirect("/");
  } catch (error) {
    console.error("Error deleting post:", error);
    res.redirect("/");
  }
});
