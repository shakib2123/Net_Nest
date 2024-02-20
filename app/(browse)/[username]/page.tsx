import { notFound } from "next/navigation";

import { getStreamByUserId } from "@/lib/stream-service";
import { getUserByUsername } from "@/lib/user-service";
import { isFollowingUser } from "@/lib/follow-service";
import { isBlockedByUser } from "@/lib/block-service";
import { StreamPlayer } from "@/components/stream-player";
import FollowModel from "@/utils/models/Follow";

interface UserPageProps {
  params: {
    username: string;
  };
}
const UserPage = async ({ params }: UserPageProps) => {
  const user = await getUserByUsername(params.username);
  const stream = await getStreamByUserId(user._id);

  const followedByCount = await FollowModel.find({
    followingId: user._id,
  }).countDocuments();

  if (!user || !stream) {
    notFound();
  }

  const isFollowing = await isFollowingUser(user._id);
  const isBlocked = await isBlockedByUser(user._id);

  if (isBlocked) {
    notFound();
  }

  return (
    <StreamPlayer
      user={user}
      stream={stream}
      isFollowing={isFollowing}
      followedByCount={followedByCount}
    />
  );
};

export default UserPage;






