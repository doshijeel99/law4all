"use client";

import { useEffect, useRef } from "react";

const Spirograph = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const R = 5; // Reduced outer circle radius
    const r = 3; // Inner circle radius remains the same
    const a = 1; // Reduced distance from the center of the inner circle
    let theta = 0;
    const colors = ["#FFD700", "#FF4500", "#1E90FF", "#32CD32", "#FF69B4"];
    let colorIndex = 0;

    let pauseFrames = 0; // Add a counter for pausing

    const drawSpirograph = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const scale = Math.min(canvas.width, canvas.height) / 12;
      const offsetX = canvas.width / 2;
      const offsetY = canvas.height / 2;

      // Draw spirograph
      ctx.beginPath();
      ctx.strokeStyle = colors[colorIndex];
      ctx.lineWidth = 2;

      for (let t = 0; t <= theta; t += 0.1) {
        const x =
          (R - r) * Math.cos((r / R) * t) + a * Math.cos((1 - r / R) * t);
        const y =
          (R - r) * Math.sin((r / R) * t) - a * Math.sin((1 - r / R) * t);

        const scaledX = x * scale + offsetX;
        const scaledY = y * scale + offsetY;

        if (t === 0) {
          ctx.moveTo(scaledX, scaledY);
        } else {
          ctx.lineTo(scaledX, scaledY);
        }
      }

      ctx.stroke();

      if (theta >= 2 * Math.PI * R) {
        if (pauseFrames < 30) {
          // Pause for 30 frames
          pauseFrames++;
        } else {
          theta = 0;
          colorIndex = (colorIndex + 1) % colors.length;
          pauseFrames = 0; // Reset pause counter
        }
      } else {
        theta += 0.1;
      }
    };

    const animate = () => {
      drawSpirograph();
      requestAnimationFrame(animate);
    };

    animate();
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []); // Re-run effect when theme changes

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        background: "transparent",
        border: "none",
      }}
    />
  );
};

export default Spirograph;
