import { NextRequest, NextResponse } from "next/server";
import { FrameActionDataParsedAndHubContext } from "frames.js";
import { getErrorFrame, getInvalidFidFrame, getUpdateFrame } from "@/app/lib/getFrame";
import { loadQstash, validateMessage } from "@/app/lib/utils";
import { v4 as uuidv4 } from "uuid";
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

  // Get the prompt from the frame message
  const prompt = frameMessage.inputText!;

  // Get the action from parameters
  const action = req.nextUrl.searchParams.get("action")!;

  // Creating a uuid for this call
  const uuid = uuidv4();

  // Send the question from the frame message to the Qstash API
  const { response } = await loadQstash(action, prompt, uuid);
  if (response === "ko") {
    return getErrorFrame();
  }

  // Save the data to the Redis database
  // const redis = new Redis({
  //   url: process.env.REDIS_URL!,
  //   token: process.env.REDIS_TOKEN!,
  // });

  // var redisResponse = await redis.set(uuid, "Pluto is a small planet");

  // console.log("UUID: ", uuid);
  // console.log("Redis response to set: ", redisResponse);

  // redisResponse = await redis.get(uuid);

  // console.log("Redis response to get: ", redisResponse);

  // const deletionResponse = await redis.del(uuid);

  // console.log("Redis response to del: ", deletionResponse.toString());

  return getUpdateFrame();
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
