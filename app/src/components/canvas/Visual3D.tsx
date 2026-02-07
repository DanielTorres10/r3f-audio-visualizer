import { BackgroundFog, CanvasBackground } from "@/components/canvas/common";
import ModalVisual from "@/components/visualizers/visualizerModal";
import { useAppStateActions, useCameraState, useUser } from "@/lib/appState";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";

import { AutoOrbitCameraControls } from "./AutoOrbitCamera";
import { PaletteTracker } from "./paletteTracker";

const CameraControls = () => {
  const { mode, autoOrbitAfterSleepMs } = useCameraState();
  const { setCamera } = useAppStateActions();
  const { canvasInteractionEventTracker } = useUser();

  useFrame(() => {
    if (
      mode === "ORBIT_CONTROLS" &&
      autoOrbitAfterSleepMs > 0 &&
      canvasInteractionEventTracker.msSinceLastEvent > autoOrbitAfterSleepMs
    ) {
      setCamera({ mode: "AUTO_ORBIT" });
    } else if (
      mode === "AUTO_ORBIT" &&
      canvasInteractionEventTracker.msSinceLastEvent < autoOrbitAfterSleepMs
    ) {
      setCamera({ mode: "ORBIT_CONTROLS" });
    }
  });

  switch (mode) {
    case "ORBIT_CONTROLS":
      return <OrbitControls makeDefault />;
    case "AUTO_ORBIT":
      return <AutoOrbitCameraControls />;
    default:
      return mode satisfies never;
  }
};

const Visual3DCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [contextLost, setContextLost] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      setContextLost(true);
      console.warn("[WebGL] Context lost - stopping render");
    };

    const handleContextRestored = () => {
      setContextLost(false);
      console.info("[WebGL] Context restored - resuming render");
    };

    canvas.addEventListener("webglcontextlost", handleContextLost, false);
    canvas.addEventListener("webglcontextrestored", handleContextRestored, false);

    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
    };
  }, []);

  if (contextLost) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="text-center">
          <p className="text-white text-lg">WebGL context lost</p>
          <p className="text-gray-400 text-sm mt-2">Attempting to restore...</p>
        </div>
      </div>
    );
  }

  return (
    <Canvas
      ref={canvasRef}
      camera={{
        fov: 45,
        near: 1,
        far: 1000,
        position: [-17, -6, 6.5],
        up: [0, 0, 1],
      }}
      linear={true}
    >
      <CanvasBackground />
      <ambientLight intensity={Math.PI} />
      <BackgroundFog />
      <ModalVisual />
      {/* <Stats /> */}
      <CameraControls />
      <PaletteTracker />
    </Canvas>
  );
};

export default Visual3DCanvas;
