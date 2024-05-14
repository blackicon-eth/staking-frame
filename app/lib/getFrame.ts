import { getFrameHtmlResponse } from "@coinbase/onchainkit";
import { NextResponse } from "next/server";

export function getInvalidFidFrame(): NextResponse {
  const frame = getFrameHtmlResponse({
    buttons: [
      {
        label: "Retry",
        action: "post",
      },
    ],
    image: { src: `${process.env.NEXT_PUBLIC_BASE_URL}/frames/1to1.png`, aspectRatio: "1:1" },
    post_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/main`,
  });

  return new NextResponse(frame);
}

export function getErrorFrame(): NextResponse {
  const frame = getFrameHtmlResponse({
    buttons: [
      {
        label: "Retry",
        action: "post",
      },
    ],
    image: { src: `${process.env.NEXT_PUBLIC_BASE_URL}/frames/1to1.png`, aspectRatio: "1:1" },
    post_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/main`,
  });

  return new NextResponse(frame);
}

export function getUpdateFrame(uuid: string, action: string): NextResponse {
  const frame = getFrameHtmlResponse({
    buttons: [
      {
        label: "Update",
        action: "post",
        target: `${process.env.NEXT_PUBLIC_BASE_URL}/api/update?uuid=${uuid}&action=${action}`,
      },
    ],
    image: {
      src: `${process.env.NEXT_PUBLIC_BASE_URL}/frames/1to1.png`,
      aspectRatio: "1:1",
    },
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
        target: `${process.env.NEXT_PUBLIC_BASE_URL}/api/main?action=ask?state=start`,
      },
      {
        label: "Stake ETH",
        action: "post",
        target: `${process.env.NEXT_PUBLIC_BASE_URL}/api/main?action=deposit?state=start`,
      },
      {
        label: "Withdraw ETH",
        action: "post",
        target: `${process.env.NEXT_PUBLIC_BASE_URL}/api/main?action=withdraw?state=start`,
      },
    ],
    image: { src: `${process.env.NEXT_PUBLIC_BASE_URL}/frames/1to1.png`, aspectRatio: "1:1" },
  });

  return new NextResponse(frame);
}
