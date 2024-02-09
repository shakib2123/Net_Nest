import User from "@/utils/models/user";

import { getSelf } from "./auth-service";
import { getFollowedUser } from "./follow-service";
import BlockModel from "@/utils/models/Block";

export const getRecommended = async () => {
  let userId;
  try {
    const self = await getSelf();
    userId = self._id;
  } catch {
    userId = null;
  }

  let users = [];

  try {
    const followedUser = await getFollowedUser();
    const followedUsersId = followedUser.map((user) => user._id);
    const blockedUsers = await BlockModel.find({
      blockedId: userId,
    });

    const blockedUsersIds = blockedUsers.map((user) => user.blockerId);

    if (userId) {
      users = await User.find().and([
        { _id: { $nin: [...followedUsersId, userId, ...blockedUsersIds] } },
      ]);
    } else {
      users = await User.find().sort({ createdAt: "desc" });
    }

    return users;
  } catch (error) {
    return (users = []);
  }
};
