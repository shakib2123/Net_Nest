import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import connectDB from "@/utils/mongoose/db";
import User from "@/utils/models/User";
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

      // Create a new post instance
      const newUser = new User({
        externalUserId: payload.data.id,
        username: payload.data.username,
        imageUrl: payload.data.image_url,
      });

      // Save the new post to the database
      await newUser.save();

      console.log("User created successfully");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  }

  if (eventType === "user.updated") {
    try {
      // await connectDB();
      // Find the document
      const user = await User.findOne({ externalUserId: payload.data.id });
      if (!user) {
        console.log("User not found");
        return;
      }
      // Update the document
      user.username = payload.data.username;
      user.imageUrl = payload.data.image_url;
      // Save the updated document
      await user.save();
      console.log("User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }

  if (eventType === "user.deleted") {
    try {
      const user = await User.findOne({ externalUserId: payload.data.id });
      await user?.deleteOne();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }

  return new Response("", { status: 200 });
}
