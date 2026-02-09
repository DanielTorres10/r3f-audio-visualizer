import { useEffect, useRef, useState, useCallback } from "react";
import useTimedReveal from "@/hooks/useTimedReveal";
import useLetterReveal from "@/hooks/useLetterReveal";

export const DateReveal = () => {
  const isVisible = useTimedReveal(286); // 286 seconds
  const dateText = "October 21, 2026";
  const revealedText = useLetterReveal(286, dateText, 12);

  return (
    <div
      className={`transition-all duration-500 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="text-4xl md:text-6xl font-black text-center text-pink-400"
        style={{
          animation: isVisible
            ? "glowPulse 1.5s ease-in-out infinite"
            : "none",
          textShadow: `
            0 0 10px rgba(255, 105, 180, 0.6),
            0 0 20px rgba(138, 43, 226, 0.3)
          `,
          letterSpacing: "0.02em",
          minHeight: "80px",
        }}
      >
        {revealedText}
      </div>
    </div>
  );
};

export const LocationReveal = () => {
  const isVisible = useTimedReveal(290); // 290 seconds
  const locationText = "New York: Madison Square Garden";
  const revealedText = useLetterReveal(290, locationText, 12);

  return (
    <div
      className={`transition-all duration-500 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="text-3xl md:text-5xl font-bold text-center text-purple-300 mt-4"
        style={{
          animation: isVisible
            ? "glowPulse 1.5s ease-in-out 0.3s infinite"
            : "none",
          textShadow: `
            0 0 10px rgba(186, 85, 211, 0.6),
            0 0 20px rgba(255, 105, 180, 0.2)
          `,
          letterSpacing: "0.02em",
        }}
      >
        {revealedText}
      </div>
    </div>
  );
};

export const EventReveal = ({ imageUrl }: { imageUrl?: string }) => {
  const isVisible = useTimedReveal(294); // 294 seconds
  const eventText = "Harry Styles: TOGETHER, TOGETHER";
  const revealedText = useLetterReveal(294, eventText, 12);
  const imageVisible = useTimedReveal(306); // 294 + 12 = 306 seconds
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLImageElement>) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    });
  }, [dragOffset]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLImageElement>) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    const maxOffset = 200;
    const boundedX = Math.max(-maxOffset, Math.min(maxOffset, newX));
    const boundedY = Math.max(-maxOffset, Math.min(maxOffset, newY));
    
    setDragOffset({
      x: boundedX,
      y: boundedY,
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      const maxOffset = 200;
      const boundedX = Math.max(-maxOffset, Math.min(maxOffset, newX));
      const boundedY = Math.max(-maxOffset, Math.min(maxOffset, newY));
      
      setDragOffset({
        x: boundedX,
        y: boundedY,
      });
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseleave', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseleave', handleGlobalMouseUp);
    };
  }, [isDragging, dragStart]);

  useEffect(() => {
    if (!imageVisible && (dragOffset.x !== 0 || dragOffset.y !== 0)) {
      setDragOffset({ x: 0, y: 0 });
    }
  }, [imageVisible, dragOffset]);

  return (
    <div
      className={`transition-all duration-700 transform ${
        isVisible
          ? "opacity-100 scale-100"
          : "opacity-0 scale-95 pointer-events-none"
      }`}
      style={{
        transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      <div className="mt-6 text-center">
        <div
          className="text-3xl md:text-5xl font-black text-transparent bg-clip-text
          bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500 mb-4"
          style={{
            textShadow: `
              0 0 15px rgba(255, 215, 0, 0.6),
              0 0 30px rgba(138, 43, 226, 0.3)
            `,
            letterSpacing: "0.03em",
            animation: isVisible ? "dramaticPulse 2s ease-in-out infinite" : "none",
          }}
        >
          {revealedText}
        </div>

        {imageUrl && imageVisible && (
          <div className="mt-6 flex justify-center pointer-events-auto">
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Harry Styles Concert"
              className="max-w-sm md:max-w-lg rounded-lg shadow-2xl cursor-grab active:cursor-grabbing pointer-events-auto"
              style={{
                boxShadow: `
                  0 0 30px rgba(255, 215, 0, 0.4),
                  0 0 60px rgba(138, 43, 226, 0.2)
                `,
                transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
                transition: isDragging ? "none" : "transform 0.3s ease-out",
                userSelect: "none",
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              draggable={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export const TimedReveals = ({ imageUrl }: { imageUrl?: string }) => {
  const styleInjectedRef = useRef(false);

  useEffect(() => {
    if (styleInjectedRef.current) return;
    styleInjectedRef.current = true;

    const style = document.createElement("style");
    style.textContent = `
      @keyframes glowPulse {
        0%, 100% {
          text-shadow: 0 0 10px rgba(255, 105, 180, 0.6),
                       0 0 20px rgba(138, 43, 226, 0.3);
        }
        50% {
          text-shadow: 0 0 20px rgba(255, 105, 180, 1),
                       0 0 40px rgba(138, 43, 226, 0.6);
        }
      }

      @keyframes dramaticPulse {
        0%, 100% {
          filter: brightness(1);
          text-shadow: 0 0 15px rgba(255, 215, 0, 0.6),
                       0 0 30px rgba(255, 105, 180, 0.4);
        }
        50% {
          filter: brightness(1.2);
          text-shadow: 0 0 30px rgba(255, 215, 0, 1),
                       0 0 60px rgba(255, 105, 180, 0.8);
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (style.parentNode === document.head) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-start pt-20 z-20 pointer-events-none">
      <DateReveal />
      <LocationReveal />
      <EventReveal imageUrl={imageUrl} />
    </div>
  );
};

export default TimedReveals;