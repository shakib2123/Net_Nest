import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
const avatarSizes = cva("", {
  variants: {
    size: {
      default: "h-8 w-8",
      lg: "h-14 w-14",
    },
  },
  defaultVariants: {
    size: "default",
  },
});
interface UserAvatarProps extends VariantProps<typeof avatarSizes> {
  imageUrl: string;
  username: string;
  isLive?: boolean;
  showBatch?: boolean;
}

export const UserAvatar = ({
  imageUrl,
  username,
  isLive,
  showBatch,
  size,
}: UserAvatarProps) => {
  const canShowBatch = showBatch && isLive;
  return (
    <div>
      <Avatar
        className={cn(
          isLive && "ring-2 ring-red-500 border border-background",
          avatarSizes({ size })
        )}
      >
        <AvatarImage src={imageUrl} className="object-cover" />
        <AvatarFallback>
          {username[0]}
          {username[username.length - 1]}
        </AvatarFallback>
      </Avatar>
      {canShowBatch && (
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
          Live
        </div>
      )}
    </div>
  );
};
