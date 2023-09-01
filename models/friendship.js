//models/friendship.js
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const FriendshipSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who initiated the friend request
    friend: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the friend being added
    status: { type: String, enum: ['sent', 'pending', 'accepted'], default: 'pending' }, // Friendship status
  });

// Export model
module.exports = mongoose.model("Friendship", FriendshipSchema);