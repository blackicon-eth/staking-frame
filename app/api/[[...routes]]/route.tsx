/** @jsxImportSource frog/jsx */
import { Button, Frog, TextInput, Env, FrameContext, FrameResponse, TypedResponse } from "frog";
import { devtools } from "frog/dev";
import { neynar } from "frog/hubs";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import * as actions from "../../lib/constants/actions";
import { BlankInput } from "hono/types";
import { v4 as uuidv4 } from "uuid";
import { loadQstash } from "@/app/lib/utils";
import { Redis } from "@upstash/redis";
import * as style from "../../lib/style_components/styles";
import { readFileSync } from "fs";
import { join } from "path";

// Load the font
const font = join(process.cwd(), "public/fonts/GothamBoldItalic.ttf");
const GothamBoldItalicBuffer = readFileSync(font);

const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  hub: neynar({ apiKey: "NEYNAR_FROG_FM" }),
  verify: "silent",
  imageOptions: {
    width: 1910,
    height: 1000,
    fonts: [
      {
        data: GothamBoldItalicBuffer,
        name: "GothamBoldItalic",
      },
    ],
  },
});

// Unfortunately, importing a function with JSX elements breaks them during the compiling process
// So here it is a "library" of functions that returns the frames

// Returns an invalid frame
export function getInvalidFrame(context: FrameContext<Env, "/", BlankInput>): TypedResponse<FrameResponse> {
  return context.res({
    image: `${process.env.NEXT_PUBLIC_BASE_URL}/frames/invalid.png`,
    intents: [<Button action="/">Start over</Button>],
  });
}

// Returns an error frame
export function getErrorFrame(context: FrameContext<Env, "/", BlankInput>): TypedResponse<FrameResponse> {
  return context.res({
    image: `${process.env.NEXT_PUBLIC_BASE_URL}/frames/error.png`,
    intents: [<Button action="/">Start over</Button>],
  });
}

// Returns a frame with a loading image
export function getUpdateFrame(
  uuid: string,
  action: string,
  count: number,
  context: FrameContext<Env, "/", BlankInput>
): TypedResponse<FrameResponse> {
  const nextTarget = `/update/${uuid}/${action}/${count.toString()}`;
  return context.res({
    image: `${process.env.NEXT_PUBLIC_BASE_URL}/frames/loading.gif`,
    intents:
      count > 3
        ? [<Button action="/">Start over</Button>, <Button action={nextTarget}>Refresh</Button>]
        : [<Button action={nextTarget}>Refresh</Button>],
  });
}

// Returns a frame with the knowledge image
export function getKnowledgeFrame(
  redisResponse: any,
  context: FrameContext<Env, "/", BlankInput>
): TypedResponse<FrameResponse> {
  const text =
    "Lido Finance is a decentralized liquid staking solution that allows users to stake their assets securely and efficiently on various blockchain networks.\n\nLiquid staking refers to the process of staking assets in a network while also being able to use those staked assets as collateral or for other financial activities.\n\nThis differs from traditional staking, where assets are locked up and not readily accessible.\n\nLido Finance specifically focuses on liquid staking for Ethereum 2.0 and other proof-of-stake blockchains. Users can stake their ETH through Lido, receive stETH (liquid staked Ether) in return, and then use this stETH for further DeFi activities such as lending, borrowing, or trading. This enables users to earn staking rewards and participate in other financial activities, all while their ETH remains staked on the Ethereum 2.0 network.\n\nOne of the key benefits of using Lido Finance is that it allows users to participate in staking without having to meet the minimum requirements for staking themselves. By \n\npooling assets together through Lido, users can collectively stake and earn rewards, even with smaller amounts of assets.\n\nOverall, Lido Finance provides a convenient and accessible way for users to participate in liquid staking on Ethereum 2.0 and other proof-of-stake blockchains, opening up \n\nnew opportunities for DeFi innovation and participation.";

  return context.res({
    image: (
      <div style={style.background}>
        <p>{text.slice(0, 530) + "..."}</p>
      </div>
    ),
    intents: [
      <Button action="/">Start over</Button>,
      <Button.Link href={`${process.env.NEXT_PUBLIC_BASE_URL}`}>See full text</Button.Link>,
      <Button.Link
        href={`https://warpcast.com/~/compose?text=Stake%20your%20ETH%20with%20Brian!%0A%0A${process.env.NEXT_PUBLIC_BASE_URL}`}
      >
        Share!
      </Button.Link>,
    ],
  });
}

// Here starts the series of frames ------------------

// Main Frame
app.frame("/", (context) => {
  return context.res({
    image: `${process.env.NEXT_PUBLIC_BASE_URL}/frames/generic.png`,
    intents: [
      <TextInput placeholder="Ask a question or insert amount" />,
      <Button>Ask Brian 🧠</Button>,
      <Button>Check staked</Button>,
      <Button>Stake ETH</Button>,
      <Button>Withdraw ETH</Button>,
    ],
    action: "/router",
  });
});

// Knowledge Frame
app.frame("/router", async (context) => {
  const { verified, inputText, buttonIndex } = context;

  // Validating the frame message
  //if (!verified) return getInvalidFrame(context);

  // Creating a unique id for this call
  const uuid = uuidv4();

  console.log("Input text: ", inputText);
  console.log("Button index: ", buttonIndex);

  // Asking Brian the question
  if (buttonIndex === 1) {
    // Check if the inputText is empty
    if (!inputText) {
      return getErrorFrame(context);
    }

    // Send the question from the frame message to the Qstash API
    const { response } = await loadQstash(actions.ASK, inputText, uuid);
    if (response === "ko") {
      return getErrorFrame(context);
    }

    return getUpdateFrame(uuid, actions.ASK, 1, context);
  }

  // Checking the staked amount
  else if (buttonIndex === 2) {
    return getErrorFrame(context);
  }

  // Staking ETH
  else if (buttonIndex === 3) {
    return getErrorFrame(context);
  }

  // Withdrawing ETH
  else if (buttonIndex === 4) {
    return getErrorFrame(context);
  }

  // If the button index is not valid
  return getErrorFrame(context);
});

// Update Frame
app.frame("/update/:uuid/:action/:count", async (context) => {
  const { uuid, action, count } = context.req.param();

  // Validating the frame message
  //if (!verified) return getInvalidFrame(context);

  console.log("UUID: ", uuid);
  console.log("Action: ", action);
  console.log("Count: ", count);

  // Get the data from the Redis database
  const redis = new Redis({
    url: process.env.REDIS_URL!,
    token: process.env.REDIS_TOKEN!,
  });

  const redisResponse = await redis.get(uuid);

  if (!redisResponse) {
    return getUpdateFrame(uuid, action, parseInt(count) + 1, context);
  }

  console.log("Redis response: ", redisResponse);

  return getKnowledgeFrame(redisResponse, context);
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
