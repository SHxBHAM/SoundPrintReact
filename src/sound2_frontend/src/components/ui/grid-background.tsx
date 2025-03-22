"use client";
import { useEffect, useRef } from "react";
import { cn } from "../../lib/utils";

export const GridBackground = ({
  className = "",
  speed = "fast",
  blur = 1,
  intensity = 1,
  lineOpacity = 0.1,
}: {
  className?: string;
  speed?: "slow" | "fast";
  blur?: number;
  intensity?: number;
  lineOpacity?: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const setSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    setSize();
    window.addEventListener("resize", setSize);

    let animationFrameId: number;
    let time = 0;
    const speedFactor = speed === "fast" ? 0.002 : 0.0007;

    const draw = () => {
      time += speedFactor;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gridSize = 40;
      const maxDistance = Math.sqrt(
        canvas.width * canvas.width + canvas.height * canvas.height
      );

      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          const distanceFromCenter = Math.sqrt(
            Math.pow(x - canvas.width / 2, 2) +
              Math.pow(y - canvas.height / 2, 2)
          );
          const normalizedDistance = distanceFromCenter / maxDistance;

          const movement = Math.sin(time + normalizedDistance * 10) * intensity;

          ctx.fillStyle = `rgba(255, 255, 255, ${lineOpacity})`;
          ctx.beginPath();
          ctx.arc(x + movement * 20, y + movement * 20, 1, 0, 2 * Math.PI);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", setSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [speed, blur, intensity, lineOpacity]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("opacity-50 filter blur-[1px]", className)}
      style={{
        filter: `blur(${blur}px)`,
      }}
    />
  );
};
