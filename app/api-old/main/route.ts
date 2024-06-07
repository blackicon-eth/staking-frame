import { NextRequest, NextResponse } from "next/server";
import { getErrorFrame, getInvalidFrame, getUpdateFrame } from "@/app/lib/getFrame";
import { v4 as uuidv4 } from "uuid";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  // Getting the user data and validating it
  const data = await req.json();

  // Get the prompt from the frame message
  const prompt = frameMessage.inputText!;

  // Get the action from parameters
  const action = req.nextUrl.searchParams.get("action")!;

  // Creating a unique id for this call
  const uuid = uuidv4();

  // Send the question from the frame message to the Qstash API
  const { response } = await loadQstash(action, prompt, uuid);
  if (response === "ko") {
    return getErrorFrame();
  }

  return getUpdateFrame(uuid, action, 1);
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
