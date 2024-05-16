import satori from "satori";
import { readFileSync } from "fs";
import { join } from "path";
import * as style from "./style_components/styles";
import sharp from "sharp";

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
