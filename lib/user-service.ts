import User from "@/utils/models/User";
import { connectDB } from "@/utils/mongoose/db";

import { revalidatePath } from "next/cache";

export const getUserByUsername = async (username: string) => {
  try {
    await connectDB();
    const user = await User.findOne({
      username: username,
    });

    return user;
  } catch (error) {
    revalidatePath("/");
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    await connectDB();
    const user = await User.findOne({ _id: id });
    return user;
  } catch (error) {
    revalidatePath("/");
    return null;
  }
};
