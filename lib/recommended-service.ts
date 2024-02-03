import connectDB from "@/utils/mongoose/db";
import User from "@/utils/models/user";

import { getSelf } from "./auth-service";

export const getRecommended = async () => {
  await connectDB();
  const users = await User.find().sort({ createdAt: "desc" });

  return users;
};
