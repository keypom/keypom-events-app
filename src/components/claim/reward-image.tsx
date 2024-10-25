import { useEffect, useRef } from "react";
import { Box, useBreakpointValue } from "@chakra-ui/react";

export const ImageSplit = ({ numFound, numPieces, children }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Set responsive sizes using Chakra's `useBreakpointValue` hook
  const boxSize = useBreakpointValue({
    base: "125px",
    sm: "125px",
    iphone13: "150px",
    md: "200px", // for iPhone 14 Pro Max size
  });

  useEffect(() => {
    const drawCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return; // If the canvas is null, exit the function
      if (!boxSize) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return; // If the context is null, exit the function

      // Clear the canvas before drawing
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = (Math.sqrt(2) * parseFloat(boxSize)) / 2; // Adjust radius based on boxSize

      const sliceAngle = (2 * Math.PI) / numPieces;
      const startAngleOffset = Math.PI;

      for (let i = 0; i < numPieces; i++) {
        const startAngle = startAngleOffset + i * sliceAngle;
        const endAngle = startAngle + sliceAngle;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();

        if (i < numFound) {
          ctx.fillStyle = "rgba(0, 0, 0, 0)";
        } else {
          ctx.fillStyle = "rgba(0, 0, 0, 0.90)";
        }
        ctx.fill();
      }
    };

    // Draw immediately and on boxSize changes
    drawCanvas();

    // Also add a slight delay to catch any delayed render issues
    const timeoutId = setTimeout(drawCanvas, 50);
    return () => clearTimeout(timeoutId);
  }, [numFound, numPieces, boxSize]);

  return (
    <Box position="relative" width={boxSize} height={boxSize}>
      {/* The passed component */}
      <Box
        position="absolute"
        top={0}
        left={0}
        width={boxSize}
        height={boxSize}
      >
        {children}
      </Box>

      {/* Canvas for the mask */}
      <canvas
        ref={canvasRef}
        width={parseFloat(boxSize || "150px")}
        height={parseFloat(boxSize || "150px")}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: boxSize,
          height: boxSize,
        }}
      />
    </Box>
  );
};
