"use server";

import { followUser, unfollowUser } from "@/lib/follow-service";
import { revalidatePath } from "next/cache";

export const onFollow = async (id: string) => {
  try {
    const followedUser = await followUser(id);

    revalidatePath("/");
    if (followedUser) {
      revalidatePath(`/${followedUser.username}`);
    }

    return followedUser;
  } catch (error) {
    throw new Error("Internal error");
  }
};

export const onUnfollow = async (id: string) => {
  try {
    const unFollowedUser = await unfollowUser(id);
    revalidatePath("/");
    if (unFollowedUser) {
      revalidatePath(`/${unFollowedUser.username}`);
    }
    return unFollowedUser;
  } catch (error) {
    throw new Error("Internal error");
  }
};
