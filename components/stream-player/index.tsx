"use client";

import User from "@/utils/models/user";
import Stream from "@/utils/models/Stream";

import { useChatSidebar } from "@/store/use-chat-sidebar";
import { cn } from "@/lib/utils";

import { LiveKitRoom } from "@livekit/components-react";
import { useViewerToken } from "@/hooks/use-viewer-token";
import { Video } from "./video";
import { Chat } from "./chat";
import { ChatToggle } from "./chat-toggle";

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
  const { token, name, identity } = useViewerToken(user?._id);

  const { collapsed } = useChatSidebar((state) => state);

  if (!token || !name || !identity) {
    return <div>Cannot watch the stream</div>;
  }

  return (
    <>
      {collapsed && (
        <div className="hidden lg:block fixed top-[100px] right-2 z-50">
          <ChatToggle />
        </div>
      )}
      <LiveKitRoom
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WS_URL}
        className={cn(
          "grid grid-cols-1 lg:gap-y-0 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 h-full",
          collapsed && "lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2"
        )}
      >
        <div className="space-y-4 col-span-1 lg:col-span-2 xl:col-span-2 2xl:col-span-5 lg:overflow-y-auto hidden-scrollbar pb-10">
          <Video hostName={user?.username} hostIdentity={user?._id} />
        </div>

        {/* chat bar */}
        <div className={cn("col-span-1", collapsed && "hidden")}>
          <Chat
            viewerName={name}
            hostName={user.username}
            hostIdentity={user._id}
            isFollowing={isFollowing}
            isChatEnabled={stream.isChatEnabled}
            isChatDelayed={stream.isChatDelayed}
            isChatFollowersOnly={stream.isChatFollowersOnly}
          />
        </div>
      </LiveKitRoom>
    </>
  );
};
