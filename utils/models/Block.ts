import mongoose, { Schema } from "mongoose";

const BlockSchema = {
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
};

const BlockModel =
  mongoose.models.Block || mongoose.model("Block", BlockSchema);

export default BlockModel;
