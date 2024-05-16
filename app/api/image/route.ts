import { NextRequest, NextResponse } from "next/server";
import { generateImage } from "@/app/lib/generateImage";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  // Getting params from the URL
  const uuid = req.nextUrl.searchParams.get("uuid");
  const action = req.nextUrl.searchParams.get("action");

  //

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
