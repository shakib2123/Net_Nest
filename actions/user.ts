"use server";

import User from "@/utils/models/user";
import { getSelf } from "@/lib/auth-service";
import { revalidatePath } from "next/cache";

type User = any;

export const updateUser = async (values: Partial<User>) => {
  const self = await getSelf();

  const filter = { _id: self._id };

  const validData = {
    bio: values.bio,
  };

  const options = {
    upsert: true,
    new: true,
  };

  const user = await User.findOneAndUpdate(filter, validData, options);

  revalidatePath(`/${self.username}`);
  revalidatePath(`/u/${self.username}`);

  return user;
};
