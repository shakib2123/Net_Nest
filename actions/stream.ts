"use server";

import Stream from "@/utils/models/Stream";
import { revalidatePath } from "next/cache";
import { getSelf } from "@/lib/auth-service";

export const updateStream = async (values: Partial<Stream>) => {
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

    // Use $set operator and new option to update and return the stream
    const stream = await Stream.updateOne(
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
