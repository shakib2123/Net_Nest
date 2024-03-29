import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },

  username: {
    type: String,
    unique: true,
    required: true,
  },

  imageUrl: {
    type: String,
  },

  externalUserId: {
    type: String,
    unique: true,
    required: true,
  },
  bio: {
    type: String,
  },

  following: [{ type: Schema.Types.ObjectId, ref: "Follow" }],
  followedBy: [{ type: Schema.Types.ObjectId, ref: "Follow" }],

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
