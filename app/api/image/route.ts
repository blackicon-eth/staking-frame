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
    // const redis = new Redis({
    //   url: process.env.REDIS_URL!,
    //   token: process.env.REDIS_TOKEN!,
    // });
    // const redisResponse: BrianKnowledgeResponse | null = await redis.get(uuid);

    // // If no data is found, return the error image
    // if (!redisResponse) {
    //   const imagePath = path.join(process.cwd(), "public/frames", "error.png");
    //   return new NextResponse(await sharp(imagePath).toBuffer(), {
    //     headers: {
    //       "Content-Type": "image/png",
    //     },
    //   });
    // }

    const text =
      "Lido Finance is a decentralized liquid staking solution that allows users to stake their assets securely and efficiently on various blockchain networks.\n\nLiquid staking refers to the process of staking assets in a network while also being able to use those staked assets as collateral or for other financial activities.\n\nThis differs from traditional staking, where assets are locked up and not readily accessible.\n\nLido Finance specifically focuses on liquid staking for Ethereum 2.0 and other proof-of-stake blockchains. Users can stake their ETH through Lido, receive stETH (liquid staked Ether) in return, and then use this stETH for further DeFi activities such as lending, borrowing, or trading. This enables users to earn staking rewards and participate in other financial activities, all while their ETH remains staked on the Ethereum 2.0 network.\n\nOne of the key benefits of using Lido Finance is that it allows users to participate in staking without having to meet the minimum requirements for staking themselves. By \n\npooling assets together through Lido, users can collectively stake and earn rewards, even with smaller amounts of assets.\n\nOverall, Lido Finance provides a convenient and accessible way for users to participate in liquid staking on Ethereum 2.0 and other proof-of-stake blockchains, opening up \n\nnew opportunities for DeFi innovation and participation.";

    // Else generate the knowledge image
    const knowledgeImage = await generateKnowledgeImage(text.replace("\n\n", " ").slice(0, 540));
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
