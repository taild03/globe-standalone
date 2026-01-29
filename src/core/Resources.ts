import {
  LoadingManager,
  Texture,
  TextureLoader,
  LinearFilter,
  LinearMipmapLinearFilter,
} from "three";
import { resources } from "../utils/Assets";

export class Resources {
  private manager: LoadingManager;
  private callback: () => void;
  private textureLoader!: TextureLoader;
  public textures: Record<string, Texture>;
  private loadErrors: string[] = [];

  constructor(callback: () => void) {
    this.callback = callback;
    this.textures = {};

    this.setLoadingManager();
    this.loadResources();
  }

  private setLoadingManager() {
    this.manager = new LoadingManager();

    this.manager.onLoad = () => {
      this.callback();
    };

    this.manager.onError = (url) => {
      console.error(`Failed to load texture: ${url}`);
      this.loadErrors.push(url);
    };
  }
  public hasLoadErrors(): boolean {
    return this.loadErrors.length > 0;
  }

  public getLoadErrors(): string[] {
    return [...this.loadErrors];
  }

  private loadResources(): void {
    this.textureLoader = new TextureLoader(this.manager);

    resources.textures?.forEach((item) => {
      this.textureLoader.load(item.url, (t) => {
        t.minFilter = LinearMipmapLinearFilter;
        t.magFilter = LinearFilter;
        t.generateMipmaps = true;
        // Use renderer's max anisotropy capability, capped at 4
        const maxAnisotropy = 16; // Common GPU max, will be clamped by GPU capabilities
        t.anisotropy = Math.min(4, maxAnisotropy);
        this.textures[item.name] = t;
      });
    });
  }

  /**
   * Cleanup method to dispose all loaded textures
   * Prevents memory leaks by releasing GPU resources
   */
  public destroy(): void {
    Object.values(this.textures).forEach((texture) => {
      texture.dispose();
    });
    this.textures = {};
  }
}
