import connectDB from "@/utils/mongoose/db";
import { getSelf } from "./auth-service";
import User from "@/utils/models/User";
import FollowModel from "@/utils/models/Follow";
import BlockModel from "@/utils/models/Block";
import { revalidatePath } from "next/cache";

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
    revalidatePath("/");
    return [];
  }
};

export const isFollowingUser = async (id: string) => {
  try {
    await connectDB();

    const self = await getSelf();

    const otherUser = await User.findOne({ _id: id });

    if (!otherUser) {
      revalidatePath("/");
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
    revalidatePath("/");
    return false;
  }
};

export const followUser = async (id: string) => {
  try {
    const self = await getSelf();

    const otherUser = await User.findOne({ _id: id });
    if (!otherUser) {
      revalidatePath("/");
      throw new Error("User not found.");
    }

    if (otherUser._id.toString() === self._id.toString()) {
      revalidatePath("/");
      throw new Error("Cannot follow yourself");
    }

    const existingFollow = await FollowModel.findOne({
      followerId: self._id,
      followingId: otherUser._id,
    });

    if (existingFollow) {
      revalidatePath("/");
      throw new Error("Already following");
    }

    const follow = await FollowModel.create({
      followerId: self._id,
      followingId: otherUser._id,
    });
    await follow.save();

    return otherUser;
  } catch (error) {
    revalidatePath("/");
    return null;
  }
};

export const unfollowUser = async (id: string) => {
  try {
    const self = await getSelf();
    const otherUser = await User.findOne({
      _id: id,
    });

    if (!otherUser) {
      revalidatePath("/");
      throw new Error("User not found");
    }

    if (otherUser._id.toString() === self._id.toString()) {
      revalidatePath("/");
      throw new Error("Cannot unfollow yourself");
    }

    const existingFollow = await FollowModel.findOne({
      followerId: self.id,
      followingId: otherUser.id,
    });

    if (!existingFollow) {
      revalidatePath("/");
      throw new Error("Not following");
    }
    await FollowModel.deleteOne({ _id: existingFollow._id });

    return otherUser;
  } catch (error) {
    revalidatePath("/");
    return null;
  }
};
