import { useEffect, useRef } from "react";
import type World from "./core/World";

const GlobeCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<World | null>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!containerRef.current || isInitialized.current) return;

    const container = containerRef.current;

    const initGlobe = async () => {
      if (isInitialized.current) return;
      isInitialized.current = true;

      const { default: World } = await import("./core/World");

      worldRef.current = new World({
        dom: container,
        startPaused: false,
      });
    };

    initGlobe();

    return () => {
      if (worldRef.current) {
        worldRef.current.destroy();
        worldRef.current = null;
      }
      isInitialized.current = false;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100vw",
        height: "100vh",
      }}
    />
  );
};

export default GlobeCanvas;
