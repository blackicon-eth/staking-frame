import { NextRequest, NextResponse } from "next/server";
import { Abi, Address, encodeFunctionData } from "viem";
import { base } from "viem/chains";
import { validateMessage } from "@/app/lib/utils";
import { FrameTransactionResponse } from "@coinbase/onchainkit/frame";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  // Getting the frame request
  const body = await req.json();

  // Validating the frame message
  const { isValid } = await validateMessage(body);
  if (!isValid) {
    return new NextResponse("Message not valid", { status: 500 });
  }

  const abi: any = "TODO: Get the ABI of the contract";

  // Getting the encoded data to build the transaction
  const data = encodeFunctionData({
    abi: abi as Abi, // ABI of the contract
    functionName: "TODO: Function name to call",
    args: [
      {
        // Arguments to pass to the function
      },
    ],
  });

  // Building the transaction as a FrameTransactionResponse
  const tx: FrameTransactionResponse = {
    chainId: `eip155:${base.id}`,
    method: "eth_sendTransaction",
    params: {
      abi: abi as Abi,
      to: "0x123", // The contract address we want to interact with
      data: data,
      value: "0", // Value to send with the transaction
    },
  };

  return NextResponse.json(tx);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
