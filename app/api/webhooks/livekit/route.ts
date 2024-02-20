import { headers } from "next/headers";
import { WebhookReceiver } from "livekit-server-sdk";

import Stream from "@/utils/models/Stream";
import connectDB from "@/utils/mongoose/db";

const receiver = new WebhookReceiver(
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!
);

export async function POST(req: Request) {
  const body = await req.text();
  const headerPayload = headers();
  const authorization = headerPayload.get("Authorization");

  if (!authorization) {
    console.log("There is an error");
    return new Response("No authorization header", { status: 400 });
  }

  const event = receiver.receive(body, authorization);

  console.log("Hello world", event.event);
  if (event.event === "ingress_started") {
    await connectDB();
    const filter = { ingressId: event.ingressInfo?.ingressId };
    const updatedData = { isLive: true };
    const options = { upsert: true };
    await Stream.findOneAndUpdate(filter, updatedData, options);
  }

  if (event.event === "ingress_ended") {
    await connectDB();
    const filter = { ingressId: event.ingressInfo?.ingressId };
    const updatedData = { isLive: false };
    const options = { upsert: true };
    await Stream.findOneAndUpdate(filter, updatedData, options);
  }
}

POST();
