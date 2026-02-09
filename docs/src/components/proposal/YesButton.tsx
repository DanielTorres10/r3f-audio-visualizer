import { useAppStateActions, useValentineState } from "@/lib/appState";

export const YesButton = ({ onYesClick }: { onYesClick?: () => void }) => {
  const { noButtonAttempts } = useValentineState();
  const { incrementNoAttempts, setYesClicked, setValentinePhase } = useAppStateActions();

  // Calculate scale based on attempts: 1.0 → 1.1 → 1.25 → 1.4 → 1.5
  const getScale = () => {
    const scales = [1.0, 1.1, 1.25, 1.4, 1.5];
    return scales[Math.min(noButtonAttempts, scales.length - 1)];
  };

  // Calculate glow intensity
  const getGlowIntensity = () => {
    return Math.min(noButtonAttempts * 0.1, 1);
  };

  const handleClick = () => {
    setYesClicked(true);
    setValentinePhase("visual-journey");
    
    if (onYesClick) {
      onYesClick();
    }

    // Trigger celebratory effects
    triggerCelebration();
  };

  const triggerCelebration = () => {
    // Create particle burst effect
    const button = document.querySelector("[data-testid='yes-button']") as HTMLElement;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 30; i++) {
      const particle = document.createElement("div");
      particle.className = "fixed w-3 h-3 pointer-events-none rounded-full";
      
      // Alternate between pink and gold colors
      if (i % 2 === 0) {
        particle.style.background = "#FF1493";
      } else {
        particle.style.background = "#FFD700";
      }

      particle.style.left = `${centerX}px`;
      particle.style.top = `${centerY}px`;
      particle.style.boxShadow = "0 0 8px currentColor";

      document.body.appendChild(particle);

      const angle = (i / 30) * Math.PI * 2;
      const velocity = 2 + Math.random() * 2;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;

      let x = centerX;
      let y = centerY;
      let life = 1;
      const duration = 60;

      const animate = () => {
        life -= 1 / duration;

        x += vx;
        y += vy;

        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.opacity = String(Math.max(0, life));

        if (life > 0) {
          requestAnimationFrame(animate);
        } else {
          particle.remove();
        }
      };

      animate();
    }
  };

  const scale = getScale();
  const glowIntensity = getGlowIntensity();

  return (
    <button
      data-testid="yes-button"
      onClick={handleClick}
      className="relative px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600
        text-white font-bold text-2xl rounded-full
        transition-all duration-300 ease-out
        border-3 border-pink-300 hover:border-pink-200
        shadow-2xl hover:shadow-pink-500/50 active:scale-95
        transform z-50 cursor-pointer select-none"
      style={{
        transform: `scale(${scale})`,
        boxShadow: `0 0 ${20 + glowIntensity * 40}px rgba(255, 105, 180, ${0.4 + glowIntensity * 0.6}),
                     0 0 ${10 + glowIntensity * 20}px rgba(138, 43, 226, ${0.3 + glowIntensity * 0.4})`,
        textShadow: `0 0 ${10 + glowIntensity * 20}px rgba(255, 182, 193, 0.8)`,
      }}
    >
      Yes!
      
      {/* Pulsing glow animation */}
      <div
        className="absolute inset-0 rounded-full opacity-0 animate-pulse"
        style={{
          border: "2px solid rgba(255, 105, 180, 0.5)",
          animation: `pulse ${0.8 + (1 - glowIntensity) * 0.4}s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
        }}
      />
    </button>
  );
};

export default YesButton;
