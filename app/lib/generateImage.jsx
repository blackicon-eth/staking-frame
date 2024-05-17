import satori from "satori";
import { readFileSync } from "fs";
import { join } from "path";
import * as style from "./style_components/styles";
import sharp from "sharp";
import path from "path";
import fs from "fs";

// Load the font
const font = join(process.cwd(), "public/fonts/GothamBoldItalic.ttf");
const GothamBoldItalicBuffer = readFileSync(font);

export async function generateImage(_callerUsername, _callerPropic, _friendUsername, _friendPropic) {
  // Getting the data in order to compose the image
  const { formattedDate, bgImage, callerUsername, friendUsername, callerPropic, friendPropic } = await getImageData(
    _callerUsername,
    _callerPropic,
    _friendUsername,
    _friendPropic
  );

  // Generate the image with Satori
  const svg = await satori(
    <div style={style.background}>
      <img src={bgImage} style={style.bgImage} />
      <div style={style.callerContainer}>
        <img src={callerPropic.buffer} style={style.imageFriend} />
        <span tw={style.twFriendName}>{callerUsername}</span>
      </div>
      <div style={style.friendContainer}>
        <img src={friendPropic.buffer} style={style.imageFriend} />
        <span tw={style.twFriendName}>{friendUsername}</span>
      </div>
      <span tw={style.twDate} style={style.date}>
        Created on {formattedDate}
      </span>
    </div>,
    {
      width: 1500,
      height: 1500,
      fonts: [
        {
          data: GothamBoldItalicBuffer,
          name: "GothamBoldItalic",
        },
      ],
    }
  );

  const sharpPNG = sharp(Buffer.from(svg)).toFormat("png");
  const buffer = await sharpPNG.toBuffer();

  return buffer;
}

export async function generateKnowledgeImage(text) {
  const imagePath = path.join(process.cwd(), "public/frames/generic.png");
  const imagebuffer = fs.readFileSync(imagePath);
  const arrayBuffer = imagebuffer.buffer.slice(imagebuffer.byteOffset, imagebuffer.byteOffset + imagebuffer.byteLength);

  // Generate the image with Satori
  const svg = await satori(
    <div style={style.background}>
      <img src={arrayBuffer} style={style.bgImage} />
      <div style={style.textContainer}>{text}</div>
    </div>,
    {
      width: 1910,
      height: 1000,
      fonts: [
        {
          data: GothamBoldItalicBuffer,
          name: "GothamBoldItalic",
        },
      ],
    }
  );

  const sharpPNG = sharp(Buffer.from(svg)).toFormat("png");
  const buffer = await sharpPNG.toBuffer();

  return buffer;
}
