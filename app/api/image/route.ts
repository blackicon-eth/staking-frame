import { NextRequest, NextResponse } from "next/server";
import { generateImage, generateKnowledgeImage } from "@/app/lib/generateImage";
import { Redis } from "@upstash/redis";
import { BrianKnowledgeResponse } from "@/app/lib/interfaces/knowledge";
import path from "path";
import sharp from "sharp";
import * as actions from "@/app/lib/constants/actions";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  // Getting params from the URL
  const uuid = req.nextUrl.searchParams.get("uuid")!;
  const action = req.nextUrl.searchParams.get("action")!;

  // Generate the knowledge image
  if (action === actions.ASK) {
    // Get the data from the Redis database
    const redis = new Redis({
      url: process.env.REDIS_URL!,
      token: process.env.REDIS_TOKEN!,
    });
    const redisResponse: BrianKnowledgeResponse | null = await redis.get(uuid);

    // If no data is found, return the error image
    if (!redisResponse) {
      const imagePath = path.join(process.cwd(), "public/frames", "error.png");
      return new NextResponse(await sharp(imagePath).toBuffer(), {
        headers: {
          "Content-Type": "image/png",
        },
      });
    }

    // Else generate the knowledge image
    const knowledgeImage = await generateKnowledgeImage(redisResponse.result.text.replace("\n\n", " ").slice(0, 540));
    return new NextResponse(knowledgeImage, {
      headers: {
        "Content-Type": "image/png",
      },
    });

    // TODO: Generate the other images
  } else if (action === actions.CHECK) {
  } else if (action === actions.DEPOSIT) {
  } else {
  }

  // Asserting that the value return with this call is a Buffer
  const image = await generateImage(uuid, action);
  return new NextResponse(image, {
    headers: {
      "Content-Type": "image/png",
    },
  });
}

export async function GET(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
