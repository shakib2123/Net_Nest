import { headers } from "next/headers";
import { WebhookReceiver } from "livekit-server-sdk";
import Stream from "@/utils/models/Stream";

const receiver = new WebhookReceiver(
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!
);

export async function POST(req: Request) {
  const body = await req.text();
  const headerPayload = headers();
  const authorization = headerPayload.get("Authorization");

  if (!authorization) {
    return new Response("No authorization header", { status: 400 });
  }

  const event = receiver.receive(body, authorization);

  if (event.event === "ingress_started") {
    const filter = { ingressId: event.ingressInfo?.ingressId };
    const updatedData = { isLive: true };
    const options = { upsert: true };
    await Stream.findOneAndUpdate(filter, updatedData, options);
  }

  if (event.event === "ingress_ended") {
    const filter = { ingressId: event.ingressInfo?.ingressId };
    const updatedData = { isLive: false };
    const options = { upsert: true };
    await Stream.findOneAndUpdate(filter, updatedData, options);
  }
}
