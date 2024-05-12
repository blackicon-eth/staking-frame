import { FrameActionDataParsedAndHubContext, getFrameMessage } from "frames.js";

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
