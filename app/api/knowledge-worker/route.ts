// This is a public API endpoint that will be invoked by QStash.
// It contains the logic for the background job and may take a long time to execute.
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { NextRequest, NextResponse } from "next/server";

async function handler(request: NextRequest) {
  const body = await request.json();

  console.log(JSON.stringify(body));

  // Save the data to the redis database

  return new NextResponse("Job finished succesfully", { status: 200 });
}

export const POST = verifySignatureAppRouter(handler);
