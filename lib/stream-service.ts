import Stream from "@/utils/models/Stream";

export const getStreamByUserId = async (userId: string) => {
  const stream = await Stream.findOne({ userId: userId });
  return stream;
};

export const getStreamsIsLive = async () => {
  const streams = await Stream.find().select("isLive userId");
  return streams;
};
