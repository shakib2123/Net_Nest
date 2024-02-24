import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import connectDB from "@/utils/mongoose/db";
import User from "@/utils/models/User";
import Stream from "@/utils/models/Stream";
import { resetIngresses } from "@/actions/ingress";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    try {
      // Connect to the MongoDB database
      await connectDB();

      // Find the user in the database
      const user = await User.findOne({ username: payload.data.username });
      if (user) {
        throw new Error("User already created");
      } else {
        // Create a new user instance
        const newUser = await User.create({
          externalUserId: payload.data.id,
          username: payload.data.username,
          imageUrl: payload.data.image_url,
        });

        // Create a new stream instance associated with the user
        await Stream.create({
          name: `${payload.data.username}'s stream`,
          userId: newUser._id,
        });
      }
    } catch (error) {
      throw new Error("Something went wrong");
    }
  }

  if (eventType === "user.updated") {
    try {
      // Find the document
      const user = await User.findOne({ externalUserId: payload.data.id });
      if (!user) {
        throw new Error("User not found");
      }

      const filter = { externalUserId: payload.data.id };
      const updatedData = {
        username: payload.data.username,
        imageUrl: payload.data.image_url,
        updatedAt: Date.now(),
      };
      const option = {
        upsert: true,
      };

      await User.findOneAndUpdate(filter, updatedData, option);

      await Stream.findOneAndUpdate(
        { userId: user._id },
        { name: `${user.username}'s stream` },
        { upsert: true }
      );
    } catch (error) {
      throw new Error("Something went wrong");
    }
  }

  if (eventType === "user.deleted") {
    await resetIngresses(payload.data.id);
    await User.deleteOne({ externalUserId: payload.data.id });
  }

  return new Response("", { status: 200 });
}
