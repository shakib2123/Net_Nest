import { currentUser } from "@clerk/nextjs";

import connectDB from "@/utils/mongoose/db";
import User from "@/utils/models/user";

export const getSelf = async () => {
  const self = await currentUser();
  if (!self || !self.username) {
    throw new Error("Unauthorized");
  }

  await connectDB();
  const user = await User.find({ externalUserId: self.id });
  if (!user) {
    throw new Error("Not found");
  }
  return user;
};
