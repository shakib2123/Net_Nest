import User from "@/utils/models/User";
import connectDB from "@/utils/mongoose/db";

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
