import { NextRequest, NextResponse } from "next/server";
import { FrameActionDataParsedAndHubContext } from "frames.js";
import { getErrorFrame, getInvalidFidFrame, getUpdateFrame } from "@/app/lib/getFrame";
import { loadQstash, validateMessage } from "@/app/lib/utils";

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

  // Send the question from the frame message to the Qstash API
  const { response } = await loadQstash(action, prompt, "123");
  if (response === "ko") {
    return getErrorFrame();
  }

  return getUpdateFrame();
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
