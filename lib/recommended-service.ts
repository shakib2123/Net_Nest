import connectDB from "@/utils/mongoose/db";
import User from "@/utils/models/user";

import { getSelf } from "./auth-service";
import { resolve } from "path";

export const getRecommended = async () => {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  await connectDB();
  const users = await User.find().sort({ createdAt: "desc" });

  return users;
};
