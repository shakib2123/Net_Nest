import { isFollowingUser } from "@/lib/follow-service";
import { getUserByUsername } from "@/lib/user-service";
import { notFound } from "next/navigation";
import { Actions } from "./_components/actions";

interface UserPageProps {
  params: {
    username: string;
  };
}
const UserPage = async ({ params }: UserPageProps) => {
  const user = await getUserByUsername(params.username);

  if (!user) {
    notFound();
  }
  const isFollowing = await isFollowingUser(user._id);
  

  return (
    <div className="flex flex-col gap-y-4">
      <p>Username : {user?.username}</p>
      <p>User ID: {user?._id}</p>
      <p>is following: {`${isFollowing}`}</p>
      <Actions userId={user._id} isFollowing={isFollowing} />
    </div>
  );
};

export default UserPage;