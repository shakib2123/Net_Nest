import mongoose, { Schema } from "mongoose";

const BlockSchema = new mongoose.Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  blockerId: {
    type: String,
    required: true,
  },
  blockedId: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});
const BlockModel =
  mongoose.models.Block || mongoose.model("Block", BlockSchema);

export default BlockModel;
