// This is a public API endpoint that will be invoked by QStash.
// It contains the logic for the background job and may take a long time to execute.
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { BrianSDK } from "@brian-ai/sdk";

// Initialize Brian SDK
const brianOptions = {
  apiKey: process.env.BRIAN_API_KEY!,
};
const brian = new BrianSDK(brianOptions);

async function handler(request: NextRequest) {
  const data = await request.json();

  console.log(JSON.stringify(data));

  // Call brian knowledge API
  const brianResponse = await brian.ask({
    prompt: data.prompt,
    kb: "kb_lido",
  });

  console.log("Brian response: ", brianResponse);

  if (!brianResponse) {
    console.error("Error while calling Brian knowledge API");
    return new NextResponse("Error while calling Brian knowledge API", { status: 500 });
  }

  // Save the data to the Redis database
  const redis = new Redis({
    url: process.env.REDIS_URL!,
    token: process.env.REDIS_TOKEN!,
  });

  const redisResponse = await redis.set(data.uuid, brianResponse);

  if (!redisResponse) {
    console.error("Error while writing to Redis");
    return new NextResponse("Error while writing to Redis", { status: 500 });
  }

  console.log("Redis response: ", redisResponse);

  return new NextResponse("Brian response wrote in Redis", { status: 200 });
}

export const POST = verifySignatureAppRouter(handler);
