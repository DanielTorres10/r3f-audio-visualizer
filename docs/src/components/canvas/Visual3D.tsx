import { BackgroundFog, CanvasBackground } from "@/components/canvas/common";
import ModalVisual from "@/components/visualizers/visualizerModal";
import { useAppStateActions, useCameraState, useUser } from "@/lib/appState";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState, useCallback, Suspense } from "react";

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

// Component that safely handles WebGL context events
const WebGLContextHandler = () => {
  const { gl } = useThree();
  const [contextLost, setContextLost] = useState(false);
  const contextLostRef = useRef(false);

  useEffect(() => {
    const canvas = gl.domElement;
    if (!canvas) return;

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      console.warn("[WebGL] Context lost event triggered");
      contextLostRef.current = true;
      setContextLost(true);
      
      // Try to restore after a delay
      setTimeout(() => {
        if (contextLostRef.current) {
          console.log("[WebGL] Attempting to restore context...");
          // This might help in some browsers
          try {
            const newCanvas = document.createElement('canvas');
            canvas.parentNode?.replaceChild(newCanvas, canvas);
          } catch (e) {
            console.error("[WebGL] Failed to restore:", e);
          }
        }
      }, 1000);
    };

    const handleContextRestored = () => {
      console.info("[WebGL] Context restored");
      contextLostRef.current = false;
      setContextLost(false);
    };

    canvas.addEventListener("webglcontextlost", handleContextLost, false);
    canvas.addEventListener("webglcontextrestored", handleContextRestored, false);

    // Add additional error handling for WebGL errors
    const handleWebGLError = (event: WebGLContextEvent) => {
      console.error("[WebGL] WebGL error:", event);
    };

    canvas.addEventListener("webglcontextcreationerror", handleWebGLError, false);

    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
      canvas.removeEventListener("webglcontextcreationerror", handleWebGLError);
    };
  }, [gl]);

  // Monitor WebGL memory if available
  useEffect(() => {
    let memoryInterval: ReturnType<typeof setInterval> | null = null;
    
    if ((performance as any).memory) {
      memoryInterval = setInterval(() => {
        const mem = (performance as any).memory;
        const usedMB = (mem.usedJSHeapSize / 1048576).toFixed(1);
        const limitMB = (mem.jsHeapSizeLimit / 1048576).toFixed(1);
        const percentage = ((mem.usedJSHeapSize / mem.jsHeapSizeLimit) * 100).toFixed(1);
        
        if (parseFloat(percentage) > 80) {
          console.warn(`[WebGL] High memory usage: ${usedMB}MB / ${limitMB}MB (${percentage}%)`);
        }
      }, 5000); // Check every 5 seconds
    }

    return () => {
      if (memoryInterval) clearInterval(memoryInterval);
    };
  }, []);

  return null;
};

// Simple fallback when context is lost
const ContextLostFallback = ({ onRetry }: { onRetry: () => void }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black p-4">
      <div className="text-center max-w-md">
        <h2 className="text-white text-xl mb-2">WebGL Context Lost</h2>
        <p className="text-gray-400 text-sm mb-4">
          The 3D rendering context has been lost. This can happen due to memory constraints, 
          GPU driver issues, or browser limitations.
        </p>
        <div className="space-y-3">
          <button 
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition-colors"
            onClick={onRetry}
          >
            Reload 3D Canvas
          </button>
          <button 
            className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white transition-colors"
            onClick={() => window.location.reload()}
          >
            Reload Entire Page
          </button>
        </div>
        <div className="mt-6 text-xs text-gray-500">
          <p>Tips to prevent this:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Close other tabs with heavy graphics</li>
            <li>Update your graphics drivers</li>
            <li>Use Chrome/Edge for better WebGL support</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const Visual3DCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [contextLost, setContextLost] = useState(false);
  const [key, setKey] = useState(0); // Used to force remount

  // Handle context events at the DOM level
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      console.warn("[WebGL] DOM-level context lost");
      setContextLost(true);
      
      // Clear any pending timeouts
      if (timeoutId) clearTimeout(timeoutId);
      
      // Try to recover automatically after 1 second
      timeoutId = setTimeout(() => {
        console.log("[WebGL] Attempting automatic recovery...");
        setKey(prev => prev + 1); // Force remount by changing key
      }, 1000);
    };

    const handleContextRestored = () => {
      console.info("[WebGL] DOM-level context restored");
      setContextLost(false);
      if (timeoutId) clearTimeout(timeoutId);
    };

    canvas.addEventListener("webglcontextlost", handleContextLost, false);
    canvas.addEventListener("webglcontextrestored", handleContextRestored, false);

    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const handleRetry = () => {
    setContextLost(false);
    setKey(prev => prev + 1); // Force remount
  };

  if (contextLost) {
    return <ContextLostFallback onRetry={handleRetry} />;
  }

  return (
    <Canvas
      key={key} // Force fresh instance when key changes
      ref={canvasRef}
      camera={{
        fov: 45,
        near: 1,
        far: 1000,
        position: [-17, -6, 6.5],
        up: [0, 0, 1],
      }}
      linear={true}
      gl={{
        powerPreference: "high-performance",
        antialias: true,
        alpha: false,
        preserveDrawingBuffer: false,
        stencil: false,
        depth: true,
        failIfMajorPerformanceCaveat: false, // Allow software rendering as fallback
      }}
      dpr={Math.min(window.devicePixelRatio, 2)} // Cap at 2x for performance
      performance={{ min: 0.5, max: 1 }} // Adaptive performance
      onCreated={({ gl, scene, camera }) => {
        console.log("[WebGL] Canvas created successfully");
        
        // Disable automatic context loss for debugging
        try {
          // @ts-ignore - This is for debugging only
          if (gl.getContext().loseContext) {
            console.log("[WebGL] Context loss debugging available");
          }
        } catch (e) {
          // Ignore
        }

        // Set up scene for better memory management
        scene.traverse((obj: any) => {
          if (obj.dispose && typeof obj.dispose === 'function') {
            // Mark for disposal on unmount
            obj.__shouldDispose = true;
          }
        });

        // Store for debugging
        (window as any).__webglDebug = {
          vendor: gl.getContext().getParameter(gl.getContext().VENDOR),
          renderer: gl.getContext().getParameter(gl.getContext().RENDERER),
        };
      }}
      onPointerMissed={() => {
        // Empty handler to prevent errors
      }}
    >
      <Suspense fallback={null}>
        <WebGLContextHandler />
        <CanvasBackground />
        <ambientLight intensity={Math.PI} />
        <BackgroundFog />
        <ModalVisual />
        <CameraControls />
        <PaletteTracker />
      </Suspense>
    </Canvas>
  );
};

export default Visual3DCanvas;