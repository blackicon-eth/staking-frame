// This is a public API endpoint that will be invoked by QStash.
// It contains the logic for the background job and may take a long time to execute.

import { NextRequest, NextResponse } from "next/server";

export async function getResponse(request: NextRequest) {
  const body = await request.json();

  console.log(body);

  // Do whatever you need to do

  return new NextResponse("Job started", { status: 200 });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
