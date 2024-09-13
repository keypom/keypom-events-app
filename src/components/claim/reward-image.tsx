import React, { useEffect, useRef } from "react";
import { Box, Image } from "@chakra-ui/react";

export const ImageSplit = ({ numFound, numPieces, imgSrc }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear the canvas before drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.sqrt(2) * 100; // Enough to cover the 200x200 box

    // Adjusted to start from top-right (0 degree)
    const sliceAngle = (2 * Math.PI) / numPieces;
    const startAngleOffset = Math.PI; // Adjust to start from top-right

    for (let i = 0; i < numPieces; i++) {
      const startAngle = startAngleOffset + i * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      // Color the slice: transparent for found, black for the rest
      if (i < numFound) {
        ctx.fillStyle = "rgba(0, 0, 0, 0)";
      } else {
        ctx.fillStyle = "rgba(0, 0, 0, 1)";
      }
      ctx.fill();
    }
  }, [numFound, numPieces]);

  return (
    <Box position="relative" width="200px" height="200px">
      {/* The Image */}
      <Image
        src={imgSrc}
        alt="Masked Image"
        boxSize="200px"
        objectFit="cover"
      />

      {/* Canvas for the mask */}
      <canvas
        ref={canvasRef}
        width="200px"
        height="200px"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "200px",
          height: "200px",
        }}
      />
    </Box>
  );
};
