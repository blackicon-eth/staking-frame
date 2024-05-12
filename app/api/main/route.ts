import { NextRequest, NextResponse } from "next/server";
import { FrameActionDataParsedAndHubContext } from "frames.js";
import { getInvalidFidFrame, getUpdateFrame } from "@/app/lib/getFrame";
import { validateMessage } from "@/app/lib/utils";
import axios from "axios";

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
  const prompt = frameMessage.inputText;

  // Get the action from parameters
  const action = req.nextUrl.searchParams.get("action")!;
  const state = req.nextUrl.searchParams.get("state")!;

  // TODO: Implement a logic to:
  // 1. Check if a transaction is in the buffer already
  // 2. If not, create a new transaction and return the same "updating..." frame
  // 3. If yes and it's ready, return the transaction frame
  // 4. If yes and it's not ready, return the same "updating..." frame

  if (state === "start") {
    if (action === "ask") {
      // Send the question from the frame message to the Qstash API
      const res: NextResponse = await axios.post("/api/knowledge-send", {
        question: prompt,
      });
      if (res.status === 200) {
        return getUpdateFrame();
      }
    }

    return getUpdateFrame();
  }

  return new NextResponse();
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
