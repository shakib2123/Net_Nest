import { createUploadthing, type FileRouter } from "uploadthing/next";

import { getSelf } from "@/lib/auth-service";
import Stream from "@/utils/models/Stream";

const f = createUploadthing();

export const ourFileRouter = {
  thumbnailUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const self = await getSelf();
      return { user: self };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await Stream.findOneAndUpdate(
        { userId: metadata.user._id },
        { thumbnailUrl: file.url },
        { upsert: true }
      );

      return { fileUrl: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
