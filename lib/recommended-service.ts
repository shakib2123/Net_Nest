import connectDB from "@/utils/mongoose/db";
import User from "@/utils/models/user";

import { getSelf } from "./auth-service";
import { resolve } from "path";

export const getRecommended = async () => {
  let userId;
  try {
    const self = await getSelf();
    userId = self._id;
  } catch {
    userId = null;
  }

  await connectDB();

  let users = [];

  if (userId) {
    users = await User.find({ _id: { $ne: userId } }).sort({
      createdAt: "desc",
    });
  } else {
    users = await User.find().sort({ createdAt: "desc" });
  }

  return users;
};
