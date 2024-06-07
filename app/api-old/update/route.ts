import { NextRequest, NextResponse } from "next/server";
import { getInvalidFrame, getKnowledgeFrame, getUpdateFrame } from "@/app/lib/getFrame";
import { Redis } from "@upstash/redis";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  // Getting the user data and validating it
  const data = await req.json();

  // Get the action, count and uuid from parameters
  const action = req.nextUrl.searchParams.get("action")!;
  const uuid = req.nextUrl.searchParams.get("uuid")!;
  const count = req.nextUrl.searchParams.get("count")!;

  // Get the data from the Redis database
  const redis = new Redis({
    url: process.env.REDIS_URL!,
    token: process.env.REDIS_TOKEN!,
  });

  const redisResponse = await redis.get(uuid);

  if (!redisResponse) {
    return getUpdateFrame(uuid, action, parseInt(count) + 1);
  }

  console.log("Redis response: ", redisResponse);

  return getKnowledgeFrame(uuid, action);
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
