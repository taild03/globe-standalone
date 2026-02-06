import {
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
  Object3D,
  Mesh,
  Points,
  Sprite,
  SpriteMaterial,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { IWord } from "../utils/types";
import { Basic } from "./Basic";
import Sizes from "./Sizes";
import { Resources } from "./Resources";
import Earth from "./Earth";
import Data from "./Data";

export default class World {
  public basic: Basic;
  public scene: Scene;
  public camera: PerspectiveCamera;
  public renderer: WebGLRenderer;
  public controls: OrbitControls;
  public sizes: Sizes;
  public material: ShaderMaterial | MeshBasicMaterial;
  public resources: Resources;
  public option: IWord;
  public earth: Earth;
  public animationId: number | null = null;
  public isDestroyed: boolean = false;
  public isPaused: boolean = false;

  constructor(option: IWord) {
    this.option = option;

    // Start paused if requested (for preloading without rendering)
    this.isPaused = option.startPaused ?? false;

    this.basic = new Basic(option.dom);
    this.scene = this.basic.scene;
    this.renderer = this.basic.renderer;
    this.controls = this.basic.controls;
    this.camera = this.basic.camera;

    this.sizes = new Sizes({ dom: option.dom });

    this.sizes.$on("resize", () => {
      this.renderer.setSize(
        Number(this.sizes.viewport.width),
        Number(this.sizes.viewport.height),
      );
      this.camera.aspect =
        Number(this.sizes.viewport.width) / Number(this.sizes.viewport.height);
      this.camera.updateProjectionMatrix();
    });

    this.resources = new Resources(async () => {
      try {
        await this.createEarth();
        // Start render loop (will skip actual rendering if paused)
        this.render();
      } catch (error) {
        console.error("Failed to initialize Earth:", error);
      }
    });
  }

  async createEarth() {
    this.earth = new Earth({
      data: Data,
      dom: this.option.dom,
      textures: this.resources.textures,
      earth: {
        radius: 50,
        rotateSpeed: 0.002,
        isRotation: true,
      },
      satellite: {
        show: false,
        rotateSpeed: -0.01,
        size: 1,
        number: 2,
      },
      punctuation: {
        circleColor: 0x3892ff,
        lightColumn: {
          startColor: 0xe4007f,
          endColor: 0xffffff,
        },
      },
      flyLine: {
        color: 0x22d3ee,
        flyLineColor: 0x0cd1eb,
        speed: 0.004,
      },
    });

    this.scene.add(this.earth.group);

    await this.earth.init();
  }

  public pause() {
    this.isPaused = true;
    if (this.earth) {
      this.earth.pauseRotation();
    }
  }

  public resume() {
    this.isPaused = false;
    if (this.earth) {
      this.earth.resumeRotation();
    }
    if (this.animationId === null && !this.isDestroyed) {
      this.render();
    }
  }

  public render() {
    if (this.isDestroyed) return;

    // Don't schedule next frame when paused - saves CPU
    if (this.isPaused) {
      this.animationId = null;
      return;
    }

    this.animationId = requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
    if (this.controls) {
      this.controls.update();
    }
    if (this.earth) {
      this.earth.render();
    }
  }

  public destroy() {
    this.isDestroyed = true;

    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    // Cleanup Earth instance and its resources
    if (this.earth) {
      this.earth.destroy();
    }

    // Dispose all textures from Resources instance
    if (this.resources) {
      this.resources.destroy();
    }

    if (this.sizes) {
      this.sizes.destroy();
    }

    if (this.basic) {
      this.basic.destroy();
    }

    if (this.scene) {
      this.scene.traverse((child: Object3D) => {
        if (child instanceof Mesh) {
          child.geometry?.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
        if (child instanceof Points) {
          child.geometry?.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
        // Also handle Sprites which are not Meshes
        if (child instanceof Sprite) {
          if (child.material) {
            const material = child.material as SpriteMaterial;
            // The following line seems misplaced for SpriteMaterial, as ShaderMaterial is not typical for Sprites.
            // Assuming the intent was to check for ShaderMaterial on any object, but it's inside Sprite block.
            // If it's meant to be a general check for ShaderMaterial, it should be outside this specific Sprite block.
            // For now, I'm placing it as requested, but it might need further clarification.
            if (
              (child as any).material &&
              (child as any).material.type === "ShaderMaterial"
            ) {
              // If the material is a ShaderMaterial, it might not have a 'map' property directly.
              // This block might need adjustment based on actual usage.
            }
            if (material.map) {
              material.map.dispose();
            }
            material.dispose();
          }
        }
      });
      this.scene.clear();
    }
  }
}
