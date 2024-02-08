import { currentUser } from "@clerk/nextjs";

import connectDB from "@/utils/mongoose/db";
import User from "@/utils/models/user";

export const getSelf = async () => {
  const self = await currentUser();
  if (!self || !self.username) {
    throw new Error("Unauthorized");
  }

  await connectDB();
  const user = await User.findOne({ externalUserId: self.id });
  if (!user) {
    throw new Error("Not found");
  }
  return user;
};

export const getSelfByUsername = async (username: string) => {
  const self = await getSelf();

  if (!self || !self.username) {
    throw new Error("Unauthorized");
  }

  const user = await User.findOne({ username });

  if (!user) {
    throw new Error("User not found");
  }

  if (self.username !== user.username) {
    throw new Error("Unauthorized");
  }

  return user;
};
