"use client";

import { onFollow, onUnfollow } from "@/actions/follow";
import { onUnblock } from "@/actions/block";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { toast } from "sonner";

interface ActionsProps {
  isFollowing: boolean;
  userId: string;
}

export const Actions = ({ isFollowing, userId }: ActionsProps) => {
  const [isPending, startTransition] = useTransition();
  
  const handleFollow = () => {
    startTransition(() => {
      onFollow(userId)
        .then((data) => toast.success(`You are now following ${data?.username}`))
        .catch(() => toast.error("Something went wrong"));
    });
  };
  const handleUnfollow = () => {
    startTransition(() => {
      onUnfollow(userId)
        .then((data) => toast.success(`You have unfollowed ${data?.username}`))
        .catch(() => toast.error("Something went wrong"));
    });
  };

  const onclick = () => {
    if (isFollowing) {
      handleUnfollow();
    } else {
      handleFollow();
    }
  };

  const handleBlock = () => {
    startTransition(() => {
      onUnblock(userId)
        .then((data) => toast.success(`Unblocked the user ${data?.username}`))
        .catch(() => toast.error("Something went wrong"));
    });
  };
  return (
    <>
      <Button disabled={isPending} onClick={onclick} variant="primary">
        {isFollowing ? "Unfollow" : "Follow"}
      </Button>
      <Button onClick={handleBlock} disabled={isPending}>
        Unlock
      </Button>
    </>
  );
};
