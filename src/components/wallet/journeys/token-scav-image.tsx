import { Flex, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface TokenScavRewardImageProps {
  tokenAmount: string;
  boxHeight?: string; // Height of the box
  boxWidth?: string; // Width of the box
  bgColor?: string; // Background color prop
  tokenColor?: string; // Text color for token amount
  labelFontSize?: string; // Font size for label (e.g., SOV3)
  borderRadius?: string; // Border radius of the box
  labelColor?: string; // Text color for label
  tokenFontSize?: string; // Font size for token amount
}

export const TokenScavRewardImage = ({
  tokenAmount,
  tokenFontSize,
  boxHeight = "100px",
  boxWidth = "100px",
  borderRadius = "0px",
  bgColor = "gray.200", // Default background color
  tokenColor = "black", // Default token text color
  labelFontSize = "22px", // Default font size for the label
  labelColor = "black", // Default label text color
}: TokenScavRewardImageProps) => {
  const [responsiveFontSize, setResponsiveFontSize] = useState<string>("108px");

  useEffect(() => {
    const numericBoxWidth = parseFloat(boxWidth);
    const tokenLength = tokenAmount.length;
    const scalingFactor = 0.75;
    const newFontSize = numericBoxWidth / (tokenLength * scalingFactor);
    const fontSize = Math.max(12, Math.min(newFontSize, 108));
    setResponsiveFontSize(`${fontSize}px`);
  }, [boxWidth, tokenAmount]);

  return (
    <Flex
      w={boxWidth}
      h={boxHeight}
      flexShrink={0}
      px={4}
      borderRadius={borderRadius}
      bg={bgColor}
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      {/* Token amount */}
      <Heading
        as="h3"
        fontSize={tokenFontSize || responsiveFontSize}
        fontWeight="bold"
        color={tokenColor}
        lineHeight="1.1"
        textAlign="center"
        whiteSpace="nowrap"
        overflow="hidden"
        textOverflow="ellipsis"
      >
        {tokenAmount}
      </Heading>

      {/* Label text (e.g., SOV3) */}
      <Heading
        as="h4"
        fontWeight="normal"
        textAlign="center"
        color={labelColor}
        fontSize={labelFontSize}
        mt={1}
      >
        SOV3
      </Heading>
    </Flex>
  );
};
