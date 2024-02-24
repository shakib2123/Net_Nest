"use server";

import Stream from "@/utils/models/Stream";
import { revalidatePath } from "next/cache";
import { getSelf } from "@/lib/auth-service";

export const updateStream = async (values: any) => {
  try {
    const self = await getSelf();
    const selfStream = await Stream.findOne({ userId: self._id });

    if (!selfStream) {
      throw new Error("Stream not found");
    }

    const validData = {
      name: values.name,
      isChatEnabled: values.isChatEnabled,
      isChatFollowersOnly: values.isChatFollowersOnly,
      isChatDelayed: values.isChatDelayed,
      thumbnailUrl: values.thumbnailUrl,
    };

    const stream = await Stream.findOneAndUpdate(
      { _id: selfStream._id },
      { $set: validData },
      { upsert: true, new: true }
    );

    revalidatePath(`/u/${self.username}/chat`);
    revalidatePath(`/u/${self.username}`);
    revalidatePath(`/${self.username}`);

    return stream;
  } catch (error) {
    throw new Error("Internal Error");
  }
};
