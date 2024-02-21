import { getSelf } from "@/lib/auth-service";
import BlockModel from "@/utils/models/Block";
import Stream from "@/utils/models/Stream";
import User from "@/utils/models/user";

export const getStreams = async () => {
  let userId;

  try {
    const self = await getSelf();
    userId = self._id;
  } catch {
    userId = null;
  }

  let users = [];
  let streams = [];

  if (userId) {
    const blockedUsers = await BlockModel.find({ blockedId: userId }).distinct(
      "blockedId"
    );
    users = await User.find({ _id: { $nin: blockedUsers } });
    streams = await Stream.find({ userId: { $nin: blockedUsers } })
      .select("isLive name thumbnailUrl userId")
      .sort({ isLive: "desc", updatedAt: "desc" });
  } else {
    users = await User.find();
    streams = await Stream.find()
      .select("isLive name thumbnailUrl userId")
      .sort({ isLive: "desc", updatedAt: "desc" });
  }

  return { users, streams };
};
