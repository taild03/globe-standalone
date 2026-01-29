/**
 * 屏幕尺寸
 */
import { EventEmitter } from "pietile-eventemitter";
import { IEvents } from "../utils/types";

type options = { dom: HTMLElement };

export default class Sizes {
  public viewport: {
    width: number;
    height: number;
  };
  public $sizeViewport: HTMLElement;
  public emitter: EventEmitter<IEvents>;

  constructor(options: options) {
    this.emitter = new EventEmitter<IEvents>();
    this.$sizeViewport = options.dom;

    this.viewport = {
      width: 0,
      height: 0,
    };

    this.resize = this.resize.bind(this);
    window.addEventListener("resize", this.resize);

    this.resize();
  }

  $on<T extends keyof IEvents>(event: T, fun: () => void) {
    this.emitter.on(event, () => {
      fun();
    });
  }

  resize() {
    this.viewport.width = this.$sizeViewport.offsetWidth;
    this.viewport.height = this.$sizeViewport.offsetHeight;
    this.emitter.emit("resize");
  }

  destroy() {
    window.removeEventListener("resize", this.resize);
  }
}
