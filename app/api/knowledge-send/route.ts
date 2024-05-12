import { Client } from "@upstash/qstash";
import { NextRequest, NextResponse } from "next/server";
import { getFrameHtmlResponse } from "@coinbase/onchainkit";

const qstashClient = new Client({
  token: process.env.QSTASH_TOKEN!,
});

async function getResponse(req: NextRequest): Promise<NextResponse> {
  // Getting the user data and validating it
  const data = await req.json();

  // TODO: Get the data from the request and send it to the Qstash API
  const question: string = data.question;

  await qstashClient.publishJSON({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/knowledge-work`,
    body: {
      prompt: question,
      kb: "kb_lido",
    },
  });

  const frame = getFrameHtmlResponse({
    buttons: [
      {
        label: "Update",
        action: "post",
        target: `${process.env.NEXT_PUBLIC_BASE_URL}/api/main`,
      },
    ],
    image: {
      src: `${process.env.NEXT_PUBLIC_BASE_URL}/frames/1to1.png`,
      aspectRatio: "1:1",
    },
  });

  return new NextResponse(frame);
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
