//models/post.js
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = ({
    author: { type: Schema.Types.ObjectId, required: true},
    content: { type: String, required: true},
    date: { type: Date },
});

// Export model
module.exports = mongoose.model("Post", PostSchema);