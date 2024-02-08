import User from "@/utils/models/user";
import { getSelf } from "./auth-service";
import BlockModel from "@/utils/models/Block";

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
    return false;
  }
};

export const blockUser = async (id: string) => {
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
  });
  await block.save();

  return otherUser;
};

export const unblockUser = async (id: string) => {
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
};
