"use client";

import { onFollow } from "@/actions/follow";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { toast } from "sonner";

interface ActionsProps {
  isFollowing: boolean;
  userId: string;
}

export const Actions = ({ isFollowing, userId }: ActionsProps) => {
  const [isPending, startTransition] = useTransition();

  const onclick = () => {
    startTransition(() => {
      onFollow(userId)
        .then((data) =>
          toast.success(`You are now following ${data.username}`)
        )
        .catch(() => toast.error("Something went wrong"));
    });
  };
  return (
    <Button
      disabled={isFollowing || isPending}
      onClick={onclick}
      variant="primary"
    >
      Follow
    </Button>
  );
};
