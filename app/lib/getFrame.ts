import { getFrameHtmlResponse } from "@coinbase/onchainkit";
import { NextResponse } from "next/server";
import * as actions from "./constants/actions";

export function getInvalidFrame(): NextResponse {
  const frame = getFrameHtmlResponse({
    buttons: [
      {
        label: "Start Over",
        action: "post",
        target: `${process.env.NEXT_PUBLIC_BASE_URL}/api/start-over`,
      },
    ],
    image: { src: `${process.env.NEXT_PUBLIC_BASE_URL}/frames/invalid.png` },
  });

  return new NextResponse(frame);
}

export function getErrorFrame(): NextResponse {
  const frame = getFrameHtmlResponse({
    buttons: [
      {
        label: "Start Over",
        action: "post",
        target: `${process.env.NEXT_PUBLIC_BASE_URL}/api/start-over`,
      },
    ],
    image: { src: `${process.env.NEXT_PUBLIC_BASE_URL}/frames/error.png` },
  });

  return new NextResponse(frame);
}

export function getUpdateFrame(uuid: string, action: string, count: number): NextResponse {
  const frame = getFrameHtmlResponse({
    buttons:
      count > 3
        ? [
            { label: "Start Over", action: "post", target: `${process.env.NEXT_PUBLIC_BASE_URL}/api/start-over` },
            {
              label: "Update",
              action: "post",
              target: `${
                process.env.NEXT_PUBLIC_BASE_URL
              }/api/update?uuid=${uuid}&action=${action}&count=${count.toString()}`,
            },
          ]
        : [
            {
              label: "Update",
              action: "post",
              target: `${
                process.env.NEXT_PUBLIC_BASE_URL
              }/api/update?uuid=${uuid}&action=${action}&count=${count.toString()}`,
            },
          ],
    image: { src: `${process.env.NEXT_PUBLIC_BASE_URL}/frames/loading.gif` },
  });

  return new NextResponse(frame);
}

export function getKnowledgeFrame(uuid: string, action: string): NextResponse {
  const frame = getFrameHtmlResponse({
    buttons: [
      {
        label: "Start Over",
        action: "post",
        target: `${process.env.NEXT_PUBLIC_BASE_URL}/api/start-over`,
      },
      {
        label: "See full text",
        action: "link",
        target: `${process.env.NEXT_PUBLIC_BASE_URL}`,
      },
      {
        label: "Share!",
        action: "link",
        target: `https://warpcast.com/~/compose?text=Stake%20your%20ETH%20with%20Brian!%0A%0A${process.env.NEXT_PUBLIC_BASE_URL}`,
      },
    ],
    image: { src: `${process.env.NEXT_PUBLIC_BASE_URL}/api/image?uuid=${uuid}&action=${action}` },
  });

  return new NextResponse(frame);
}

export function getFirstFrame(): NextResponse {
  const frame = getFrameHtmlResponse({
    input: {
      text: "Ask a question or insert amount",
    },
    buttons: [
      {
        label: "Ask Brian 🧠",
        action: "post",
        target: `${process.env.NEXT_PUBLIC_BASE_URL}/api/main?action=${actions.ASK}`,
      },
      {
        label: "Check staked",
        action: "post",
        target: `${process.env.NEXT_PUBLIC_BASE_URL}/api/main?action=${actions.CHECK}`,
      },
      {
        label: "Stake ETH",
        action: "post",
        target: `${process.env.NEXT_PUBLIC_BASE_URL}/api/main?action=${actions.DEPOSIT}`,
      },
      {
        label: "Withdraw ETH",
        action: "post",
        target: `${process.env.NEXT_PUBLIC_BASE_URL}/api/main?action=${actions.WITHDRAW}`,
      },
    ],
    image: { src: `${process.env.NEXT_PUBLIC_BASE_URL}/frames/generic.png` },
  });

  return new NextResponse(frame);
}
