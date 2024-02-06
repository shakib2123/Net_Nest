import mongoose, { Document, Schema } from "mongoose";

interface FollowDocument extends Document {
  _id: string;
  followerId: string;
  followingId: string;
}
const FollowSchema = new mongoose.Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  followerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  followingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, required: true },
});

const FollowModel =
  mongoose.models.Follow || mongoose.model("Follow", FollowSchema);

export default FollowModel;
