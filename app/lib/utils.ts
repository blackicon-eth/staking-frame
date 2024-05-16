import { FrameActionDataParsedAndHubContext, getFrameMessage } from "frames.js";
import { Client } from "@upstash/qstash";
import * as actions from "./constants/actions";

export async function loadQstash(action: string, prompt: string, uuid: string): Promise<{ response: string }> {
  // Get the Qstash client
  const qstashClient = new Client({
    token: process.env.QSTASH_TOKEN!,
  });

  const endpoint =
    action === actions.ASK
      ? "knowledge-worker"
      : action === actions.DEPOSIT
      ? "deposit-worker"
      : action === actions.WITHDRAW
      ? "withdraw-worker"
      : "";

  // Send the prompt from the frame message to the Qstash API
  try {
    await qstashClient.publishJSON({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/${endpoint}`,
      body: {
        uuid: uuid,
        prompt: prompt,
      },
    });
    return { response: "ok" };
  } catch (error) {
    console.error("Error while publishing json to QStash: ", error);
    return { response: "ko" };
  }
}

export async function validateMessage(
  body: any
): Promise<{ frameMessage: FrameActionDataParsedAndHubContext | undefined; isValid: boolean }> {
  // Getting the frame message
  const frameMessage = await getFrameMessage(
    { trustedData: body.trustedData, untrustedData: body.untrustedData },
    {
      hubHttpUrl: process.env.NEYNAR_HUB_URL!,
      hubRequestOptions: {
        headers: {
          api_key: process.env.NEYNAR_API_KEY!,
        },
      },
    }
  );

  // If the base url is not set or is not localhost, we need to validate the frame message
  if (!process.env.NEXT_PUBLIC_BASE_URL!.includes("localhost") && (!frameMessage || !frameMessage.isValid)) {
    return { frameMessage: undefined, isValid: false };
  }
  return { frameMessage: frameMessage, isValid: true };
}
