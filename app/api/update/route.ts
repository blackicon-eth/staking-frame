import { NextRequest, NextResponse } from "next/server";
import { FrameActionDataParsedAndHubContext } from "frames.js";
import { getErrorFrame, getInvalidFidFrame, getUpdateFrame } from "@/app/lib/getFrame";
import { validateMessage } from "@/app/lib/utils";
import { Redis } from "@upstash/redis";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  // Getting the user data and validating it
  const data = await req.json();

  // Validating the frame message
  const { frameMessage, isValid }: { frameMessage: FrameActionDataParsedAndHubContext | undefined; isValid: boolean } =
    await validateMessage(data);
  if (!isValid || !frameMessage) {
    return getInvalidFidFrame();
  }

  // Get the action and uuid from parameters
  const action = req.nextUrl.searchParams.get("action")!;
  const uuid = req.nextUrl.searchParams.get("uuid")!;

  // Get the data from the Redis database
  const redis = new Redis({
    url: process.env.REDIS_URL!,
    token: process.env.REDIS_TOKEN!,
  });

  const redisResponse = await redis.get(uuid);

  if (!redisResponse) {
    console.log("No data found in Redis. Sending update frame.");
    return getUpdateFrame(uuid, action);
  }

  console.log("Redis response: ", redisResponse);

  // Delete the data from the Redis database
  await redis.del(uuid);

  return getUpdateFrame(uuid, action);
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
