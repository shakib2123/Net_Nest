import mongoose, { Schema } from "mongoose";

const FollowSchema = new mongoose.Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  followerId: {
    type: String,
    ref: "User",
    required: true,
  },
  followingId: {
    type: String,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

const FollowModel =
  mongoose.models.Follow || mongoose.model("Follow", FollowSchema);

export default FollowModel;
