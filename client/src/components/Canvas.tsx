import { useEffect, useRef } from "react";
import { Simulation } from "@/lib/simulation/Simulation";

interface CanvasProps {
  simulation: Simulation | null;
}

export default function Canvas({ simulation }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!simulation || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      canvas.width = container.clientWidth;
      canvas.height = Math.min(600, window.innerHeight - 200);
      
      simulation.canvasWidth = canvas.width;
      simulation.canvasHeight = canvas.height;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Animation loop
    const animate = () => {
      simulation.draw(ctx);
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [simulation]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full bg-white rounded-lg shadow-inner"
    />
  );
}
