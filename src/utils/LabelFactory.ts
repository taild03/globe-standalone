import { CanvasTexture, SpriteMaterial, Sprite, LinearFilter } from "three";

interface LabelOptions {
  text: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  padding?: number;
  scale?: number;
}

interface CachedLabel {
  texture: CanvasTexture;
  material: SpriteMaterial;
  sprite: Sprite;
  width: number;
  height: number;
}

const labelCache = new Map<string, CachedLabel>();

export function createTextLabel(options: LabelOptions): CachedLabel {
  const {
    text,
    fontSize = 24,
    fontFamily = "Outfit, sans-serif",
    fontWeight = "600",
    color = "#ffffff",
    backgroundColor = "transparent",
    padding = 8,
    scale = 2,
  } = options;

  const cacheKey = `${text}-${fontSize}-${fontFamily}-${fontWeight}-${color}-${backgroundColor}-${padding}-${scale}`;
  if (labelCache.has(cacheKey)) {
    const cached = labelCache.get(cacheKey)!;
    const sprite = cached.sprite.clone();
    sprite.material = cached.material;
    return { ...cached, sprite };
  }

  // Create canvas
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  ctx.font = `${fontWeight} ${fontSize * scale}px ${fontFamily}`;
  const metrics = ctx.measureText(text);
  const textWidth = metrics.width;
  const textHeight = fontSize * scale * 1.2;

  canvas.width = textWidth + padding * 2 * scale;
  canvas.height = textHeight + padding * 2 * scale;

  if (backgroundColor !== "transparent") {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.font = `${fontWeight} ${fontSize * scale}px ${fontFamily}`;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new CanvasTexture(canvas);
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.needsUpdate = true;

  const material = new SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });

  const sprite = new Sprite(material);

  const aspectRatio = canvas.width / canvas.height;
  const spriteHeight = 6;
  const spriteWidth = spriteHeight * aspectRatio;
  sprite.scale.set(spriteWidth, spriteHeight, 1);

  const result: CachedLabel = {
    texture,
    material,
    sprite,
    width: canvas.width,
    height: canvas.height,
  };

  labelCache.set(cacheKey, result);

  return result;
}

export function clearLabelCache(): void {
  labelCache.forEach((cached) => {
    cached.texture.dispose();
    cached.material.dispose();
  });
  labelCache.clear();
}

export function createBatchLabels(
  labels: string[],
  options: Omit<LabelOptions, "text"> = {}
): CachedLabel[] {
  return labels.map((text) => createTextLabel({ ...options, text }));
}
