"use client";

import { ReceivedChatMessage } from "@livekit/components-react";

interface ChatListProps {
  messages: ReceivedChatMessage[];
  isHidden: boolean;
}

export const ChatList = ({}: ChatListProps) => {
  return <div>Chat List</div>;
};
