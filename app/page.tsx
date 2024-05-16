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
      target: `${process.env.NEXT_PUBLIC_BASE_URL}/api/main?action=ask`,
    },
    {
      label: "Check staked",
      action: "post",
      target: `${process.env.NEXT_PUBLIC_BASE_URL}/api/main?action=check`,
    },
    {
      label: "Stake ETH",
      action: "post",
      target: `${process.env.NEXT_PUBLIC_BASE_URL}/api/main?action=deposit`,
    },
    {
      label: "Withdraw ETH",
      action: "post",
      target: `${process.env.NEXT_PUBLIC_BASE_URL}/api/main?action=withdraw`,
    },
  ],
  image: { src: `${process.env.NEXT_PUBLIC_BASE_URL}/frames/generic.png` },
});

export const metadata: Metadata = {
  title: "Staking Frame",
  description: "A Farcaster frame to stake ETH, leveraging Brian AI API",
  openGraph: {
    title: "Staking Frame",
    description: "A Farcaster frame to stake ETH, leveraging Brian AI API",
    images: [`${process.env.NEXT_PUBLIC_BASE_URL}/frames/generic.png`],
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
