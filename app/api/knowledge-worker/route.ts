// This is a public API endpoint that will be invoked by QStash.
// It contains the logic for the background job and may take a long time to execute.
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

async function handler(request: NextRequest) {
  const data = await request.json();

  console.log(JSON.stringify(data));

  // Call brian knowledge API
  const headers = {
    "Content-Type": "application/json",
    "X-Brian-Api-Key": process.env.BRIAN_API_KEY!,
  };

  const brianResponse = await fetch("https://staging-api.brianknows.org/api/v0/agent/knowledge", {
    method: "POST",
    headers,
    body: JSON.stringify({
      prompt: data.prompt,
      kb: "kb_lido",
    }),
  });

  if (!brianResponse.ok) {
    console.error("Error while calling Brian knowledge API");
    return new NextResponse("Error while calling Brian knowledge API", { status: 500 });
  }

  const brianResponseJson = await brianResponse.json();

  // Save the data to the Redis database
  const redis = new Redis({
    url: process.env.REDIS_URL!,
    token: process.env.REDIS_TOKEN!,
  });

  const redisResponse = await redis.set(data.uuid, brianResponseJson);

  if (!redisResponse) {
    console.error("Error while writing to Redis");
    return new NextResponse("Error while writing to Redis", { status: 500 });
  }

  console.log("Redis response: ", redisResponse);

  return new NextResponse("Brian response wrote in Redis", { status: 200 });
}

export const POST = verifySignatureAppRouter(handler);
