const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = ({
    author: { type: Schema.Types.ObjectId, ref: "Author", required: true},
    content: { type: String, required: true},
    postedDate: { type: Date},
});

// Export model
module.exports = mongoose.model("Post", PostSchema);