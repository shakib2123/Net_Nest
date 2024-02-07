import connectDB from "@/utils/mongoose/db";
import User from "@/utils/models/user";

import { getSelf } from "./auth-service";
import { getFollowedUser } from "./follow-service";

export const getRecommended = async () => {
  let userId;
  try {
    const self = await getSelf();
    userId = self._id;
  } catch {
    userId = null;
  }

  let users = [];

  const followedUser = await getFollowedUser();
  const followedUsersId = followedUser.map((user) => user._id);

  if (userId) {
    
    users = await User.find().and([
      { _id: { $nin: [...followedUsersId, userId] } },
    ]);
  } else {
    users = await User.find().sort({ createdAt: "desc" });
  }

  return users;
};
