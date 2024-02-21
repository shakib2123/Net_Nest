import mongoose from "mongoose";
import { Schema } from "mongoose";

const StreamSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  name: { type: String, required: true },
  thumbnailUrl: { type: String },
  ingressId: { type: String, unique: true },
  serverUrl: { type: String },
  streamKey: { type: String },
  isLive: { type: Boolean, default: false },
  isChatEnabled: { type: Boolean, default: true },
  isChatDelayed: { type: Boolean, default: false },
  isChatFollowersOnly: { type: Boolean, default: false },
  userId: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Stream = mongoose.models.Stream || mongoose.model("Stream", StreamSchema);

export default Stream;
