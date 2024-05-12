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

export function getUpdateFrame(): NextResponse {
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
