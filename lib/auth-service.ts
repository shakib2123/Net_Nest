import { currentUser } from "@clerk/nextjs";

import User from "@/utils/models/User";
import { connectDB } from "@/utils/mongoose/db";

export const getSelf = async () => {
  await connectDB();
  const self = await currentUser();
  if (!self || !self.username) {
    throw new Error("Unauthorized");
  }

  const user = await User.findOne({ externalUserId: self.id });
  if (!user) {
    throw new Error("Not found");
  }
  return user;
};

export const getSelfByUsername = async (username: string) => {
  await connectDB();
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
