"use server";
import { getSelf } from "@/lib/auth-service";
import { blockUser, unblockUser } from "@/lib/block-service";
import { RoomServiceClient } from "livekit-server-sdk";
import { revalidatePath } from "next/cache";

const roomService = new RoomServiceClient(
  process.env.LIVEKIT_API_URL!,
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!
);

export const onBlock = async (id: string) => {
  try {
    const self = await getSelf();

    let blockedUser;

    try {
      blockedUser = await blockUser(id);
    } catch {
      // It mean user mean is a guest
    }

    try {
      await roomService.removeParticipant(self._id, id);
    } catch {
      // User is not in stream
    }

    revalidatePath(`/user/${self.username}/community`);

    return blockedUser;
  } catch (error) {
    revalidatePath("/");
    return null;
  }
};

export const onUnblock = async (id: string) => {
  try {
    const self = await getSelf();
    const unblockedUser = await unblockUser(id);

    revalidatePath(`/u/${self.username}/community`);

    return unblockedUser;
  } catch (error) {
    revalidatePath("/");
    return null;
  }
};
