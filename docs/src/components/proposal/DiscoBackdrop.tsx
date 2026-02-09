import { useEffect, useRef } from "react";

export const DiscoBackdrop = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Particle system for sparkles
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
    }> = [];

    // Generate initial particles
    const generateParticles = (count: number) => {
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          life: 0,
          maxLife: Math.random() * 100 + 50,
          size: Math.random() * 2 + 1,
        });
      }
    };

    generateParticles(50);

    // Disco ball state
    let ballRotation = 0;
    const ballRadius = 40;

    const animate = () => {
      // Recalculate ball position dynamically (handles resize)
      const ballX = canvas.width / 2;
      const ballY = canvas.height / 6;

      // Clear canvas with semi-transparent background for trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.95)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Update position
        p.x += p.vx;
        p.y += p.vy;
        p.life += 1;

        // Gravity effect (slight downward pull)
        p.vy += 0.01;

        // Fade out effect
        const opacity = 1 - p.life / p.maxLife;

        // Draw particle
        ctx.fillStyle = `rgba(255, 105, 180, ${opacity * 0.8})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Regenerate dead particles
        if (p.life >= p.maxLife) {
          particles[i] = {
            x: Math.random() * canvas.width,
            y: -10,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            life: 0,
            maxLife: Math.random() * 100 + 50,
            size: Math.random() * 2 + 1,
          };
        }
      }

      // Draw disco ball
      ballRotation += 0.01;

      // Outer glow
      const gradient = ctx.createRadialGradient(
        ballX,
        ballY,
        0,
        ballX,
        ballY,
        ballRadius + 20
      );
      gradient.addColorStop(0, "rgba(255, 105, 180, 0.4)");
      gradient.addColorStop(1, "rgba(138, 43, 226, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(ballX, ballY, ballRadius + 20, 0, Math.PI * 2);
      ctx.fill();

      // Main ball
      ctx.fillStyle = "#FFD700";
      ctx.beginPath();
      ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
      ctx.fill();

      // Reflective squares on disco ball
      ctx.save();
      ctx.translate(ballX, ballY);
      ctx.rotate(ballRotation);

      const squareSize = 8;
      const spacing = 12;

      for (let i = -3; i <= 3; i++) {
        for (let j = -3; j <= 3; j++) {
          const x = i * spacing;
          const y = j * spacing;
          const dist = Math.sqrt(x * x + y * y);

          if (dist < ballRadius - 5) {
            // Reflective shimmer
            const shimmer =
              (Math.sin(ballRotation + dist * 0.1) * 0.5 + 0.5) * 255;
            ctx.fillStyle = `rgb(${shimmer}, ${shimmer}, 150)`;
            ctx.fillRect(x - squareSize / 2, y - squareSize / 2, squareSize, squareSize);
          }
        }
      }

      ctx.restore();

      // Radial light rays from disco ball
      for (let i = 0; i < 8; i++) {
        const angle = (ballRotation + (i * Math.PI * 2) / 8) * 2;
        const rayLength = 300;

        const gradient = ctx.createLinearGradient(
          ballX,
          ballY,
          ballX + Math.cos(angle) * rayLength,
          ballY + Math.sin(angle) * rayLength
        );
        gradient.addColorStop(0, "rgba(255, 182, 193, 0.3)");
        gradient.addColorStop(1, "rgba(255, 182, 193, 0)");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(ballX, ballY);
        ctx.lineTo(
          ballX + Math.cos(angle) * rayLength,
          ballY + Math.sin(angle) * rayLength
        );
        ctx.stroke();
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
};

export default DiscoBackdrop;
