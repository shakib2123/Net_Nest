import User from "@/utils/models/user";
import connectDB from "@/utils/mongoose/db";

export const getUserByUsername = async (username: string) => {
  await connectDB();
  const user = await User.findOne({
    username: username,
  });
  return user;
};
