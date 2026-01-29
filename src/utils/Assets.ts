/**
 * 资源文件
 */

// Import earth images - updated for standalone project
import gradientImg from "../assets/images/earth/gradient.png";
import redCircleImg from "../assets/images/earth/redCircle.png";
import labelImg from "../assets/images/earth/label.png";
import apertureImg from "../assets/images/earth/aperture.png";
import glowImg from "../assets/images/earth/glow.png";
import lightColumnImg from "../assets/images/earth/light_column.png";
import aircraftImg from "../assets/images/earth/aircraft.png";
import earthImg from "../assets/images/earth/earth.jpg";

interface ITextures {
  name: string;
  url: string;
}

export interface IResources {
  textures?: ITextures[];
}

const imageMap: Record<string, string> = {
  gradient: gradientImg,
  redCircle: redCircleImg,
  label: labelImg,
  aperture: apertureImg,
  glow: glowImg,
  light_column: lightColumnImg,
  aircraft: aircraftImg,
  earth: earthImg,
};

const fileSuffix = [
  "gradient",
  "redCircle",
  "label",
  "aperture",
  "glow",
  "light_column",
  "aircraft",
];

const textures = fileSuffix.map((item) => {
  return {
    name: item,
    url: imageMap[item],
  };
});

textures.push({
  name: "earth",
  url: imageMap.earth,
});

export const resources: IResources = {
  textures,
};
