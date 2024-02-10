import Stream from "@/utils/models/Stream";

export const getStreamByUserId = async (userId: string) => {
  const stream = await Stream.findOne({ userId: userId });
  return stream;
};