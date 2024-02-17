import FollowModel from "@/utils/models/Follow";
import User from "@/utils/models/user";
import connectDB from "@/utils/mongoose/db";
import { getSelf } from "./auth-service";

export const getUserByUsername = async (username: string) => {
  await connectDB();
  const user = await User.findOne({
    username: username,
  });

  return user;
};

export const getUserById = async (id: string) => {
  await connectDB();
  const user = await User.findOne({ _id: id });
  return user;
};

export const getFollowersCount = async () => {
  const self = await getSelf();
  const followersCount = await FollowModel.find({
    followingId: self._id,
  }).countDocuments();
  return followersCount;
};
