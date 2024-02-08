import connectDB from "@/utils/mongoose/db";
import { getSelf } from "./auth-service";
import User from "@/utils/models/user";
import FollowModel from "@/utils/models/Follow";
import mongoose from "mongoose";
import BlockModel from "@/utils/models/Block";

export const getFollowedUser = async () => {
  try {
    const self = await getSelf();
    const followedUsers = await FollowModel.find({
      followerId: self._id,
    }).exec();
    const followingIdObjectIds = followedUsers.map((user) => user.followingId);

    const blockedUsers = await BlockModel.find({
      blockedId: self._id,
    });
    const blockedUsersIds = blockedUsers.map((user) => user.blockerId);

    const followedUserById = await User.find({
      _id: {
        $in: followingIdObjectIds,
        $nin: blockedUsersIds,
      },
    });

    return followedUserById;
  } catch {
    return [];
  }
};

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
  console.log("Hello world", otherUser);
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
    followerId: self._id,
    followingId: otherUser._id,
  });
  await follow.save();

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
  await FollowModel.deleteOne({ _id: existingFollow._id });

  return otherUser;
};
