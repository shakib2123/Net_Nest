import { StreamPlayer } from "@/components/stream-player";
import { getFollowersCount, getUserByUsername } from "@/lib/user-service";
import FollowModel from "@/utils/models/Follow";
import Stream from "@/utils/models/Stream";
import { currentUser } from "@clerk/nextjs";

interface CreatorPageProps {
  params: { username: string };
}

const CreatorPage = async ({ params }: CreatorPageProps) => {
  const externalUser = await currentUser();
  const user = await getUserByUsername(params.username);
  const stream = await Stream.findOne({ userId: user._id });
  const followersCount = await getFollowersCount();

  if (!user || user.externalUserId !== externalUser?.id || !stream) {
    throw new Error("Unauthorized");
  }

  return (
    <div className="h-full">
      <StreamPlayer
        user={user}
        stream={stream}
        isFollowing
        followedByCount={followersCount}
      />
    </div>
  );
};

export default CreatorPage;
