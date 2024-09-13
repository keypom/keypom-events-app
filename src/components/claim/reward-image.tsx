import React, { useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";
import { Canvas, painters, vector } from "headbreaker";

interface ImageRevealCSSProps {
  imageSrc: string;
  numFound: number;
  numRequired: number;
}

export const ImageReveal: React.FC<ImageRevealCSSProps> = ({
  imageSrc,
  numFound,
  numRequired,
}) => {
  const puzzleRef = useRef(null);

  useEffect(() => {
    let vangogh = new Image();
    vangogh.src = imageSrc;
    vangogh.onload = () => {
      const puzzle = puzzleRef.current;
      const background = new Canvas(puzzle.id, {
        width: 800,
        height: 650,
        pieceSize: 100,
        proximity: 20,
        borderFill: 10,
        strokeWidth: 2,
        lineSoftness: 0.12,
        image: vangogh,
        // optional, but it must be set in order to activate image scaling
        maxPiecesCount: { x: 5, y: 5 },
      });

      background.adjustImagesToPuzzleHeight();
      background.sketchPiece({
        structure: "TS--",
        metadata: { id: "a", targetPosition: { x: 100, y: 100 } },
      });
      background.sketchPiece({
        structure: "SSS-",
        metadata: { id: "b", targetPosition: { x: 200, y: 100 } },
      });
      // ... more pieces ...
      background.sketchPiece({
        structure: "--TT",
        metadata: {
          id: "y",
          targetPosition: { x: 500, y: 500 },
          currentPosition: { x: 570, y: 560 },
        },
      });
      background.draw();
    };
  }, []);

  return <div ref={puzzleRef} id="puzzle"></div>;
};
