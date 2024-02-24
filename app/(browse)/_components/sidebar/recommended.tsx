"use client";
import { useSidebar } from "@/store/use-sidebar";
import User from "../../../../utils/models/User";
import Stream from "@/utils/models/Stream";
import { UserItem, UserItemSkeleton } from "./user-item";

type Stream = any;
type User = any;
interface RecommendedProps {
  data: User[];
  streams: Stream | null;
}

export const Recommended = ({ data, streams }: RecommendedProps) => {
  const { collapsed } = useSidebar((state: any) => state);
  const showLabel = !collapsed && data.length > 0;

  const streamMap = streams.reduce((map: any, stream: any) => {
    map[stream.userId] = stream;
    return map;
  }, {});

  return (
    <div>
      {showLabel && (
        <div className="pl-6 mb-4">
          <p className="text-sm text-muted-foreground">Recommended</p>
        </div>
      )}
      <ul className="space-y-2 px-2">
        {data.map((user) => (
          <UserItem
            key={user._id}
            username={user.username}
            imageUrl={user.imageUrl}
            isLive={streamMap[user._id]?.isLive}
          />
        ))}
      </ul>
    </div>
  );
};

export const RecommendedSkeleton = () => {
  return (
    <ul className="px-2">
      {[...Array(7)].map((_, i) => (
        <UserItemSkeleton key={i} />
      ))}
    </ul>
  );
};
