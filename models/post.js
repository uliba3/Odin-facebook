const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = ({
    author: { type: String, required: true},
    content: { type: String, required: true},
    postedDate: { type: Date },
    root: { type: Schema.Types.ObjectId, ref: "Post"},
});

// Export model
module.exports = mongoose.model("Post", PostSchema);