import { getFrameMetadata } from "frog/next";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const frameTags = await getFrameMetadata(`${process.env.NEXT_PUBLIC_BASE_URL}/api`);
  return {
    other: frameTags,
  };
}

export default async function Page() {
  return (
    <>
      <h1>Brian Staking Frame</h1>
    </>
  );
}
