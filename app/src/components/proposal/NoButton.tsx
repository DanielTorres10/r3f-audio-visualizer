import { useState, useRef, useEffect } from "react";
import { useAppStateActions } from "@/lib/appState";

interface Position {
  x: number;
  y: number;
}

export const NoButton = () => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { incrementNoAttempts } = useAppStateActions();

  const MIN_BUFFER = 250; // Minimum distance from YesButton

  // Get YesButton position (approximate center)
  const getYesButtonBounds = () => {
    const yesButton = document.querySelector("[data-testid='yes-button']");
    if (yesButton) {
      const rect = yesButton.getBoundingClientRect();
      return {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2,
      };
    }
    return null;
  };

  const isPointTooClose = (x: number, y: number, bounds: ReturnType<typeof getYesButtonBounds>) => {
    if (!bounds) return false;

    const dx = x - bounds.centerX;
    const dy = y - bounds.centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < MIN_BUFFER;
  };

  const getSmallMovement = (currentX: number, currentY: number): Position => {
    const padding = 20;
    const buttonWidth = 100;
    const buttonHeight = 50;
    const moveDistance = 150; // Medium movement radius for hover

    // Calculate safe boundaries
    const maxX = Math.max(padding, window.innerWidth - buttonWidth - padding);
    const maxY = Math.max(padding, window.innerHeight - buttonHeight - padding);

    // Move in a radius around current position
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * moveDistance;
    
    let newX = currentX + Math.cos(angle) * distance;
    let newY = currentY + Math.sin(angle) * distance;

    // Clamp to viewport bounds
    newX = Math.max(padding, Math.min(newX, maxX));
    newY = Math.max(padding, Math.min(newY, maxY));

    return { x: newX, y: newY };
  };

  const getLargeMovement = (currentX: number, currentY: number): Position => {
    const padding = 20;
    const buttonWidth = 100;
    const buttonHeight = 50;
    const moveDistance = 400; // Large movement radius for click

    // Calculate safe boundaries
    const maxX = Math.max(padding, window.innerWidth - buttonWidth - padding);
    const maxY = Math.max(padding, window.innerHeight - buttonHeight - padding);

    // Move in a larger radius around current position
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * moveDistance;
    
    let newX = currentX + Math.cos(angle) * distance;
    let newY = currentY + Math.sin(angle) * distance;

    // Clamp to viewport bounds
    newX = Math.max(padding, Math.min(newX, maxX));
    newY = Math.max(padding, Math.min(newY, maxY));

    return { x: newX, y: newY };
  };

  const getInitialPosition = (): Position => {
    const yesButton = document.querySelector("[data-testid='yes-button']");
    
    if (yesButton) {
      const rect = yesButton.getBoundingClientRect();
      // Start button 120px to the right of yes button
      return { x: rect.right + 30, y: rect.top + rect.height / 2 - 25 };
    }

    // Fallback if yes button not found
    return { x: window.innerWidth / 2 + 150, y: window.innerHeight / 2 };
  };

  const handleMouseEnter = () => {
    if (isMobile) return;
    
    const newPos = getSmallMovement(position.x, position.y);
    setPosition(newPos);
    incrementNoAttempts();
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
    if (!isMobile) {
      setIsMobile(true);
    }

    // For touch, move button on direct touch attempt
    const newPos = getSmallMovement(position.x, position.y);
    setPosition(newPos);
    incrementNoAttempts();

    // Prevent default to avoid triggering click
    e.preventDefault();
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (!isMobile) {
      const newPos = getLargeMovement(position.x, position.y);
      setPosition(newPos);
      incrementNoAttempts();
    }
  };

  // Initialize position next to yes button
  useEffect(() => {
    const initialPos = getInitialPosition();
    setPosition(initialPos);
  }, []);

  // Recalculate if window resizes
  useEffect(() => {
    const handleResize = () => {
      const initialPos = getInitialPosition();
      setPosition(initialPos);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <button
      ref={buttonRef}
      data-testid="no-button"
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      className="fixed px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold rounded-lg
        transition-all duration-300 ease-out hover:shadow-lg active:scale-95
        border-2 border-pink-400 text-lg pointer-events-auto select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(0, 0)",
        zIndex: 9999,
      }}
    >
      No
    </button>
  );
};

export default NoButton;
