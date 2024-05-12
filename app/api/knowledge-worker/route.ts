// This is a public API endpoint that will be invoked by QStash.
// It contains the logic for the background job and may take a long time to execute.
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { NextRequest, NextResponse } from "next/server";

async function handler(request: NextRequest) {
  const data = await request.json();

  console.log(JSON.stringify(data));

  // Call brian knowledge API
  const headers = {
    "Content-Type": "application/json",
    "X-Brian-Api-Key": process.env.BRIAN_API_KEY!,
  };

  try {
    const response = await fetch("https://staging-api.brianknows.org/api/v0/agent/knowledge", {
      method: "POST",
      headers,
      body: JSON.stringify({
        prompt: data.prompt,
        kb: "kb_lido",
      }),
    });

    console.log("Brian knowledge API response: ", JSON.stringify(response));

    // Save the data to the Redis database

    return new NextResponse("Brian response wrote in Redis", { status: 200 });
  } catch (error) {
    console.error("Error while calling Brian knowledge API: ", error);
    return new NextResponse("Error while calling Brian knowledge API", { status: 500 });
  }
}

export const POST = verifySignatureAppRouter(handler);
