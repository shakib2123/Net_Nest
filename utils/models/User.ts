import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  title: string;
  description: string;
}

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

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

const User: Model<IUser> =
  mongoose.models.Users || mongoose.model<IUser>("Users", userSchema);

export default User;
