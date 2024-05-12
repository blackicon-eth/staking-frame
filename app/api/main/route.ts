import { NextRequest, NextResponse } from "next/server";
import { getFrameHtmlResponse } from "@coinbase/onchainkit";
import { FrameActionDataParsedAndHubContext } from "frames.js";
import { getInvalidFidFrame } from "@/app/lib/getFrame";
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

  if (state === "start") {
    if (action === "ask") {
      // Send the question from the frame message to the Qstash API
      await axios.post("/api/knowledge-send", {
        question: prompt,
      });
    }
  }

  // TODO: Implement a logic to:
  // 1. Check if a transaction is in the buffer already
  // 2. If not, create a new transaction and return the same "updating..." frame
  // 3. If yes and it's ready, return the transaction frame
  // 4. If yes and it's not ready, return the same "updating..." frame

  // Creating the frame
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
