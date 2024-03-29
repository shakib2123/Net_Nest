import User from "@/utils/models/User";
import { getSelf } from "./auth-service";
import BlockModel from "@/utils/models/Block";
import { revalidatePath } from "next/cache";

export const isBlockedByUser = async (id: string) => {
  try {
    const self = await getSelf();

    const otherUser = await User.findOne({ _id: id });

    if (!otherUser) {
      throw new Error("User not found");
    }

    if (otherUser._id === self._id) {
      return false;
    }

    const isExistBlock = await BlockModel.findOne({
      blockerId: otherUser._id,
      blockedId: self._id,
    });

    return !!isExistBlock;
  } catch {
    revalidatePath("/");
    return false;
  }
};

export const blockUser = async (id: string) => {
  try {
    const self = await getSelf();

    if (self._id === id) {
      throw new Error("Cannot block yourself");
    }

    const otherUser = await User.findOne({ _id: id });
    if (!otherUser) {
      throw new Error("User not found");
    }

    const existingBlock = await BlockModel.findOne({
      blockerId: self._id,
      blockedId: otherUser._id,
    });
    if (existingBlock) {
      throw new Error("Already blocked");
    }

    const block = await BlockModel.create({
      blockerId: self._id,
      blockedId: otherUser._id,
      createdAt: Date.now(),
    });
    await block.save();

    return otherUser;
  } catch (error) {
    revalidatePath("/");
    throw new Error("Something went wrong");
  }
};

export const unblockUser = async (id: string) => {
  try {
    const self = await getSelf();

    if (self._id === id) {
      throw new Error("Cannot unblock yourself");
    }

    const otherUser = await User.findOne({ _id: id });

    if (!otherUser) {
      throw new Error("User not found");
    }

    const existingBlock = await BlockModel.findOne({
      blockerId: self._id,
      blockedId: otherUser._id,
    });

    if (!existingBlock) {
      throw new Error("Not blocked");
    }

    await BlockModel.deleteOne({
      _id: existingBlock._id,
    });

    return otherUser;
  } catch (error) {
    revalidatePath("/");
    throw new Error("Something went wrong");
  }
};

export const getBlockedUsers = async () => {
  try {
    const self = await getSelf();

    const blockedUsersIds = await BlockModel.find({ blockerId: self._id });

    const blockedIds = blockedUsersIds.map(
      (blockedUser) => blockedUser.blockedId
    );

    const blockedUsers = await User.find({ _id: { $in: blockedIds } });

    return { blockedUsersIds, blockedUsers };
  } catch (error) {
    revalidatePath("/");
    throw new Error("Something went wrong");
  }
};
