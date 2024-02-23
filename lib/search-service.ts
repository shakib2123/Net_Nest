import BlockModel from "@/utils/models/Block";
import { getSelf } from "./auth-service";

import Stream from "@/utils/models/Stream";
import User from "@/utils/models/user";

export const getSearch = async (term?: string) => {
  let userId;

  try {
    const self = await getSelf();
    userId = self._id;
  } catch (error) {
    userId = null;
  }

  let users = [];
  let streams = [];

  if (userId) {
    const blockerUsers = await BlockModel.find({ blockedId: userId }).distinct(
      "blockerId"
    );
    users = await User.find({
      $and: [
        { _id: { $nin: blockerUsers } },
        {
          $or: [{ username: { $regex: term, $options: "i" } }],
        },
      ],
    }).sort({ isLive: "desc", updatedAt: "desc" });

    const userIds = users.map((user) => user._id);

    streams = await Stream.find({ userId: { $in: userIds } }).sort({
      isLive: "desc",
      updatedAt: "desc",
    });
  } else {
    users = await User.find({
      $or: [{ username: { $regex: term, $options: "i" } }],
    }).sort({ isLive: "desc", updatedAt: "desc" });

    const userIds = users.map((user) => user._id);

    streams = await Stream.find({ userId: { $in: userIds } }).sort({
      isLive: "desc",
      updatedAt: "desc",
    });
  }

  return { users, streams };
};
