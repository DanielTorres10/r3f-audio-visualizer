import { useEffect, useState } from "react";
import DiscoBackdrop from "./DiscoBackdrop";
import NoButton from "./NoButton";
import YesButton from "./YesButton";

interface ProposalScreenProps {
  onComplete?: () => void;
}

export const ProposalScreen = ({ onComplete }: ProposalScreenProps) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleYesClick = () => {
    setIsTransitioning(true);
    // Wait for fade-out animation before calling onComplete
    setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 800);
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* Disco backdrop with particles and disco ball */}
      <DiscoBackdrop />

      {/* Main proposal content */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div
          className={`text-center transition-all duration-700 ${
            isTransitioning
              ? "opacity-0 scale-95"
              : "opacity-100 scale-100"
          }`}
        >
          {/* Proposal question */}
          <h1
            className="text-5xl md:text-7xl font-black mb-16 text-transparent bg-clip-text
            bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400
            animate-pulse drop-shadow-lg"
            style={{
              textShadow: `
                0 0 20px rgba(255, 105, 180, 0.6),
                0 0 40px rgba(138, 43, 226, 0.4),
                0 0 60px rgba(255, 192, 203, 0.2)
              `,
              letterSpacing: "0.05em",
              fontStyle: "italic",
            }}
          >
            Cecilia, will you be my valentine?
          </h1>

          {/* Buttons container - side by side */}
          <div className="flex gap-8 items-center justify-center">
            <YesButton onYesClick={handleYesClick} />
            <NoButton />
          </div>

          {/* Decorative elements */}
          <div className="mt-12 space-y-2">
            <p className="text-pink-300 text-sm font-semibold animate-bounce">
              💕 Make a choice 💕
            </p>
            <div className="flex justify-center gap-4">
              <span className="text-3xl animate-spin" style={{ animationDuration: "3s" }}>
                ✨
              </span>
              <span className="text-3xl animate-spin" style={{ animationDuration: "4s" }}>
                💃
              </span>
              <span className="text-3xl animate-spin" style={{ animationDuration: "3s" }}>
                ✨
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalScreen;
