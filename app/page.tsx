import { getFrameMetadata } from "@coinbase/onchainkit";
import type { Metadata } from "next";

const frameMetadata = getFrameMetadata({
  input: {
    text: "Ask a question or insert amount",
  },
  buttons: [
    {
      label: "Ask Brian 🧠",
      action: "post",
    },
    {
      label: "Stake ETH",
      action: "post",
    },
    {
      label: "Withdraw ETH",
      action: "post",
    },
  ],
  image: { src: `${process.env.NEXT_PUBLIC_BASE_URL}/frames/1to1.png`, aspectRatio: "1:1" },
  post_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/main`,
});

export const metadata: Metadata = {
  title: "Staking Frame",
  description: "A Farcaster frame to stake ETH, leveraging Brian AI API",
  openGraph: {
    title: "Staking Frame",
    description: "A Farcaster frame to stake ETH, leveraging Brian AI API",
    images: [`${process.env.NEXT_PUBLIC_BASE_URL}/frames/front_image.png`],
  },
  other: {
    ...frameMetadata,
  },
};

export default async function Page() {
  return (
    <>
      <h1>Brian Staking Frame</h1>
    </>
  );
}
