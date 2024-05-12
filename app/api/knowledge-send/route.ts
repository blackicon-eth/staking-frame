import { Client } from "@upstash/qstash";
import { NextRequest, NextResponse } from "next/server";

const qstashClient = new Client({
  token: process.env.QSTASH_TOKEN!,
});

async function getResponse(req: NextRequest): Promise<NextResponse> {
  // Get the data from the request and send it to the Qstash API
  const data = await req.json();
  const question: string = data.question;

  try {
    await qstashClient.publishJSON({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/knowledge-worker`,
      body: {
        prompt: question,
        kb: "kb_lido",
      },
    });
    return new NextResponse("Job started", { status: 200 });
  } catch (error) {
    return new NextResponse(`Job failed with error: ${error}`, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
