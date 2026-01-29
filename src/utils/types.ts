// Type definitions for the 3D Earth component

export type punctuation = {
  circleColor: number;
  lightColumn: {
    startColor: number;
    endColor: number;
  };
};

export interface IEvents {
  resize: () => void;
}

export interface IWord {
  dom: HTMLElement;
  startPaused?: boolean; // Start with rendering paused
}
