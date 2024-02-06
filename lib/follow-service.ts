import connectDB from "@/utils/mongoose/db";
import { getSelf } from "./auth-service";
import User from "@/utils/models/user";
import FollowModel from "@/utils/models/Follow";

export const isFollowingUser = async (id: string) => {
  try {
    await connectDB();

    const self = await getSelf();

    const otherUser = await User.findOne({ _id: id });

    if (!otherUser) {
      throw new Error("User not found.");
    }
    if (self._id.toString() === otherUser._id.toString()) {
      return true;
    }

    const isExistingFollow = await FollowModel.findOne({
      followerId: self._id,
      followingId: otherUser._id,
    });
    return !!isExistingFollow;
  } catch {
    return false;
  }
};

export const followUser = async (id: string) => {
  const self = await getSelf();

  const otherUser = await User.findOne({ _id: id });

  if (!otherUser) {
    throw new Error("User not found.");
  }

  if (otherUser._id.toString() === self._id.toString()) {
    throw new Error("Cannot follow yourself");
  }

  const existingFollow = await FollowModel.findOne({
    followerId: self._id,
    followingId: otherUser._id,
  });

  if (existingFollow) {
    throw new Error("Already following");
  }

  const follow = await FollowModel.create({
    followerId: self.id,
    followingId: otherUser.id,
  });

  await follow.save();
  console.log("Hello world", otherUser.username);
  return otherUser;
};

export const unfollowUser = async (id: string) => {
  const self = await getSelf();
  const otherUser = await User.findOne({
    _id: id,
  });

  if (!otherUser) {
    throw new Error("User not found");
  }

  if (otherUser._id.toString() === self._id.toString()) {
    throw new Error("Cannot unfollow yourself");
  }

  const existingFollow = await FollowModel.findOne({
    followerId: self.id,
    followingId: otherUser.id,
  });

  if (!existingFollow) {
    throw new Error("Not following");
  }
  const follow = await FollowModel.deleteOne({ _id: existingFollow._id });
  console.log("Hello world ", follow);

  return otherUser;
};
