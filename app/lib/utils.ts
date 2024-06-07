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
