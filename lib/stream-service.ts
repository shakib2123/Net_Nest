import Stream from "@/utils/models/Stream";
import { revalidatePath } from "next/cache";

export const getStreamByUserId = async (userId: string) => {
  try {
    const stream = await Stream.findOne({ userId: userId });
    return stream;
  } catch (error) {
    revalidatePath("/");
    return;
  }
};

export const getStreamsIsLive = async () => {
  try {
    const streams = await Stream.find().select("isLive userId");
    return streams;
  } catch (error) {
    revalidatePath("/");
    return [];
  }
};
