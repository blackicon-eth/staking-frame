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
      target: `${process.env.NEXT_PUBLIC_BASE_URL}/api/main?action=ask&state=start`,
    },
    {
      label: "Stake ETH",
      action: "post",
      target: `${process.env.NEXT_PUBLIC_BASE_URL}/api/main?action=deposit&state=start`,
    },
    {
      label: "Withdraw ETH",
      action: "post",
      target: `${process.env.NEXT_PUBLIC_BASE_URL}/api/main?action=withdraw&state=start`,
    },
  ],
  image: { src: `${process.env.NEXT_PUBLIC_BASE_URL}/frames/1to1.png`, aspectRatio: "1:1" },
});

export const metadata: Metadata = {
  title: "Staking Frame",
  description: "A Farcaster frame to stake ETH, leveraging Brian AI API",
  openGraph: {
    title: "Staking Frame",
    description: "A Farcaster frame to stake ETH, leveraging Brian AI API",
    images: [`${process.env.NEXT_PUBLIC_BASE_URL}/frames/1to1.png`],
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
