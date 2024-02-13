"use client";

import User from "@/utils/models/user";
import Stream from "@/utils/models/Stream";

interface StreamPlayerProps {
  user: User;
  stream: Stream;
  isFollowing: boolean;
}

export const StreamPlayer = ({
  user,
  stream,
  isFollowing,
}: StreamPlayerProps) => {
  return <div>Stream player</div>;
};
