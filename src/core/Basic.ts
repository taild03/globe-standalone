/**
 * Create Three.js core components
 * Scene, Camera, Renderer, Controls
 */

import { Scene, PerspectiveCamera, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export class Basic {
  public scene: Scene;
  public camera: PerspectiveCamera;
  public renderer: WebGLRenderer;
  public controls: OrbitControls;
  public dom: HTMLElement;

  constructor(dom: HTMLElement) {
    this.dom = dom;
    this.initScenes();
    this.setControls();
  }

  initScenes() {
    this.scene = new Scene();

    this.camera = new PerspectiveCamera(
      45,
      this.dom.offsetWidth / this.dom.offsetHeight,
      1,
      100000,
    );
    this.camera.position.set(0, 30, -250);

    this.renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.dom.offsetWidth, this.dom.offsetHeight);
    this.dom.appendChild(this.renderer.domElement);
  }

  setControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.controls.autoRotateSpeed = 3;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = false;
    this.controls.minDistance = 100;
    this.controls.maxDistance = 300;
    this.controls.enablePan = false;
  }

  destroy() {
    this.renderer.dispose();
    this.dom.removeChild(this.renderer.domElement);
  }
}
