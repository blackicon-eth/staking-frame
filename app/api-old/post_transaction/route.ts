import { NextRequest, NextResponse } from "next/server";
import { getFrameHtmlResponse } from "@coinbase/onchainkit";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  // Getting the user data and validating it
  const data = await req.json();

  // Do things after the transaction is sent

  // Creating the frame
  const frame = getFrameHtmlResponse({
    buttons: [
      {
        label: "See transaction",
        action: "link",
        target: `https://basescan.org/tx/${frameMessage.transactionId}`,
      },
      {
        label: "Share!",
        action: "link",
        target:
          "https://warpcast.com/~/compose?text=Find%20your%20farcaster%20best%20friend!%0A%0Ahttps://bf-frame.vercel.app/",
      },
      {
        label: "Tip creator",
        action: "link",
        target: "https://warpcast.com/blackicon.eth/0xeec9675e",
      },
    ],
    image: { src: `${process.env.NEXT_PUBLIC_BASE_URL}/frames/transaction_sent.png` },
  });

  return new NextResponse(frame);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
